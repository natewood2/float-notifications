"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotification = void 0;
// src/hooks/useNotification.ts
const react_1 = require("react");
const NotificationProvider_1 = require("../components/NotificationProvider");
const tauri_helper_1 = require("../utils/tauri-helper");
/**
 * Hook for creating notifications in Tauri applications
 */
const useNotification = () => {
    // Try to use the context if it exists
    try {
        return (0, react_1.useContext)(NotificationProvider_1.NotificationContext);
    }
    catch (error) {
        // Fallback implementation if used outside provider
        const notify = (0, react_1.useCallback)((options) => {
            if ((0, tauri_helper_1.isTauri)()) {
                return (0, tauri_helper_1.createTauriNotification)(options);
            }
            // Fallback for non-Tauri environments
            const id = `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            if (typeof Notification !== 'undefined') {
                new Notification(options.title, {
                    body: options.body,
                    icon: options.icon
                });
            }
            else {
                console.log(`Notification: ${options.title} - ${options.body}`);
            }
            return Promise.resolve(id);
        }, []);
        const notifySimple = (0, react_1.useCallback)((title, body) => {
            return notify({ title, body });
        }, [notify]);
        const notifySuccess = (0, react_1.useCallback)((title, body) => {
            return notify({ title, body, type: 'success' });
        }, [notify]);
        const notifyError = (0, react_1.useCallback)((title, body) => {
            return notify({ title, body, type: 'error', duration: 6000 });
        }, [notify]);
        const notifyWarning = (0, react_1.useCallback)((title, body) => {
            return notify({ title, body, type: 'warning' });
        }, [notify]);
        const notifyInfo = (0, react_1.useCallback)((title, body) => {
            return notify({ title, body, type: 'info' });
        }, [notify]);
        return {
            notify,
            notifySimple,
            notifySuccess,
            notifyError,
            notifyWarning,
            notifyInfo
        };
    }
};
exports.useNotification = useNotification;
exports.default = exports.useNotification;
