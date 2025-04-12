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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineNotify = void 0;
// src/inlineNotifications.tsx
const react_1 = __importStar(require("react"));
const client_1 = require("react-dom/client");
const FloatNotification_1 = __importDefault(require("./FloatNotification"));
let notifications = [];
let listeners = [];
// Function to notify listeners of state change
const notifyListeners = () => {
    listeners.forEach(listener => listener());
};
// Core notification functions
const show = (options) => {
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
const dismiss = (id) => {
    notifications = notifications.filter(n => n.id !== id);
    notifyListeners();
};
const dismissAll = () => {
    notifications = [];
    notifyListeners();
};
// Helper functions for specific notification types
const success = (title, body, options = {}) => show({ title, body, type: 'success', ...options });
const error = (title, body, options = {}) => show({ title, body, type: 'error', duration: 6000, ...options });
const warning = (title, body, options = {}) => show({ title, body, type: 'warning', ...options });
const info = (title, body, options = {}) => show({ title, body, type: 'info', ...options });
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
    const root = (0, client_1.createRoot)(containerElement);
    // Component that will render all notifications
    const NotificationsContainer = () => {
        const [items, setItems] = (0, react_1.useState)(notifications);
        (0, react_1.useEffect)(() => {
            const updateItems = () => setItems([...notifications]);
            listeners.push(updateItems);
            return () => {
                listeners = listeners.filter(l => l !== updateItems);
            };
        }, []);
        return (react_1.default.createElement("div", { style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none'
            } }, items.map(notification => (react_1.default.createElement("div", { key: notification.id, style: { pointerEvents: 'auto' } },
            react_1.default.createElement(FloatNotification_1.default, { id: notification.id, title: notification.title, body: notification.body, type: notification.type || 'default', onClose: () => dismiss(notification.id), onClick: notification.onClick, actions: notification.actions }))))));
    };
    // Render the container
    root.render(react_1.default.createElement(NotificationsContainer, null));
};
// Initialize the container when imported
if (typeof window !== 'undefined') {
    // Only run in browser environment
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createNotificationContainer);
    }
    else {
        createNotificationContainer();
    }
}
// Export the API
exports.inlineNotify = {
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll
};
exports.default = exports.inlineNotify;
