# SketchJS Roadmap

## Completed Features ✅

- [x] Basic code execution with sandbox
- [x] Console output capture (log, error, warn, info)
- [x] Monaco editor integration
- [x] Per-line result capturing (naked expressions only)
- [x] TypeScript type checking
- [x] Snippet library with localStorage
- [x] NPM package support via Tauri
- [x] Minimalist UI - Clean split pane design
- [x] Theme system with JSON-based themes
- [x] Output panel matches editor theme
- [x] Smart output filtering (console logs + naked expressions only)

## Planned Features 🎯

### Short Term (v0.2.0)
- [ ] **Command palette** - Access features via keyboard (⌘K)
  - Snippets
  - Packages
  - Settings
  - Clear output
  - Run code
- [ ] **Inline results display** - Show results on the same line as code (like RunJS)
  - User configurable: inline vs separate pane
  - Line-by-line alignment between editor and results
- [ ] Code formatting (Prettier integration)
- [ ] Better error display with stack traces
- [ ] Keyboard shortcuts documentation

### Medium Term (v0.3.0)
- [ ] Multiple files/tabs
- [ ] Import/export files
- [ ] Import from URL/Gist
- [ ] Search in snippets
- [ ] Snippet categories/folders
- [ ] Settings panel (font size, theme, etc.)

### Long Term (v0.4.0+)
- [ ] Custom themes
- [ ] Plugin system
- [ ] Cloud sync (optional, privacy-first)
- [ ] Shareable snippets
- [ ] Vim/Emacs keybindings
- [ ] JSX/React component preview
- [ ] Chart/visualization support

## Configuration Ideas 💡

### Result Display Modes
1. **Inline mode** (like RunJS) - Results appear next to code
2. **Split pane mode** (current) - Results in separate panel
3. **Overlay mode** - Results overlay on hover

### User Preferences
- Show/hide line numbers
- Auto-run delay (current: 500ms)
- Result formatting options
- Enable/disable specific console types

## Community Requests 🙋

Add your feature requests here!

