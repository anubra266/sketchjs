# Themes

This directory contains theme definitions for the SketchJS editor.

## Adding a New Theme

1. Create a new JSON file in this directory (e.g., `dracula.json`)
2. Use this structure:

```json
{
  "name": "Theme Display Name",
  "id": "theme-id-slug",
  "base": "vs-dark",
  "inherit": true,
  "rules": [
    {
      "foreground": "color",
      "background": "color",
      "token": "token-name",
      "fontStyle": "italic|bold"
    }
  ],
  "colors": {
    "editor.foreground": "#color",
    "editor.background": "#color",
    "editor.selectionBackground": "#color",
    "editor.lineHighlightBackground": "#color",
    "editorCursor.foreground": "#color",
    "editorWhitespace.foreground": "#color"
  }
}
```

3. Import and add it to the `themes` array in `index.ts`

## Available Themes

- **Tomorrow Night Bright** (default) - A vibrant dark theme with bright syntax colors

## Planned Themes

- Dracula
- Monokai
- GitHub Dark
- GitHub Light
- Solarized Dark
- Solarized Light
- One Dark Pro
- Nord

## Theme Base Options

- `vs` - Light theme base
- `vs-dark` - Dark theme base
- `hc-black` - High contrast black base

## Common Token Types

- `comment` - Comments
- `keyword` - Language keywords (const, let, if, etc.)
- `string` - String literals
- `constant.numeric` - Numbers
- `variable` - Variables
- `entity.name.function` - Function names
- `entity.name.class` - Class names
- `storage.type` - Type declarations
- `support.function` - Built-in functions
- `invalid` - Invalid/error tokens

