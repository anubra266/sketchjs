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

  const handleSplitChange = (details: any) => {
    const panels = details.size;
    setSplitSizes([panels[0].size, panels[1].size]);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: colors["editor.background"] }}
    >
      <TitleBar />
      <Splitter.Root
        size={[
          { id: "editor", size: splitSizes[0], minSize: 30 },
          { id: "output", size: splitSizes[1], minSize: 30 },
        ]}
        onSizeChange={handleSplitChange}
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
        />
        <Splitter.Panel id="output" className="overflow-hidden">
          <OutputPanel />
        </Splitter.Panel>
      </Splitter.Root>
    </div>
  );
}

export default App;
