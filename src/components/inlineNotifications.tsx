// src/inlineNotifications.tsx
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import FloatNotification from './FloatNotification';
import { NotificationOptions } from '../types';

// Interface for our exported methods
interface InlineNotificationAPI {
  show: (options: NotificationOptions) => string;
  success: (title: string, body: string, options?: Partial<NotificationOptions>) => string;
  error: (title: string, body: string, options?: Partial<NotificationOptions>) => string;
  warning: (title: string, body: string, options?: Partial<NotificationOptions>) => string;
  info: (title: string, body: string, options?: Partial<NotificationOptions>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// Notification manager state
type NotificationItem = NotificationOptions & { id: string };
let notifications: NotificationItem[] = [];
let listeners: (() => void)[] = [];

// Function to notify listeners of state change
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Core notification functions
const show = (options: NotificationOptions): string => {
  const id = `inline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const notification = { ...options, id };
  
  notifications = [...notifications, notification];
  notifyListeners();
  
  // Auto-dismiss
  if (options.duration !== 0) {
    setTimeout(() => {
      dismiss(id);
    }, options.duration || 5000);
  }
  
  return id;
};

const dismiss = (id: string) => {
  notifications = notifications.filter(n => n.id !== id);
  notifyListeners();
};

const dismissAll = () => {
  notifications = [];
  notifyListeners();
};

// Helper functions for specific notification types
const success = (title: string, body: string, options: Partial<NotificationOptions> = {}) => 
  show({ title, body, type: 'success', ...options });

const error = (title: string, body: string, options: Partial<NotificationOptions> = {}) => 
  show({ title, body, type: 'error', duration: 6000, ...options });

const warning = (title: string, body: string, options: Partial<NotificationOptions> = {}) => 
  show({ title, body, type: 'warning', ...options });

const info = (title: string, body: string, options: Partial<NotificationOptions> = {}) => 
  show({ title, body, type: 'info', ...options });

// Create the container element and render the notifications
const createNotificationContainer = () => {
  // Create container if it doesn't exist
  let containerElement = document.getElementById('inline-notifications-container');
  if (!containerElement) {
    containerElement = document.createElement('div');
    containerElement.id = 'inline-notifications-container';
    document.body.appendChild(containerElement);
  }
  
  // Create React root
  const root = createRoot(containerElement);
  
  // Component that will render all notifications
  const NotificationsContainer = () => {
    const [items, setItems] = useState(notifications);
    
    useEffect(() => {
      const updateItems = () => setItems([...notifications]);
      listeners.push(updateItems);
      return () => {
        listeners = listeners.filter(l => l !== updateItems);
      };
    }, []);
    
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {items.map(notification => (
          <div key={notification.id} style={{ pointerEvents: 'auto' }}>
            <FloatNotification
              id={notification.id}
              title={notification.title}
              body={notification.body}
              type={notification.type || 'default'}
              onClose={() => dismiss(notification.id)}
              onClick={notification.onClick}
              actions={notification.actions}
            />
          </div>
        ))}
      </div>
    );
  };
  
  // Render the container
  root.render(<NotificationsContainer />);
};

// Initialize the container when imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', createNotificationContainer);
  } else {
    createNotificationContainer();
  }
}

// Export the API
export const inlineNotify: InlineNotificationAPI = {
  show,
  success,
  error,
  warning,
  info,
  dismiss,
  dismissAll
};

export default inlineNotify;