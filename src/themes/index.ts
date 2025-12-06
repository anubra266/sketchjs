import tomorrowNightBright from './tomorrow-night-bright.json'

export interface ThemeDefinition {
  name: string
  id: string
  base: 'vs' | 'vs-dark' | 'hc-black'
  inherit: boolean
  rules: Array<{
    foreground?: string
    background?: string
    token: string
    fontStyle?: string
  }>
  colors: {
    [key: string]: string
  }
}

export const themes: ThemeDefinition[] = [
  tomorrowNightBright as ThemeDefinition,
  // Add more themes here as they're created
]

export const defaultTheme = 'tomorrow-night-bright'

export function getTheme(id: string): ThemeDefinition | undefined {
  return themes.find(theme => theme.id === id)
}

export function getThemeList() {
  return themes.map(theme => ({
    id: theme.id,
    name: theme.name,
  }))
}

