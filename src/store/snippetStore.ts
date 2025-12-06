import { create } from 'zustand'
import { Snippet } from '../types/snippets'

interface SnippetState {
  snippets: Snippet[]
  currentSnippetId: string | null
  
  loadSnippets: () => void
  saveSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateSnippet: (id: string, updates: Partial<Snippet>) => void
  deleteSnippet: (id: string) => void
  loadSnippet: (id: string) => void
}

const STORAGE_KEY = 'sketchjs-snippets'

export const useSnippetStore = create<SnippetState>((set, get) => ({
  snippets: [],
  currentSnippetId: null,
  
  loadSnippets: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const snippets = JSON.parse(stored)
        set({ snippets })
      }
    } catch (error) {
      console.error('Failed to load snippets:', error)
    }
  },
  
  saveSnippet: (snippet) => {
    const newSnippet: Snippet = {
      ...snippet,
      id: `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    const snippets = [...get().snippets, newSnippet]
    set({ snippets })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
  },
  
  updateSnippet: (id, updates) => {
    const snippets = get().snippets.map((s) =>
      s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
    )
    set({ snippets })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
  },
  
  deleteSnippet: (id) => {
    const snippets = get().snippets.filter((s) => s.id !== id)
    set({ snippets })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
  },
  
  loadSnippet: (id) => {
    set({ currentSnippetId: id })
  },
}))

