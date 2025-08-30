// Service Worker for Push Notifications
const CACHE_NAME = 'velan-ai-v1'
const API_CACHE = 'velan-ai-api-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/icon-192x192.png',
        '/badge-72x72.png'
      ])
    })
  )
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Ensure the service worker takes control immediately
  return self.clients.claim()
})

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  let notificationData = {
    title: 'Velan AI Notification',
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'general',
    data: {}
  }
  
  if (event.data) {
    try {
      const payload = event.data.json()
      notificationData = { ...notificationData, ...payload }
    } catch (error) {
      console.error('Error parsing push payload:', error)
      notificationData.body = event.data.text()
    }
  }
  
  // Customize notification based on type
  if (notificationData.data && notificationData.data.type) {
    const type = notificationData.data.type
    
    switch (type) {
      case 'weather':
        notificationData.icon = '/weather-icon.png'
        notificationData.tag = 'weather'
        notificationData.actions = [
          { action: 'view', title: 'View Weather' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
        break
        
      case 'prices':
        notificationData.icon = '/price-icon.png'
        notificationData.tag = 'prices'
        notificationData.actions = [
          { action: 'view', title: 'View Prices' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
        break
        
      case 'new_crop_listing':
        notificationData.icon = '/crop-icon.png'
        notificationData.tag = 'crops'
        notificationData.actions = [
          { action: 'view', title: 'View Crop' },
          { action: 'contact', title: 'Contact Farmer' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
        break
        
      case 'diseases':
        notificationData.icon = '/disease-icon.png'
        notificationData.tag = 'diseases'
        notificationData.requireInteraction = true // Keep notification until user interacts
        notificationData.actions = [
          { action: 'view', title: 'View Details' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
        break
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  const notification = event.notification
  const action = event.action
  const data = notification.data || {}
  
  // Close the notification
  notification.close()
  
  // Handle different actions
  let urlToOpen = '/'
  
  if (action === 'view') {
    switch (data.type) {
      case 'weather':
        urlToOpen = '/weather'
        break
      case 'prices':
        urlToOpen = '/price'
        break
      case 'new_crop_listing':
        urlToOpen = '/buyer-home'
        break
      case 'diseases':
        urlToOpen = '/disease'
        break
    }
  } else if (action === 'contact') {
    // For crop listings, could open contact info
    if (data.message && data.message.farmerPhone) {
      urlToOpen = `tel:${data.message.farmerPhone}`
    }
  } else if (action === 'dismiss') {
    // Just close - no action needed
    return
  } else {
    // Default click - open appropriate page based on notification type
    if (data.type) {
      switch (data.type) {
        case 'weather':
          urlToOpen = '/weather'
          break
        case 'prices':
          urlToOpen = '/price'
          break
        case 'new_crop_listing':
          urlToOpen = '/buyer-home'
          break
        case 'diseases':
          urlToOpen = '/disease'
          break
      }
    }
  }
  
  // Open or focus the app window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url.includes(urlToOpen.replace('/', '')) && 'focus' in client) {
          return client.focus()
        }
      }
      
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync-posts') {
    event.waitUntil(syncPosts())
  } else if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications())
  }
})

// Sync functions for offline support
async function syncPosts() {
  try {
    // Get pending posts from IndexedDB or localStorage
    const pendingPosts = JSON.parse(localStorage.getItem('pendingPosts') || '[]')
    
    for (const post of pendingPosts) {
      try {
        // Attempt to sync the post
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(post)
        })
        
        if (response.ok) {
          // Remove from pending posts
          const updatedPending = pendingPosts.filter(p => p.id !== post.id)
          localStorage.setItem('pendingPosts', JSON.stringify(updatedPending))
          
          // Show success notification
          self.registration.showNotification('Post Synced', {
            body: 'Your crop listing has been posted successfully!',
            icon: '/icon-192x192.png',
            tag: 'sync-success'
          })
        }
      } catch (error) {
        console.error('Failed to sync post:', error)
      }
    }
  } catch (error) {
    console.error('Error in syncPosts:', error)
  }
}

async function syncNotifications() {
  try {
    // Fetch latest notifications from server
    const response = await fetch('/api/notifications')
    if (response.ok) {
      const data = await response.json()
      // Process new notifications...
    }
  } catch (error) {
    console.error('Error syncing notifications:', error)
  }
}

// Fetch event for caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }
  
  const url = new URL(event.request.url)
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Cache successful API responses
            if (response.ok) {
              cache.put(event.request, response.clone())
            }
            return response
          })
          .catch(() => {
            // Return cached version if available
            return cache.match(event.request)
          })
      })
    )
    return
  }
  
  // Handle static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  // Send response back to main thread
  event.ports[0].postMessage({
    success: true,
    message: 'Service Worker received message'
  })
})