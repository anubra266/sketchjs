import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'

interface PackageManagerProps {
  isOpen: boolean
  onClose: () => void
}

interface InstallResult {
  success: boolean
  message: string
}

export default function PackageManager({ isOpen, onClose }: PackageManagerProps) {
  const [packageName, setPackageName] = useState('')
  const [installedPackages, setInstalledPackages] = useState<string[]>([])
  const [installing, setInstalling] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadInstalledPackages()
    }
  }, [isOpen])

  const loadInstalledPackages = async () => {
    try {
      const packages = await invoke<string[]>('get_installed_packages')
      setInstalledPackages(packages)
    } catch (error) {
      console.error('Failed to load packages:', error)
    }
  }

  const handleInstall = async () => {
    if (!packageName.trim()) return

    setInstalling(true)
    setMessage(null)

    try {
      const result = await invoke<InstallResult>('install_npm_package', {
        packageName: packageName.trim(),
      })

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setPackageName('')
        await loadInstalledPackages()
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error}` })
    } finally {
      setInstalling(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252526] rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <h2 className="text-white font-semibold text-lg">NPM Package Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Install Form */}
        <div className="p-4 border-b border-[#3e3e42]">
          <div className="flex gap-2">
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="Package name (e.g., lodash, date-fns)"
              className="flex-1 px-3 py-2 bg-[#3c3c3c] text-white rounded text-sm border border-[#555] focus:border-blue-500 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && !installing && handleInstall()}
              disabled={installing}
            />
            <button
              onClick={handleInstall}
              disabled={installing || !packageName.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
            >
              {installing ? 'Installing...' : 'Install'}
            </button>
          </div>

          {message && (
            <div
              className={`mt-3 p-3 rounded text-sm ${
                message.type === 'success'
                  ? 'bg-green-900 bg-opacity-30 text-green-400 border border-green-700'
                  : 'bg-red-900 bg-opacity-30 text-red-400 border border-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Installed Packages */}
        <div className="flex-1 overflow-auto p-4">
          <h3 className="text-gray-300 font-medium text-sm mb-3">Installed Packages</h3>
          {installedPackages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No packages installed yet</p>
              <p className="text-sm mt-2">Install packages to use them in your code</p>
            </div>
          ) : (
            <div className="space-y-2">
              {installedPackages.map((pkg) => (
                <div
                  key={pkg}
                  className="bg-[#2d2d30] rounded p-3 flex items-center justify-between"
                >
                  <span className="text-white font-mono text-sm">{pkg}</span>
                  <span className="text-green-400 text-xs">✓ Installed</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 border-t border-[#3e3e42] bg-[#2d2d30]">
          <p className="text-gray-400 text-xs">
            💡 <strong>Note:</strong> Package support is experimental. Use require() or import statements in your code.
          </p>
        </div>
      </div>
    </div>
  )
}

