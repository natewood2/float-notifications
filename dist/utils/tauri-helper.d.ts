import { NotificationOptions } from '../types';
/**
 * Check if running in a Tauri environment
 */
export declare const isTauri: () => boolean;
/**
 * Create a notification using the appropriate method based on options
 */
export declare const createTauriNotification: (options: NotificationOptions) => Promise<string>;
/**
 * Create a fallback browser notification
 */
export declare const createBrowserNotification: (title: string, options: {
    body?: string;
    icon?: string;
}) => void;
/**
 * Listen for notification click events
 */
export declare const listenToNotificationClicks: (callback: (actionId: string) => void) => Promise<() => void>;
/**
 * Close a notification by ID
 */
export declare const closeNotification: (id: string) => Promise<void>;
/**
 * Close all notifications
 */
export declare const closeAllNotifications: () => Promise<void>;
