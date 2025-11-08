// Web Push Notification Service
export class NotificationService {
  private static instance: NotificationService

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return 'denied'
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission()
    }

    return Notification.permission
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator
  }

  /**
   * Check if permission is granted
   */
  hasPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted'
  }

  /**
   * Send a notification to the user
   */
  async showNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<void> {
    if (!this.hasPermission()) {
      console.warn('Notification permission not granted')
      return
    }

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          vibrate: [200, 100, 200],
          requireInteraction: false,
          ...options,
        })
      } catch (error) {
        console.error('Error showing notification:', error)
        // Fallback to regular notification
        new Notification(title, options)
      }
    } else {
      // Fallback to regular notification
      new Notification(title, options)
    }
  }

  /**
   * Get push subscription for the user
   */
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.isSupported()) {
      console.warn('Push notifications not supported')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      return await registration.pushManager.getSubscription()
    } catch (error) {
      console.error('Error getting push subscription:', error)
      return null
    }
  }

  /**
   * Subscribe user to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.isSupported()) {
      console.warn('Push notifications not supported')
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      
      // VAPID public key (you'll need to generate this)
      const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE'
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      console.log('Push subscription successful:', subscription)
      return subscription
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      return null
    }
  }

  /**
   * Unsubscribe user from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    try {
      const subscription = await this.getSubscription()
      if (subscription) {
        return await subscription.unsubscribe()
      }
      return false
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
      return false
    }
  }
}

/**
 * Convert VAPID key from base64 URL to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export const notificationService = NotificationService.getInstance()

