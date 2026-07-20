#!/usr/bin/env node
/**
 * MCP server that lets AI agents inspect local git repositories:
 *   - `git_get_recent_commits`: read the latest commits from a repo
 *   - `git_generate_markdown_changelog`: format commits into grouped Markdown
 *
 * Transport is stdio, so ALL diagnostics must go to stderr via console.error.
 * Writing anything to stdout would corrupt the JSON-RPC message stream.
 */
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { simpleGit } from "simple-git";
import type { SimpleGit } from "simple-git";
import { z } from "zod";

const SERVER_NAME = "git-changelog-mcp";
const SERVER_VERSION = "1.0.0";
const DEFAULT_COMMIT_COUNT = 20;
const MAX_COMMIT_COUNT = 500;

/**
 * Shared shape for a single commit, reused by both tools so the output of
 * `git_get_recent_commits` can be piped straight into
 * `git_generate_markdown_changelog`.
 */
const commitSchema = z.object({
  hash: z.string().describe("Full commit SHA"),
  date: z.string().describe("Author date in ISO format"),
  message: z.string().describe("Commit subject line"),
  body: z.string().default("").describe("Commit body, if any"),
  author_name: z.string().default("").describe("Commit author name"),
  author_email: z.string().default("").describe("Commit author email"),
});

type Commit = z.infer<typeof commitSchema>;

/**
 * Resolves a `SimpleGit` instance bound to `repoPath`, failing loudly when the
 * path is not a directory inside a git work tree. Errors are thrown so the
 * caller can translate them into an MCP `isError` result.
 */
async function openRepo(repoPath: string): Promise<SimpleGit> {
  const git = simpleGit({ baseDir: repoPath });

  const isRepo = await git.checkIsRepo().catch((cause: unknown) => {
    throw new Error(`Unable to access "${repoPath}": ${describeError(cause)}`);
  });

  if (!isRepo) {
    throw new Error(`"${repoPath}" is not a git repository.`);
  }

  return git;
}

/** Normalizes unknown thrown values into a readable message. */
function describeError(cause: unknown): string {
  if (cause instanceof Error) return cause.message;
  if (typeof cause === "string") return cause;
  return JSON.stringify(cause);
}
/**
 * Classifies a commit subject into a changelog section using Conventional
 * Commits prefixes, falling back to keyword heuristics.
 */
function classifyCommit(message: string): "features" | "fixes" | "chores" {
  const subject = message.trim().toLowerCase();

  if (/^(feat|feature)(\(.+\))?!?:/.test(subject)) return "features";
  if (/^fix(\(.+\))?!?:/.test(subject)) return "fixes";
  if (
    /^(chore|docs|style|refactor|perf|test|build|ci|revert)(\(.+\))?!?:/.test(
      subject,
    )
  ) {
    return "chores";
  }

  if (subject.includes("fix") || subject.includes("bug")) return "fixes";
  if (subject.startsWith("add") || subject.includes("feature")) {
    return "features";
  }

  return "chores";
}

/** Strips a Conventional Commit prefix so the changelog reads cleanly. */
function cleanSubject(message: string): string {
  return message
    .trim()
    .replace(
      /^(feat|feature|fix|chore|docs|style|refactor|perf|test|build|ci|revert)(\(.+?\))?!?:\s*/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

/** Builds the grouped Markdown changelog from a list of commits. */
function buildChangelog(commits: Commit[], title: string): string {
  const groups: Record<"features" | "fixes" | "chores", Commit[]> = {
    features: [],
    fixes: [],
    chores: [],
  };

  for (const commit of commits) {
    groups[classifyCommit(commit.message)].push(commit);
  }

  const sections: Array<{ heading: string; key: keyof typeof groups }> = [
    { heading: "### Features", key: "features" },
    { heading: "### Fixes", key: "fixes" },
    { heading: "### Chores", key: "chores" },
  ];

  const lines: string[] = [`## ${title}`, ""];
  let wroteAnySection = false;

  for (const { heading, key } of sections) {
    const entries = groups[key];
    if (entries.length === 0) continue;

    wroteAnySection = true;
    lines.push(heading, "");

    for (const commit of entries) {
      const subject = cleanSubject(commit.message) || commit.message.trim();
      const shortHash = commit.hash.slice(0, 7);
      lines.push(`- ${subject} (\`${shortHash}\`)`);
    }

    lines.push("");
  }

  if (!wroteAnySection) {
    lines.push("_No commits to report._", "");
  }

  return lines.join("\n").trimEnd() + "\n";
}
function createServer(): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );

  server.registerTool(
    "git_get_recent_commits",
    {
      title: "Get recent git commits",
      description:
        "Fetch the most recent commits from a local git repository. " +
        "Returns structured commit objects that can be passed directly to " +
        "git_generate_markdown_changelog.",
      inputSchema: z.object({
        repoPath: z
          .string()
          .min(1)
          .describe("Absolute or relative path to the local git repository"),
        count: z
          .number()
          .int()
          .positive()
          .max(MAX_COMMIT_COUNT)
          .optional()
          .describe(
            `Number of commits to fetch (default ${DEFAULT_COMMIT_COUNT}, max ${MAX_COMMIT_COUNT})`,
          ),
      }),
      outputSchema: z.object({
        repoPath: z.string(),
        count: z.number(),
        commits: z.array(commitSchema),
      }),
    },
    async ({ repoPath, count }) => {
      try {
        const git = await openRepo(repoPath);
        const maxCount = count ?? DEFAULT_COMMIT_COUNT;

        const log = await git.log({ maxCount });
        const commits: Commit[] = log.all.map((entry) => ({
          hash: entry.hash,
          date: entry.date,
          message: entry.message,
          body: entry.body ?? "",
          author_name: entry.author_name ?? "",
          author_email: entry.author_email ?? "",
        }));

        const structured = { repoPath, count: commits.length, commits };

        return {
          content: [
            { type: "text", text: JSON.stringify(structured, null, 2) },
          ],
          structuredContent: structured,
        };
      } catch (error) {
        const message = describeError(error);
        console.error(`[git_get_recent_commits] ${message}`);
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to read commits from "${repoPath}": ${message}`,
            },
          ],
        };
      }
    },
  );
  server.registerTool(
    "git_generate_markdown_changelog",
    {
      title: "Generate a Markdown changelog",
      description:
        "Format a list of commit objects into a structured Markdown " +
        "changelog grouped into Features, Fixes, and Chores.",
      inputSchema: z.object({
        commits: z
          .array(commitSchema)
          .min(1)
          .describe(
            "Commit objects, typically produced by git_get_recent_commits",
          ),
        title: z
          .string()
          .optional()
          .describe('Changelog heading (default "Changelog")'),
      }),
      outputSchema: z.object({ markdown: z.string() }),
    },
    async ({ commits, title }) => {
      try {
        const markdown = buildChangelog(commits, title ?? "Changelog");
        return {
          content: [{ type: "text", text: markdown }],
          structuredContent: { markdown },
        };
      } catch (error) {
        const message = describeError(error);
        console.error(`[git_generate_markdown_changelog] ${message}`);
        return {
          isError: true,
          content: [
            { type: "text", text: `Failed to build changelog: ${message}` },
          ],
        };
      }
    },
  );

  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${SERVER_NAME} v${SERVER_VERSION} running on stdio`);
}

main().catch((error: unknown) => {
  console.error(`Fatal error starting ${SERVER_NAME}: ${describeError(error)}`);
  process.exit(1);
});
