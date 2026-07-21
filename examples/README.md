# Examples

Real-world prompts you can use with Git Changelog MCP once it''s configured in Cursor or Claude Desktop.

## Release Notes

```
Get the last 50 commits from C:/projects/my-app and create a changelog titled "Release v2.0.0"
```

Produces a Markdown changelog grouped into Features, Fixes, and Chores, ready to paste into a GitHub Release.

## Pull Request Description

```
Fetch the commits on this branch since main and generate a changelog to use as my PR description
```

## Sprint / Standup Summary

```
Show me all commits from the past week in this repo, formatted as a changelog for our team standup
```

## Weekly Digest for Non-Technical Stakeholders

```
Get the last 20 commits from the repo at ./backend and generate a changelog titled "This Week in Backend"
```

Ask your AI assistant to lightly rewrite the bullet points in plain language after generating the changelog if the audience is non-technical.

## Multi-Repo Release Notes

```
Fetch the last 30 commits from ./frontend and the last 30 commits from ./backend,
then generate one combined changelog titled "Release v1.4.0" with separate sections for each repo
```

## Automating in CI

You can also call the underlying tools directly instead of asking the AI to do a natural-language task:

1. Call `git_get_recent_commits` with `{ "repoPath": ".", "count": 30 }`
2. Pass the returned `commits` array to `git_generate_markdown_changelog` with `{ "title": "Release v2.0.0" }`
3. Write the returned `markdown` string to `CHANGELOG.md` or attach it to a release