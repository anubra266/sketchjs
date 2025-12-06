import { create } from 'zustand'
import { defaultTheme } from '../themes'
import { getTauriStore, onStoreChange } from '../utils/tauri-store'

export interface ConsoleLog {
    id: string
    type: 'log' | 'error' | 'warn' | 'info'
    args: any[]
    timestamp: number
}

export interface LineResult {
    line: number
    value: any
    error?: string
}

export interface EditorSettings {
    matchLines: boolean
    highlightActiveLine: boolean
    showLineNumbers: boolean
    fontSize: number
    fontFamily: string
}

interface EditorState {
    code: string
    output: LineResult[]
    consoleLogs: ConsoleLog[]
    isExecuting: boolean
    theme: string
    splitSizes: [number, number]
    settings: EditorSettings

    setCode: (code: string) => void
    setOutput: (output: LineResult[]) => void
    addConsoleLog: (log: ConsoleLog) => void
    clearConsole: () => void
    setIsExecuting: (isExecuting: boolean) => void
    setTheme: (theme: string) => void
    setSplitSizes: (sizes: [number, number]) => void
    updateSettings: (settings: Partial<EditorSettings>) => void
    initializeStore: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
    code: '// Welcome to SketchJS!\n// Start typing and see results in real-time\n\nconst greeting = "Hello, World!"\nconsole.log(greeting)\n\nconst numbers = [1, 2, 3, 4, 6]\nconst doubled = numbers.map(n => n * 2)\n\ndoubled',
    output: [],
    consoleLogs: [],
    isExecuting: false,
    theme: defaultTheme,
    splitSizes: [50, 50],
    settings: {
        matchLines: true,
        highlightActiveLine: true,
        showLineNumbers: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    },

    setCode: async (code) => {
        set({ code })
        // Auto-save to Tauri store
        const store = await getTauriStore()
        await store.set('code', code)
    },

    setOutput: (output) => set({ output }),

    addConsoleLog: (log) => set((state) => ({
        consoleLogs: [...state.consoleLogs, log]
    })),

    clearConsole: () => set({ consoleLogs: [], output: [] }),

    setIsExecuting: (isExecuting) => set({ isExecuting }),

    setTheme: async (theme) => {
        set({ theme })
        const store = await getTauriStore()
        await store.set('theme', theme)
    },

    setSplitSizes: async (sizes) => {
        set({ splitSizes: sizes })
        const store = await getTauriStore()
        await store.set('splitSizes', sizes)
    },

    updateSettings: (newSettings) => {
        set((state) => {
            const settings = { ...state.settings, ...newSettings }
            getTauriStore().then(store => store.set('settings', settings))
            return { settings }
        })
    },

    initializeStore: () => {
        getTauriStore().then(async (store) => {

            // Restore code
            const savedCode = await store.get<string>('code')
            if (savedCode) {
                set({ code: savedCode })
            }

            // Restore split sizes
            const savedSizes = await store.get<any>('splitSizes')
            if (savedSizes && Array.isArray(savedSizes) && savedSizes.length === 2) {
                set({ splitSizes: savedSizes as [number, number] })
            }

            // Restore theme
            const savedTheme = await store.get<string>('theme')
            if (savedTheme) {
                set({ theme: savedTheme })
            }

            // Restore settings
            const savedSettings = await store.get<EditorSettings>('settings')
            if (savedSettings) {
                set({ settings: savedSettings })
            }

            // Listen for changes from other windows
            onStoreChange<EditorSettings>('settings', (settings) => {
                if (settings !== undefined) set({ settings })
            })

            onStoreChange<string>('theme', (theme) => {
                if (theme !== undefined) set({ theme })
            })
        }).catch(error => {
            console.error('Tauri Store initialization failed, app will continue with defaults:', error)
            // App will continue with default values from the store
        })
    },
}))

