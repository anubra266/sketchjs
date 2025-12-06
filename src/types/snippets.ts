export interface Snippet {
  id: string
  title: string
  code: string
  language: 'javascript' | 'typescript'
  createdAt: number
  updatedAt: number
}

export interface SnippetFolder {
  id: string
  name: string
  snippets: string[] // Array of snippet IDs
}

