import { useEditorStore } from '../store/editorStore'
import { getTheme } from '../themes'

export function useTheme() {
  const { theme: themeId } = useEditorStore()
  const theme = getTheme(themeId)
  
  if (!theme) {
    throw new Error(`Theme ${themeId} not found`)
  }
  
  return {
    theme,
    colors: theme.colors,
    id: theme.id,
    name: theme.name,
  }
}

