import { notificationsAPI } from './supabase/client'

// VAPID public key - in a real app, this would come from your push service
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HpHfYmUjr4GFiWjD3og9W85TxyjPCjN8wZ0yG1xF5IRkjVJk4UJu8vKFw4'

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null
  private subscription: PushSubscription | null = null

  async initialize() {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Workers not supported')
        return false
      }

      // Check if push messaging is supported
      if (!('PushManager' in window)) {
        console.warn('Push messaging not supported')
        return false
      }

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      console.log('Service Worker registered successfully')

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready

      return true
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return false
    }

    let permission = Notification.permission

    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    if (permission === 'granted') {
      console.log('Notification permission granted')
      return true
    } else {
      console.warn('Notification permission denied')
      return false
    }
  }

  async subscribe(preferences: {
    weather: boolean
    prices: boolean
    newListings: boolean
    diseases: boolean
  }) {
    try {
      if (!this.registration) {
        throw new Error('Service worker not registered')
      }

      // Check if already subscribed
      this.subscription = await this.registration.pushManager.getSubscription()

      if (!this.subscription) {
        // Create new subscription
        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
      }

      // Send subscription to server
      await notificationsAPI.subscribe(this.subscription, preferences)

      console.log('Successfully subscribed to push notifications')
      return true
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return false
    }
  }

  async unsubscribe() {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe()
        this.subscription = null
        console.log('Successfully unsubscribed from push notifications')
        return true
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
    }
    return false
  }

  async isSubscribed(): Promise<boolean> {
    try {
      if (!this.registration) return false
      
      this.subscription = await this.registration.pushManager.getSubscription()
      return !!this.subscription
    } catch (error) {
      console.error('Failed to check subscription status:', error)
      return false
    }
  }

  // Show local notification
  showNotification(title: string, options: NotificationOptions = {}) {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options,
      })
    }
  }

  // Utility function to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

// Create singleton instance
export const pushNotificationService = new PushNotificationService()

// Weather alert functions
export const sendWeatherAlert = async (location: string, severity: 'low' | 'medium' | 'high', message: string) => {
  try {
    await notificationsAPI.sendAlert('weather', {
      location,
      severity,
      message,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send weather alert:', error)
  }
}

// Price alert functions
export const sendPriceAlert = async (cropType: string, oldPrice: number, newPrice: number, location: string) => {
  try {
    const priceChange = ((newPrice - oldPrice) / oldPrice) * 100
    
    await notificationsAPI.sendAlert('prices', {
      cropType,
      oldPrice,
      newPrice,
      priceChange: Math.round(priceChange * 100) / 100,
      location,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send price alert:', error)
  }
}

// Disease alert functions
export const sendDiseaseAlert = async (diseaseName: string, location: string, severity: 'low' | 'medium' | 'high') => {
  try {
    await notificationsAPI.sendAlert('diseases', {
      diseaseName,
      location,
      severity,
      message: `${diseaseName} detected in ${location}. Take preventive measures immediately.`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send disease alert:', error)
  }
}

// New crop listing alert
export const sendNewCropAlert = async (cropName: string, location: string, price: string) => {
  try {
    await notificationsAPI.sendAlert('new_crop_listing', {
      cropName,
      location,
      price,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send new crop alert:', error)
  }
}