# Getting Started with SketchJS

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **Rust** (latest stable)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

3. **Tauri Prerequisites**
   
   ### macOS
   ```bash
   xcode-select --install
   ```
   
   ### Linux (Debian/Ubuntu)
   ```bash
   sudo apt update
   sudo apt install libwebkit2gtk-4.0-dev \
     build-essential \
     curl \
     wget \
     file \
     libssl-dev \
     libgtk-3-dev \
     libayatana-appindicator3-dev \
     librsvg2-dev
   ```
   
   ### Windows
   - Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

## Installation

1. **Clone the repository** (or use your existing directory)
   ```bash
   cd /Users/anubra266/Developer/oss/sketchjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Generate Tauri icons** (optional, for production)
   ```bash
   # You can use any PNG image as source
   # npm install -g @tauri-apps/cli
   # tauri icon path/to/your/icon.png
   ```

## Running in Development

Start the development server:

```bash
npm run tauri dev
```

This will:
- Start Vite dev server on port 1420
- Compile the Rust backend
- Launch the desktop application

## Building for Production

Build optimized bundles for your platform:

```bash
npm run tauri build
```

The built application will be in `src-tauri/target/release/bundle/`

## Project Structure

```
sketchjs/
├── src/                      # Frontend React code
│   ├── components/          # React components
│   │   ├── Editor.tsx       # Monaco editor wrapper
│   │   ├── OutputPanel.tsx  # Results & console output
│   │   ├── Toolbar.tsx      # Top toolbar
│   │   ├── SnippetLibrary.tsx
│   │   └── PackageManager.tsx
│   ├── store/              # Zustand state management
│   │   ├── editorStore.ts
│   │   └── snippetStore.ts
│   ├── utils/              # Utility functions
│   │   ├── executor.ts     # Code execution engine
│   │   ├── transform.ts    # Babel AST transformation
│   │   └── monaco-config.ts
│   ├── types/              # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── src-tauri/               # Tauri Rust backend
│   ├── src/
│   │   └── main.rs         # Tauri commands
│   ├── Cargo.toml
│   └── tauri.conf.json
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Features

### ✅ Implemented

- **Live Code Execution** - JavaScript/TypeScript runs as you type
- **Per-line Results** - See output for each line in real-time
- **Monaco Editor** - Full VS Code editing experience
- **Console Output** - Captured console.log, error, warn, info
- **TypeScript Support** - Full type checking and autocomplete
- **Snippet Library** - Save and load code snippets
- **NPM Packages** - Install and use npm packages (experimental)
- **Dark/Light Theme** - Toggle between themes
- **Auto-save** - Your code is automatically saved to localStorage

### 📦 Using NPM Packages

1. Click "📦 Packages" in the toolbar
2. Enter package name (e.g., `lodash`, `date-fns`)
3. Click "Install"
4. Use in your code:

```javascript
// Note: Package imports are experimental
const _ = require('lodash')
const result = _.chunk([1, 2, 3, 4], 2)
console.log(result)
```

### 💡 Tips

1. **Keyboard Shortcuts**: Use standard VS Code shortcuts
2. **Auto-completion**: Press `Ctrl+Space` for suggestions
3. **Format Code**: Press `Shift+Alt+F` to format
4. **Quick Save Snippet**: Write code, click "📚 Snippets", then "Save Current Code"

## Troubleshooting

### Port 1420 already in use
```bash
# Kill the process using port 1420
lsof -ti:1420 | xargs kill -9
```

### Rust compilation errors
```bash
# Update Rust
rustup update
```

### Node modules issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

1. Make changes to frontend code in `src/`
2. Hot reload will update the UI automatically
3. For Rust backend changes in `src-tauri/`, the app will restart
4. Test features thoroughly before building

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this in your own projects!

