import { useEffect } from "react";
import Split from "react-split";
import Editor from "./components/Editor";
import OutputPanel from "./components/OutputPanel";
import TitleBar from "./components/TitleBar";
import { useEditorStore } from "./store/editorStore";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { initializeStore, splitSizes, setSplitSizes } = useEditorStore();
  const { colors } = useTheme();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const handleSplitChange = (sizes: number[]) => {
    if (sizes.length === 2) {
      setSplitSizes([sizes[0], sizes[1]]);
    }
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: colors["editor.background"] }}
    >
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Split
          className="flex flex-1"
          sizes={splitSizes}
          minSize={300}
          gutterSize={2}
          onDragEnd={handleSplitChange}
          gutterStyle={() => ({
            backgroundColor:
              colors["editorCursor.foreground"] ?? "rgba(128, 128, 128, 0.1)",
          })}
        >
          <Editor />
          <OutputPanel />
        </Split>
      </div>
    </div>
  );
}

export default App;
