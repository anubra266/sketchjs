import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { Settings as SettingsIcon } from "lucide-react";
import { openSettingsWindow } from "../utils/settings-window";

export default function TitleBar() {
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+, on Mac or Ctrl+, on Windows/Linux
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        openSettingsWindow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="flex items-center justify-between relative group"
      data-tauri-drag-region
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: "38px",
        backgroundColor: colors["editor.background"],
        paddingRight: "12px",
      }}
    >
      <div></div>

      {/* Settings button - only visible on hover */}
      <button
        onClick={() => openSettingsWindow()}
        className="hover:opacity-70 transition-all"
        style={{
          color: colors["editor.foreground"],
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          opacity: isHovered ? 1 : 0,
        }}
        data-tauri-drag-region="false"
      >
        <SettingsIcon size={16} />
      </button>
    </div>
  );
}
