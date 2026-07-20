# Git Changelog MCP Server

A Model Context Protocol (MCP) server that enables AI agents to inspect local git repositories and generate beautifully formatted changelogs.

## Features

This MCP server exposes two tools to LLMs:

### `git_get_recent_commits`
Fetch recent commits from a local git repository.

**Parameters:**
- `repoPath` (string, required): Absolute or relative path to the git repository
- `count` (number, optional): Number of commits to fetch (default: 20, max: 500)

**Returns:** Structured commit objects with hash, date, message, body, author name, and author email.

### `git_generate_markdown_changelog`
Generate a beautifully structured Markdown changelog grouped by Features, Fixes, and Chores.

**Parameters:**
- `commits` (array, required): Array of commit objects (typically from `git_get_recent_commits`)
- `title` (string, optional): Changelog heading (default: "Changelog")

**Returns:** Formatted Markdown changelog with commits categorized using Conventional Commits conventions.

## Installation

```bash
npm install
npm run build
```

## Usage

### Running the Server

```bash
npm start
# or
node dist/index.js
```

The server communicates over stdio using the MCP protocol.

### Configuration for Cursor or Claude Desktop

Add this server to your MCP client configuration:

**For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "git-changelog": {
      "command": "node",
      "args": ["C:/Users/user/Desktop/Jackson-CS2/Opeenn/dist/index.js"]
    }
  }
}
```

**For Cursor** (`.cursor/mcp.json` in your workspace):

```json
{
  "mcpServers": {
    "git-changelog": {
      "command": "node",
      "args": ["C:/Users/user/Desktop/Jackson-CS2/Opeenn/dist/index.js"]
    }
  }
}
```

## Example Usage in Chat

Once configured, you can ask the AI:

> "Use git_get_recent_commits to fetch the last 30 commits from C:/projects/myrepo, then generate a changelog"

The AI will:
1. Call `git_get_recent_commits` with your repo path
2. Parse the returned commit data
3. Call `git_generate_markdown_changelog` to format it beautifully

## Development

- **Build:** `npm run build`
- **Dev:** `npm run dev` (builds and runs)
- **Start:** `npm start` (runs the built server)

## Architecture

- **Entry point:** `src/index.ts`
- **Transport:** Stdio (JSON-RPC over stdin/stdout)
- **Validation:** Zod schemas for type-safe input/output
- **Git operations:** `simple-git` library
- **Error handling:** All diagnostics written to stderr to preserve the JSON-RPC stream

## Requirements

- Node.js 20+
- TypeScript 7+
- A local git repository to inspect

## License

ISC
