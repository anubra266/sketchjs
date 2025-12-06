import { useState, useEffect } from 'react'
import { useSnippetStore } from '../store/snippetStore'
import { useEditorStore } from '../store/editorStore'

interface SnippetLibraryProps {
  isOpen: boolean
  onClose: () => void
}

export default function SnippetLibrary({ isOpen, onClose }: SnippetLibraryProps) {
  const { snippets, loadSnippets, saveSnippet, deleteSnippet, loadSnippet } = useSnippetStore()
  const { code, setCode } = useEditorStore()
  const [saveTitle, setSaveTitle] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  useEffect(() => {
    loadSnippets()
  }, [loadSnippets])

  const handleSaveSnippet = () => {
    if (!saveTitle.trim()) return

    saveSnippet({
      title: saveTitle,
      code,
      language: 'typescript',
    })

    setSaveTitle('')
    setShowSaveDialog(false)
  }

  const handleLoadSnippet = (id: string) => {
    const snippet = snippets.find((s) => s.id === id)
    if (snippet) {
      setCode(snippet.code)
      loadSnippet(id)
      onClose()
    }
  }

  const handleDeleteSnippet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this snippet?')) {
      deleteSnippet(id)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252526] rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <h2 className="text-white font-semibold text-lg">Snippet Library</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 border-b border-[#3e3e42]">
          {!showSaveDialog ? (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              Save Current Code
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Snippet title..."
                className="flex-1 px-3 py-2 bg-[#3c3c3c] text-white rounded text-sm border border-[#555] focus:border-blue-500 focus:outline-none"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSaveSnippet()}
              />
              <button
                onClick={handleSaveSnippet}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false)
                  setSaveTitle('')
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Snippet List */}
        <div className="flex-1 overflow-auto p-4">
          {snippets.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No snippets saved yet</p>
              <p className="text-sm mt-2">Save your current code to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {snippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="bg-[#2d2d30] hover:bg-[#3e3e42] rounded p-3 cursor-pointer transition-colors group"
                  onClick={() => handleLoadSnippet(snippet.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{snippet.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(snippet.updatedAt).toLocaleDateString()}{' '}
                        {new Date(snippet.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSnippet(snippet.id, e)}
                      className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      🗑️
                    </button>
                  </div>
                  <pre className="text-gray-400 text-xs mt-2 line-clamp-2 overflow-hidden">
                    {snippet.code}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

