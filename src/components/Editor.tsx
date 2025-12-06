import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useEditorStore } from "../store/editorStore";
import { executeCode } from "../utils/executor";
import { useEffect, useRef } from "react";
import { configureMonaco, getEditorOptions } from "../utils/monaco-config";

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

  return (
    <div className="h-full flex flex-col">
      <MonacoEditor
        height="100%"
        language="typescript"
        path="sketch.ts"
        theme={theme}
        value={code}
        onChange={(value) => setCode(value || "")}
        beforeMount={handleEditorWillMount}
        options={editorOptions}
      />
    </div>
  );
}
