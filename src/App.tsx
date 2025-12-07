import { useEffect } from "react";
import { Splitter } from "@ark-ui/react/splitter";
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

  const handleSplitChange = (details: Splitter.ResizeDetails) => {
    setSplitSizes(details.size as [number, number]);
  };

  const handleResetSplit = () => {
    setSplitSizes([50, 50]);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: colors["editor.background"] }}
    >
      <TitleBar />
      <Splitter.Root
        panels={[
          { id: "editor", minSize: 30 },
          { id: "output", minSize: 30 },
        ]}
        size={splitSizes}
        onResize={handleSplitChange}
        className="flex-1 flex"
      >
        <Splitter.Panel id="editor" className="overflow-hidden">
          <Editor />
        </Splitter.Panel>
        <Splitter.ResizeTrigger
          id="editor:output"
          className="w-0.5 transition-all opacity-15 hover:opacity-30"
          style={{
            backgroundColor:
              colors["editorCursor.foreground"] ?? "rgba(128, 128, 128, 0.1)",
            cursor: "col-resize",
          }}
          onDoubleClick={handleResetSplit}
        />
        <Splitter.Panel id="output" className="overflow-hidden">
          <OutputPanel />
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}

export default App;
