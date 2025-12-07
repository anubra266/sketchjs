import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useEditorStore } from "../store/editorStore";
import { executeCode } from "../utils/executor";
import { useEffect, useRef } from "react";
import { configureMonaco, getEditorOptions } from "../utils/monaco-config";
import { Menu } from "@tauri-apps/api/menu";
import type * as Monaco from "monaco-editor";

// Extend window to include monaco
declare global {
  interface Window {
    monaco: typeof Monaco;
  }
}

export default function Editor() {
  const {
    code,
    setCode,
    setOutput,
    addConsoleLog,
    clearConsole,
    theme,
    settings,
  } = useEditorStore();
  const executeTimeoutRef = useRef<number>();
  const editorRef = useRef<any>(null);
  const editorOptions = getEditorOptions(settings);

  useEffect(() => {
    // Debounce code execution
    if (executeTimeoutRef.current) {
      clearTimeout(executeTimeoutRef.current);
    }

    executeTimeoutRef.current = setTimeout(async () => {
      clearConsole();
      const result = await executeCode(code, addConsoleLog);
      setOutput(result);
    }, 500);

    return () => {
      if (executeTimeoutRef.current) {
        clearTimeout(executeTimeoutRef.current);
      }
    };
  }, [code, setOutput, addConsoleLog, clearConsole]);

  const handleEditorWillMount = (monaco: any) => {
    configureMonaco(monaco);
  };

  const handleEditorDidMount = (
    editor: Monaco.editor.IStandaloneCodeEditor
  ) => {
    editorRef.current = editor;

    // Add context menu handler
    editor.onContextMenu(async (e: Monaco.editor.IEditorMouseEvent) => {
      e.event.preventDefault();

      try {
        const selection = editor.getSelection();
        const hasSelection = selection && !selection.isEmpty();

        // Create native context menu
        const menu = await Menu.new({
          items: [
            {
              id: "copy",
              text: "Copy",
              enabled: hasSelection || false,
              action: async () => {
                if (selection) {
                  const selectedText = editor
                    .getModel()
                    ?.getValueInRange(selection);
                  if (selectedText) {
                    await navigator.clipboard.writeText(selectedText);
                  }
                }
              },
            },
            {
              id: "paste",
              text: "Paste",
              action: async () => {
                const text = await navigator.clipboard.readText();
                if (text) {
                  const position = editor.getPosition();
                  if (position) {
                    editor.executeEdits("paste", [
                      {
                        range: new window.monaco.Range(
                          position.lineNumber,
                          position.column,
                          position.lineNumber,
                          position.column
                        ),
                        text: text,
                      },
                    ]);
                  }
                }
              },
            },
          ],
        });

        await menu.popup();
      } catch (error) {
        console.error("Failed to show context menu:", error);
      }
    });
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <MonacoEditor
        height="100%"
        language="typescript"
        path="sketch.ts"
        theme={theme}
        value={code}
        onChange={(value) => setCode(value || "")}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={editorOptions}
      />
    </div>
  );
}
