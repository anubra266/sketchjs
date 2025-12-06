import { Checkbox } from "@ark-ui/react/checkbox";
import { Tabs } from "@ark-ui/react/tabs";
import { useEditorStore } from "../store/editorStore";
import { useTheme } from "../hooks/useTheme";
import { getThemeList } from "../themes";
import { useEffect } from "react";
import {
  Palette,
  AlignVerticalJustifyCenter,
  Type,
  Hash,
  Check,
  Zap,
} from "lucide-react";

export default function SettingsWindow() {
  const { settings, updateSettings, theme, setTheme, initializeStore } =
    useEditorStore();
  const { colors } = useTheme();
  const themes = getThemeList();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: colors["editor.background"] || "#000000" }}
    >
      {/* Header - Draggable */}
      <div
        className="py-2! border-b flex items-center justify-center"
        style={{ borderColor: `${colors["editor.foreground"]}06` }}
        data-tauri-drag-region
      >
        <h1
          data-tauri-drag-region
          className="text-sm select-none"
          style={{ color: colors["editor.foreground"], opacity: 0.7 }}
        >
          Settings
        </h1>
      </div>

      <Tabs.Root defaultValue="general" className="flex flex-col flex-1">
        {/* Tab List */}
        <Tabs.List
          className="flex gap-6! px-6! pt-3! pb-2! border-b"
          style={{ borderColor: `${colors["editor.foreground"]}05` }}
        >
          <Tabs.Trigger
            value="general"
            className="pb-3! text-sm font-medium flex items-center gap-2.5 transition-all data-[state=active]:opacity-100 opacity-40"
            style={{ color: colors["editor.foreground"] }}
          >
            <Zap size={15} strokeWidth={2} />
            General
          </Tabs.Trigger>
          <Tabs.Trigger
            value="appearance"
            className="pb-3! text-sm font-medium flex items-center gap-2.5 transition-all data-[state=active]:opacity-100 opacity-40"
            style={{ color: colors["editor.foreground"] }}
          >
            <Palette size={15} strokeWidth={2} />
            Appearance
          </Tabs.Trigger>
        </Tabs.List>

        {/* General Tab */}
        <Tabs.Content
          value="general"
          className="px-6! py-4! flex-1 overflow-auto"
        >
          <Checkbox.Root
            checked={settings.matchLines}
            onCheckedChange={(details) =>
              updateSettings({ matchLines: details.checked === true })
            }
            className="flex items-start justify-between gap-4! cursor-pointer"
          >
            <Checkbox.Label className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2.5! mb-1!">
                <AlignVerticalJustifyCenter
                  size={15}
                  strokeWidth={2}
                  style={{ color: colors["editor.foreground"], opacity: 0.4 }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: colors["editor.foreground"] }}
                >
                  Align output with source
                </span>
              </div>
              <p
                className="text-xs leading-relaxed pl-5.5!"
                style={{ color: colors["editor.foreground"], opacity: 0.35 }}
              >
                Match line numbers between editor and output
              </p>
            </Checkbox.Label>
            <Checkbox.Control
              className="mt-0.5! w-5 h-5 rounded flex items-center justify-center transition-all hover:scale-105"
              style={{
                backgroundColor: settings.matchLines
                  ? colors["editorCursor.foreground"]
                  : "transparent",
                border: `2px solid ${colors["editorCursor.foreground"]}`,
              }}
            >
              <Checkbox.Indicator>
                <Check
                  size={12}
                  strokeWidth={3}
                  style={{ color: colors["editor.background"] }}
                />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        </Tabs.Content>

        {/* Appearance Tab */}
        <Tabs.Content
          value="appearance"
          className="px-6! py-4! flex-1 overflow-auto"
        >
          <div className="space-y-3.5!">
            {/* Active Line */}
            <Checkbox.Root
              checked={settings.highlightActiveLine}
              onCheckedChange={(details) =>
                updateSettings({
                  highlightActiveLine: details.checked === true,
                })
              }
              className="flex items-center justify-between gap-4! cursor-pointer"
            >
              <Checkbox.Label className="flex-1 cursor-pointer">
                <span
                  className="text-sm font-medium"
                  style={{ color: colors["editor.foreground"] }}
                >
                  Highlight active line
                </span>
              </Checkbox.Label>
              <Checkbox.Control
                className="w-5 h-5 rounded flex items-center justify-center transition-all hover:scale-105"
                style={{
                  backgroundColor: settings.highlightActiveLine
                    ? colors["editorCursor.foreground"]
                    : "transparent",
                  border: `2px solid ${colors["editorCursor.foreground"]}`,
                }}
              >
                <Checkbox.Indicator>
                  <Check
                    size={12}
                    strokeWidth={3}
                    style={{ color: colors["editor.background"] }}
                  />
                </Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.HiddenInput />
            </Checkbox.Root>

            {/* Line Numbers */}
            <Checkbox.Root
              checked={settings.showLineNumbers}
              onCheckedChange={(details) =>
                updateSettings({ showLineNumbers: details.checked === true })
              }
              className="flex items-center justify-between gap-4! cursor-pointer"
            >
              <Checkbox.Label className="flex-1 cursor-pointer flex items-center gap-2.5!">
                <Hash
                  size={15}
                  strokeWidth={2}
                  style={{ color: colors["editor.foreground"], opacity: 0.4 }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: colors["editor.foreground"] }}
                >
                  Show line numbers
                </span>
              </Checkbox.Label>
              <Checkbox.Control
                className="w-5 h-5 rounded flex items-center justify-center transition-all hover:scale-105"
                style={{
                  backgroundColor: settings.showLineNumbers
                    ? colors["editorCursor.foreground"]
                    : "transparent",
                  border: `2px solid ${colors["editorCursor.foreground"]}`,
                }}
              >
                <Checkbox.Indicator>
                  <Check
                    size={12}
                    strokeWidth={3}
                    style={{ color: colors["editor.background"] }}
                  />
                </Checkbox.Indicator>
              </Checkbox.Control>
              <Checkbox.HiddenInput />
            </Checkbox.Root>

            <div
              className="my-2.5!"
              style={{
                height: "1px",
                backgroundColor: `${colors["editor.foreground"]}04`,
              }}
            />

            {/* Font Size */}
            <div className="flex items-center justify-between py-0.5!">
              <div className="flex items-center gap-2.5!">
                <Type
                  size={16}
                  strokeWidth={2}
                  style={{ color: colors["editor.foreground"], opacity: 0.4 }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: colors["editor.foreground"] }}
                >
                  Font Size
                </span>
              </div>
              <input
                type="number"
                min="10"
                max="24"
                value={settings.fontSize}
                onChange={(e) =>
                  updateSettings({ fontSize: parseInt(e.target.value) || 14 })
                }
                className="w-20! px-4! py-2! rounded-md text-sm text-center focus:outline-none transition-all hover:bg-opacity-80"
                style={{
                  backgroundColor: `${colors["editor.foreground"]}06`,
                  color: colors["editor.foreground"],
                  border: `1px solid ${colors["editor.foreground"]}08`,
                }}
              />
            </div>

            {/* Font Family */}
            <div className="flex items-center justify-between py-0.5!">
              <div className="flex items-center gap-2.5!">
                <Type
                  size={16}
                  strokeWidth={2}
                  style={{ color: colors["editor.foreground"], opacity: 0.4 }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: colors["editor.foreground"] }}
                >
                  Font Family
                </span>
              </div>
              <select
                value={settings.fontFamily}
                onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                className="px-4! py-2! rounded-md text-sm focus:outline-none transition-all hover:bg-opacity-80 min-w-[160px]!"
                style={{
                  backgroundColor: `${colors["editor.foreground"]}06`,
                  color: colors["editor.foreground"],
                  border: `1px solid ${colors["editor.foreground"]}08`,
                }}
              >
                <option value='Menlo, Monaco, "Courier New", monospace'>
                  Menlo
                </option>
                <option value='"SF Mono", Monaco, monospace'>SF Mono</option>
                <option value="Monaco, monospace">Monaco</option>
                <option value='"Fira Code", monospace'>Fira Code</option>
                <option value='"JetBrains Mono", monospace'>
                  JetBrains Mono
                </option>
              </select>
            </div>

            {/* Theme */}
            <div className="flex items-center justify-between py-0.5!">
              <div className="flex items-center gap-2.5!">
                <Palette
                  size={16}
                  strokeWidth={2}
                  style={{ color: colors["editor.foreground"], opacity: 0.4 }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: colors["editor.foreground"] }}
                >
                  Theme
                </span>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-4! py-2! rounded-md text-sm focus:outline-none transition-all hover:bg-opacity-80 min-w-[200px]!"
                style={{
                  backgroundColor: `${colors["editor.foreground"]}06`,
                  color: colors["editor.foreground"],
                  border: `1px solid ${colors["editor.foreground"]}08`,
                }}
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
