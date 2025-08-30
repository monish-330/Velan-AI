import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { 
  Bell, 
  X, 
  Check, 
  CloudRain, 
  TrendingUp, 
  Sprout, 
  Bug,
  Settings,
  Filter
} from 'lucide-react'
import { notificationsAPI } from '../utils/supabase/client'

interface Notification {
  id: string
  title: string
  body: string
  type: 'weather' | 'prices' | 'new_crop_listing' | 'diseases'
  read: boolean
  createdAt: string
  data?: any
}

interface NotificationCenterProps {
  notifications: Notification[]
  isOpen: boolean
  onClose: () => void
  onMarkAsRead: (id: string) => void
}

export function NotificationCenter({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead 
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<string>('all')
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications)

  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll()
      if (response.success) {
        setLocalNotifications(response.notifications)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      onMarkAsRead(notificationId)
      
      setLocalNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = localNotifications.filter(n => !n.read)
      
      for (const notification of unreadNotifications) {
        await notificationsAPI.markAsRead(notification.id)
        onMarkAsRead(notification.id)
      }
      
      setLocalNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      )
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-500" />
      case 'prices':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'new_crop_listing':
        return <Sprout className="w-5 h-5 text-green-600" />
      case 'diseases':
        return <Bug className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'weather':
        return 'Weather'
      case 'prices':
        return 'Prices'
      case 'new_crop_listing':
        return 'New Crop'
      case 'diseases':
        return 'Disease Alert'
      default:
        return 'General'
    }
  }

  const filteredNotifications = localNotifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const unreadCount = localNotifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Filter Tabs */}
        <div className="px-6 pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All', count: localNotifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'weather', label: 'Weather', count: localNotifications.filter(n => n.type === 'weather').length },
              { id: 'prices', label: 'Prices', count: localNotifications.filter(n => n.type === 'prices').length },
              { id: 'new_crop_listing', label: 'Crops', count: localNotifications.filter(n => n.type === 'new_crop_listing').length },
              { id: 'diseases', label: 'Diseases', count: localNotifications.filter(n => n.type === 'diseases').length }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={filter === tab.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(tab.id)}
                className="flex items-center space-x-1 whitespace-nowrap"
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 px-6">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-600 mb-2">No notifications</h3>
                <p className="text-sm text-gray-500">
                  {filter === 'unread' 
                    ? "You're all caught up!" 
                    : "We'll notify you when something important happens."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-4">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
                    }`}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-2 ml-2">
                              <Badge variant="outline" className="text-xs">
                                {getNotificationTypeLabel(notification.type)}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.body}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action buttons for specific notification types */}
                      {notification.type === 'new_crop_listing' && notification.data && (
                        <div className="mt-3 pt-3 border-t flex space-x-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Crop
                          </Button>
                          {notification.data.farmerPhone && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(`tel:${notification.data.farmerPhone}`)
                              }}
                            >
                              Contact Farmer
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {notification.type === 'diseases' && (
                        <div className="mt-3 pt-3 border-t">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Disease Info
                          </Button>
                        </div>
                      )}
                      
                      {notification.type === 'weather' && (
                        <div className="mt-3 pt-3 border-t">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Weather Details
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        {/* Notification Settings */}
        <div className="p-4 border-t">
          <Button variant="outline" size="sm" className="w-full text-sm">
            <Settings className="w-4 h-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}

// Notification Bell Component for Headers
export function NotificationBell({ 
  unreadCount, 
  onClick 
}: { 
  unreadCount: number
  onClick: () => void 
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="relative p-2"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </Button>
  )
}