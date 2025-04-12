let tauriInvoke: any = null;
let tauriEvent: any = null;

const loadTauriModules = async () => {
  if (typeof window !== 'undefined' && window.__TAURI__ !== undefined) {
    try {
      const tauri = await import('@tauri-apps/api/tauri');
      const event = await import('@tauri-apps/api/event');
      tauriInvoke = tauri.invoke;
      tauriEvent = event;
      return true;
    } catch (error) {
      console.error('Failed to import Tauri modules:', error);
      return false;
    }
  }
  return false;
};

let tauriLoaded = false;
if (typeof window !== 'undefined' && window.__TAURI__ !== undefined) {
  loadTauriModules().then(result => {
    tauriLoaded = result;
    console.log('Tauri modules loaded:', result);
  });
}

import { NotificationOptions } from '../types';

/**
 * Check if running in a Tauri environment
 */
export const isTauri = (): boolean => {
  return typeof window !== 'undefined' && 
    window.__TAURI__ !== undefined;
};

/**
 * Create a notification using the appropriate method based on options
 */
export const createTauriNotification = async (options: NotificationOptions): Promise<string> => {
  try {
    // Determine notification display method
    const displayMethod = options.displayMethod || (isTauri() ? 'system' : 'inline');
    
    // Make sure Tauri modules are loaded
    if (!tauriLoaded && isTauri()) {
      tauriLoaded = await loadTauriModules();
    }
    
    // Use system notifications
    if (displayMethod === 'system' && isTauri() && tauriInvoke) {
      return await tauriInvoke('show_system_notification', { options });
    } 
    // Use window notifications
    else if (displayMethod === 'window' && isTauri() && tauriInvoke) {
      return await tauriInvoke('show_window_notification', { options });
    }
    // Fallback or specified inline notifications (handled by NotificationProvider)
    else {
      // For non-Tauri environments or when inline is specified
      return `inline-notification-${Date.now()}`;
    }
  } catch (error) {
    console.error('Failed to create notification:', error);
    // Fallback to browser notification
    createBrowserNotification(options.title, {
      body: options.body,
      icon: options.icon
    });
    return `browser-notification-${Date.now()}`;
  }
};

/**
 * Create a fallback browser notification
 */
export const createBrowserNotification = (title: string, options: {
  body?: string;
  icon?: string;
}): void => {
  if (typeof Notification !== 'undefined') {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, options);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, options);
          } else {
            console.log(`Notification (permission denied): ${title} - ${options.body}`);
          }
        });
      } else {
        console.log(`Notification (permission denied): ${title} - ${options.body}`);
      }
    } catch (e) {
      console.warn('Browser notifications not supported', e);
      console.log(`Notification: ${title} - ${options.body}`);
    }
  } else {
    console.log(`Notification: ${title} - ${options.body}`);
  }
};

/**
 * Listen for notification click events
 */
export const listenToNotificationClicks = async (
  callback: (actionId: string) => void
): Promise<() => void> => {
  if (isTauri()) {
    if (!tauriLoaded) {
      tauriLoaded = await loadTauriModules();
    }
    
    if (tauriEvent && tauriEvent.listen) {
      const unlisten = await tauriEvent.listen('notification-clicked', (event: any) => {
        callback(event.payload);
      });
      return unlisten;
    }
  }
  return () => {};
};

/**
 * Close a notification by ID
 */
export const closeNotification = async (id: string): Promise<void> => {
  if (isTauri()) {
    if (!tauriLoaded) {
      tauriLoaded = await loadTauriModules();
    }
    
    if (!tauriInvoke) return;

    if (id.startsWith('window-')) {
      try {
        await tauriInvoke('close_window_notification', { id });
      } catch (error) {
        console.error('Failed to close window notification:', error);
      }
    } else if (id.startsWith('system-')) {
      try {
        await tauriInvoke('close_system_notification', { id });
      } catch (error) {
        console.error('Failed to close system notification:', error);
      }
    }
  }
};

/**
 * Close all notifications
 */
export const closeAllNotifications = async (): Promise<void> => {
  if (isTauri()) {
    if (!tauriLoaded) {
      tauriLoaded = await loadTauriModules();
    }
    
    if (!tauriInvoke) return;
    
    try {
      await tauriInvoke('close_all_notifications');
    } catch (error) {
      console.error('Failed to close all notifications:', error);
    }
  }
};