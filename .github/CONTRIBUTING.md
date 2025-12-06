# Contributing to SketchJS

Thank you for your interest in contributing to SketchJS! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and considerate in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/sketchjs/issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Your environment (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has been suggested
2. Create an issue with:
   - Clear description of the feature
   - Why it would be useful
   - Potential implementation approach
   - Examples or mockups if applicable

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/sketchjs.git
   cd sketchjs
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed
   - Add tests if applicable

4. **Test your changes**
   ```bash
   npm run tauri dev
   # Test thoroughly
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## Development Setup

See [GETTING_STARTED.md](../GETTING_STARTED.md) for detailed setup instructions.

## Code Style

- Use TypeScript for type safety
- Follow existing formatting (we use Prettier)
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic

## Testing

Before submitting:
- [ ] Code runs without errors
- [ ] UI works as expected
- [ ] No console errors
- [ ] Works on your target platform
- [ ] Existing features still work

## Questions?

Feel free to ask questions in:
- GitHub Issues
- Pull Request comments
- Discussions (if enabled)

Thank you for contributing! 🎉

