import { registerSW } from 'virtual:pwa-register'

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Service worker needs to be updated
        console.log('Service Worker update available')
      },
      onOfflineReady() {
        // Service worker is ready to work offline
        console.log('Service Worker ready for offline use')
      },
    })

    // Return unregister function
    return updateSW
  }
}

// Register the service worker
registerServiceWorker()

