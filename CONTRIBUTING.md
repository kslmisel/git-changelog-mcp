# Contributing to Git Changelog MCP

Thank you for your interest in contributing to Git Changelog MCP! We welcome contributions from the community.

## 🚀 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (OS, Node version, MCP client)
- Any relevant logs or screenshots

### Suggesting Features

We love new ideas! Open an issue with:

- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you might have

### Submitting Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards:
   - Use TypeScript with strict type checking
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Keep functions focused and modular

3. **Test your changes** locally:
   ```bash
   npm run build
   npm start
   ```

4. **Commit with Conventional Commits**:
   ```bash
   git commit -m "feat: add support for custom date ranges"
   git commit -m "fix: handle repositories with no commits"
   git commit -m "docs: update installation instructions"
   ```

   Use these prefixes:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/examples if applicable

## 📝 Code Style

- Use TypeScript with strict mode enabled
- Follow the existing code structure
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep lines under 100 characters when possible
- Use async/await instead of promises chains

## 🧪 Testing

Currently, we don't have automated tests, but you should:

- Test your changes with both Cursor and Claude Desktop
- Verify error handling works correctly
- Check that stdio transport isn't corrupted (no stdout logs)
- Test with different repository states (empty, large, etc.)

## 🎯 Development Workflow

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run the server
npm start

# Build and run together
npm run dev
```

## 📦 Project Structure

```
git-changelog-mcp/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── examples/             # Usage examples
├── .cursor/              # Cursor MCP config
├── package.json
├── tsconfig.json
└── README.md
```

## 🤔 Questions?

- Open a GitHub issue for technical questions
- Check existing issues and PRs first
- Be respectful and patient

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Git Changelog MCP better! 🎉
