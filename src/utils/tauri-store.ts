import { Store } from '@tauri-apps/plugin-store'

let storeInstance: Store | null = null

export async function getTauriStore() {
    if (!storeInstance) {
        try {
            storeInstance = await Store.load('sketchjs-store.json')
        } catch (error) {
            console.error('Failed to initialize Tauri store:', error)
            throw error
        }
    }
    return storeInstance
}

// Subscribe to store changes
export async function onStoreChange<T>(key: string, callback: (value: T | undefined) => void) {
    const store = await getTauriStore()

    // Initial value
    const initialValue = await store.get<T>(key)
    if (initialValue !== undefined) {
        callback(initialValue)
    }

    // Listen for changes
    return store.onKeyChange<T>(key, callback)
}

