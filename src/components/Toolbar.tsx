import { useState } from 'react'
import { useEditorStore } from '../store/editorStore'
import SnippetLibrary from './SnippetLibrary'
import PackageManager from './PackageManager'

export default function Toolbar() {
  const { clearConsole } = useEditorStore()
  const [showSnippets, setShowSnippets] = useState(false)
  const [showPackages, setShowPackages] = useState(false)

  return (
    <>
      <div className="bg-[#2d2d30] border-b border-[#3e3e42] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-semibold text-lg">SketchJS</h1>
          <span className="text-gray-400 text-xs">JavaScript Playground</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSnippets(true)}
            className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#3e3e42] rounded transition-colors"
            title="Snippet Library"
          >
            📚 Snippets
          </button>
          <button
            onClick={() => setShowPackages(true)}
            className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#3e3e42] rounded transition-colors"
            title="NPM Packages"
          >
            📦 Packages
          </button>
          <button
            onClick={clearConsole}
            className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#3e3e42] rounded transition-colors"
            title="Clear Output"
          >
            Clear
          </button>
        </div>
      </div>

      <SnippetLibrary isOpen={showSnippets} onClose={() => setShowSnippets(false)} />
      <PackageManager isOpen={showPackages} onClose={() => setShowPackages(false)} />
    </>
  )
}

