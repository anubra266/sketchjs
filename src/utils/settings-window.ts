import { WebviewWindow, getAllWebviewWindows } from '@tauri-apps/api/webviewWindow'

export async function openSettingsWindow() {
  try {
    // Check if settings window already exists
    const windows = await getAllWebviewWindows()
    const existing = windows.find(w => w.label === 'settings')

    if (existing) {
      console.log('Settings window already exists, focusing...')
      await existing.setFocus()
      await existing.show()
      return
    }

    console.log('Creating new settings window...')

    // Create new settings window as child of main window
    const settingsWindow = new WebviewWindow('settings', {
      url: '/settings.html',
      title: 'Settings',
      width: 480,
      height: 500,
      minWidth: 450,
      minHeight: 450,
      resizable: true,
      center: true,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      parent: 'main', // Make it a child of main window
      titleBarStyle: 'overlay',
      hiddenTitle: true,
      visible: true,
    })

    console.log('Settings window created, waiting for load...')

    // Wait for window to be ready
    await settingsWindow.once('tauri://created', () => {
      console.log('Settings window fully loaded')
    })

    await settingsWindow.once('tauri://error', (error) => {
      console.error('Settings window error:', error)
    })

  } catch (error) {
    console.error('Failed to create settings window:', error)
  }
}

