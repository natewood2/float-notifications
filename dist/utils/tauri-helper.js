"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAllNotifications = exports.closeNotification = exports.listenToNotificationClicks = exports.createBrowserNotification = exports.createTauriNotification = exports.isTauri = void 0;
let tauriInvoke = null;
let tauriEvent = null;
const loadTauriModules = async () => {
    if (typeof window !== 'undefined' && window.__TAURI__ !== undefined) {
        try {
            const tauri = await Promise.resolve().then(() => __importStar(require('@tauri-apps/api/tauri')));
            const event = await Promise.resolve().then(() => __importStar(require('@tauri-apps/api/event')));
            tauriInvoke = tauri.invoke;
            tauriEvent = event;
            return true;
        }
        catch (error) {
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
/**
 * Check if running in a Tauri environment
 */
const isTauri = () => {
    return typeof window !== 'undefined' &&
        window.__TAURI__ !== undefined;
};
exports.isTauri = isTauri;
/**
 * Create a notification using the appropriate method based on options
 */
const createTauriNotification = async (options) => {
    try {
        // Determine notification display method
        const displayMethod = options.displayMethod || ((0, exports.isTauri)() ? 'system' : 'inline');
        // Make sure Tauri modules are loaded
        if (!tauriLoaded && (0, exports.isTauri)()) {
            tauriLoaded = await loadTauriModules();
        }
        // Use system notifications
        if (displayMethod === 'system' && (0, exports.isTauri)() && tauriInvoke) {
            return await tauriInvoke('show_system_notification', { options });
        }
        // Use window notifications
        else if (displayMethod === 'window' && (0, exports.isTauri)() && tauriInvoke) {
            return await tauriInvoke('show_window_notification', { options });
        }
        // Fallback or specified inline notifications (handled by NotificationProvider)
        else {
            // For non-Tauri environments or when inline is specified
            return `inline-notification-${Date.now()}`;
        }
    }
    catch (error) {
        console.error('Failed to create notification:', error);
        // Fallback to browser notification
        (0, exports.createBrowserNotification)(options.title, {
            body: options.body,
            icon: options.icon
        });
        return `browser-notification-${Date.now()}`;
    }
};
exports.createTauriNotification = createTauriNotification;
/**
 * Create a fallback browser notification
 */
const createBrowserNotification = (title, options) => {
    if (typeof Notification !== 'undefined') {
        try {
            if (Notification.permission === 'granted') {
                new Notification(title, options);
            }
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(title, options);
                    }
                    else {
                        console.log(`Notification (permission denied): ${title} - ${options.body}`);
                    }
                });
            }
            else {
                console.log(`Notification (permission denied): ${title} - ${options.body}`);
            }
        }
        catch (e) {
            console.warn('Browser notifications not supported', e);
            console.log(`Notification: ${title} - ${options.body}`);
        }
    }
    else {
        console.log(`Notification: ${title} - ${options.body}`);
    }
};
exports.createBrowserNotification = createBrowserNotification;
/**
 * Listen for notification click events
 */
const listenToNotificationClicks = async (callback) => {
    if ((0, exports.isTauri)()) {
        if (!tauriLoaded) {
            tauriLoaded = await loadTauriModules();
        }
        if (tauriEvent && tauriEvent.listen) {
            const unlisten = await tauriEvent.listen('notification-clicked', (event) => {
                callback(event.payload);
            });
            return unlisten;
        }
    }
    return () => { };
};
exports.listenToNotificationClicks = listenToNotificationClicks;
/**
 * Close a notification by ID
 */
const closeNotification = async (id) => {
    if ((0, exports.isTauri)()) {
        if (!tauriLoaded) {
            tauriLoaded = await loadTauriModules();
        }
        if (!tauriInvoke)
            return;
        if (id.startsWith('window-')) {
            try {
                await tauriInvoke('close_window_notification', { id });
            }
            catch (error) {
                console.error('Failed to close window notification:', error);
            }
        }
        else if (id.startsWith('system-')) {
            try {
                await tauriInvoke('close_system_notification', { id });
            }
            catch (error) {
                console.error('Failed to close system notification:', error);
            }
        }
    }
};
exports.closeNotification = closeNotification;
/**
 * Close all notifications
 */
const closeAllNotifications = async () => {
    if ((0, exports.isTauri)()) {
        if (!tauriLoaded) {
            tauriLoaded = await loadTauriModules();
        }
        if (!tauriInvoke)
            return;
        try {
            await tauriInvoke('close_all_notifications');
        }
        catch (error) {
            console.error('Failed to close all notifications:', error);
        }
    }
};
exports.closeAllNotifications = closeAllNotifications;
