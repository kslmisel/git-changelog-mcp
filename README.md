<div align="center">

# 🔖 Git Changelog MCP

**MCP server that enables AI agents to read git commits and generate beautiful changelogs**

[![npm version](https://img.shields.io/npm/v/git-changelog-mcp.svg)](https://www.npmjs.com/package/git-changelog-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-2.0-green.svg)](https://modelcontextprotocol.io/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Examples](#-examples) • [Contributing](#-contributing)

</div>

---

## 🎯 What is this?

Turn your git commits into beautiful, organized changelogs **in seconds** using AI. This Model Context Protocol (MCP) server gives AI assistants like Claude and Cursor the ability to:

- 📖 Read commit history from any local git repository
- 🎨 Auto-generate formatted changelogs grouped by Features, Fixes, and Chores
- ⚡ Work 100% locally with no API keys required
- 🤖 Integrate seamlessly with any MCP-compatible AI tool

### The Problem It Solves

❌ **Before:** Manually writing changelogs is tedious and time-consuming  
❌ **Before:** Copy-pasting commit messages into release notes  
❌ **Before:** Inconsistent formatting across team members  

✅ **After:** Ask AI "generate a changelog from the last 50 commits"  
✅ **After:** Beautiful, categorized output in seconds  
✅ **After:** Consistent Conventional Commits formatting automatically  

---

## ✨ Features

### 🛠️ Two Powerful Tools

#### `git_get_recent_commits`
Fetch recent commits from a local git repository.

**Parameters:**
- `repoPath` (string, required): Absolute or relative path to the git repository
- `count` (number, optional): Number of commits to fetch (default: 20, max: 500)

**Returns:** Structured commit objects with hash, date, message, body, author name, and author email.

#### `git_generate_markdown_changelog`
Generate a beautifully structured Markdown changelog grouped by Features, Fixes, and Chores.

**Parameters:**
- `commits` (array, required): Array of commit objects (typically from `git_get_recent_commits`)
- `title` (string, optional): Changelog heading (default: "Changelog")

**Returns:** Formatted Markdown changelog with commits categorized using Conventional Commits conventions.

### 🎯 Key Benefits

- ⚡ **Lightning Fast** - Generate changelogs in seconds
- 🎨 **Beautiful Formatting** - Automatic grouping by commit type
- 🔒 **100% Local** - No external APIs, no data leaves your machine
- 🤖 **AI-Powered** - Works with Claude, Cursor, and any MCP client
- 📝 **Conventional Commits** - Smart parsing of commit message formats
- 🔧 **Flexible** - Use for releases, PRs, sprint summaries, or team reports

---

## 📦 Installation

### Option 1: Install via npm (Recommended)

```bash
npm install -g git-changelog-mcp
```

### Option 2: Clone and Build

```bash
git clone https://github.com/kslmisel/git-changelog-mcp.git
cd git-changelog-mcp
npm install
npm run build
```

---

## 🚀 Usage

### For Cursor IDE

Create or edit `.cursor/mcp.json` in your workspace:

```json
{
  "mcpServers": {
    "git-changelog": {
      "command": "npx",
      "args": ["-y", "git-changelog-mcp"]
    }
  }
}
```

**Restart Cursor** and the server will be available.

### For Claude Desktop

Add to your Claude Desktop config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "git-changelog": {
      "command": "npx",
      "args": ["-y", "git-changelog-mcp"]
    }
  }
}
```

**Restart Claude Desktop** to load the server.

### If Installed Locally

If you cloned the repo instead of using npm:

```json
{
  "mcpServers": {
    "git-changelog": {
      "command": "node",
      "args": ["/absolute/path/to/git-changelog-mcp/dist/index.js"]
    }
  }
}
```

---

## 💡 Examples

Once configured, ask your AI assistant:

### Example 1: Simple Changelog
```
Fetch the last 30 commits from this repository and generate a changelog
```

### Example 2: Release Notes
```
Get the last 50 commits from C:/projects/my-app and create a changelog 
titled "Release v2.0.0"
```

### Example 3: PR Description
```
Generate a changelog from the last 10 commits to use as a pull request description
```

### Example 4: Sprint Summary
```
Show me all commits from the past week formatted as a changelog for our standup
```

### Example Output

```markdown
## Release v2.0.0

### Features

- Add user authentication with JWT (`a1b2c3d`)
- Implement dark mode toggle (`e4f5g6h`)
- Add pagination to user list (`i7j8k9l`)

### Fixes

- Fix memory leak in WebSocket connection (`m1n2o3p`)
- Resolve CORS issues on API endpoints (`q4r5s6t`)

### Chores

- Update dependencies to latest versions (`u7v8w9x`)
- Refactor database connection pool (`y1z2a3b`)
```

---

## 🏗️ Architecture

- **Entry point:** `src/index.ts`
- **Transport:** Stdio (JSON-RPC over stdin/stdout)
- **Validation:** Zod schemas for type-safe input/output
- **Git operations:** `simple-git` library
- **Error handling:** All diagnostics written to stderr to preserve the JSON-RPC stream

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start

# Build and run in one command
npm run dev
```

---

## 📋 Requirements

- Node.js 18 or higher
- TypeScript 7+
- A local git repository to inspect

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP Servers Registry](https://github.com/modelcontextprotocol/servers)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Report Issues](https://github.com/kslmisel/git-changelog-mcp/issues)

---

## 🌟 Show Your Support

If this project helped you, please consider giving it a ⭐ on GitHub!

---

<div align="center">

Made with ❤️ by [kslmisel](https://github.com/kslmisel)

</div>
