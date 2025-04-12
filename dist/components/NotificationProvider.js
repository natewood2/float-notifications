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
exports.NotificationProvider = exports.NotificationContext = void 0;
const react_1 = __importStar(require("react"));
const tauri_helper_1 = require("../utils/tauri-helper");
const FloatNotification_1 = __importDefault(require("./FloatNotification"));
exports.NotificationContext = (0, react_1.createContext)({
    notify: () => Promise.resolve(''),
    notifySimple: () => Promise.resolve(''),
    notifySuccess: () => Promise.resolve(''),
    notifyError: () => Promise.resolve(''),
    notifyWarning: () => Promise.resolve(''),
    notifyInfo: () => Promise.resolve(''),
    closeNotification: () => Promise.resolve(),
    closeAll: () => { }
});
const NotificationProvider = ({ children, defaultDuration = 5000, defaultPosition = 'top-right' }) => {
    const [inlineNotifications, setInlineNotifications] = (0, react_1.useState)([]);
    // Set up notification click listener
    (0, react_1.useEffect)(() => {
        let unlistenPromise;
        if ((0, tauri_helper_1.isTauri)()) {
            unlistenPromise = (0, tauri_helper_1.listenToNotificationClicks)((actionId) => {
                console.log(`Notification clicked with action: ${actionId}`);
            });
        }
        return () => {
            if (unlistenPromise) {
                unlistenPromise.then(unlisten => unlisten());
            }
        };
    }, []);
    const notify = (0, react_1.useCallback)(async (options) => {
        var _a, _b, _c;
        const fullOptions = {
            ...options,
            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            duration: (_a = options.duration) !== null && _a !== void 0 ? _a : defaultDuration,
            position: (_b = options.position) !== null && _b !== void 0 ? _b : defaultPosition,
            displayMethod: (_c = options.displayMethod) !== null && _c !== void 0 ? _c : ((0, tauri_helper_1.isTauri)() ? 'system' : 'inline')
        };
        // Handle inline notifications
        if (fullOptions.displayMethod === 'inline') {
            setInlineNotifications(prev => [...prev, fullOptions]);
            if (fullOptions.duration && fullOptions.duration > 0) {
                setTimeout(() => {
                    setInlineNotifications(prev => prev.filter(n => n.id !== fullOptions.id));
                }, fullOptions.duration);
            }
            return fullOptions.id;
        }
        // Handle window notifications (Tauri only)
        if ((0, tauri_helper_1.isTauri)() && fullOptions.displayMethod === 'window') {
            try {
                const { invoke } = await Promise.resolve().then(() => __importStar(require('@tauri-apps/api')));
                await invoke('show_window_notification', { options: fullOptions });
                return fullOptions.id;
            }
            catch (error) {
                console.error('Window notification failed, falling back to system:', error);
                return (0, tauri_helper_1.createTauriNotification)({ ...fullOptions, displayMethod: 'system' });
            }
        }
        // Handle system notifications (Tauri)
        if ((0, tauri_helper_1.isTauri)()) {
            return (0, tauri_helper_1.createTauriNotification)(fullOptions);
        }
        // Web fallback (non-Tauri)
        if (typeof Notification !== 'undefined') {
            new Notification(fullOptions.title, {
                body: fullOptions.body,
                icon: fullOptions.icon
            });
        }
        else {
            console.log(`Notification: ${fullOptions.title} - ${fullOptions.body}`);
        }
        return fullOptions.id;
    }, [defaultDuration, defaultPosition]);
    // Helper methods
    const notifySimple = (0, react_1.useCallback)((title, body) => notify({ title, body }), [notify]);
    const notifySuccess = (0, react_1.useCallback)((title, body) => notify({ title, body, type: 'success' }), [notify]);
    const notifyError = (0, react_1.useCallback)((title, body) => notify({
        title,
        body,
        type: 'error',
        duration: Math.max(defaultDuration, 6000)
    }), [notify, defaultDuration]);
    const notifyWarning = (0, react_1.useCallback)((title, body) => notify({ title, body, type: 'warning' }), [notify]);
    const notifyInfo = (0, react_1.useCallback)((title, body) => notify({ title, body, type: 'info' }), [notify]);
    const closeNotificationById = (0, react_1.useCallback)(async (id) => {
        setInlineNotifications(prev => prev.filter(n => n.id !== id));
        if ((0, tauri_helper_1.isTauri)()) {
            await (0, tauri_helper_1.closeNotification)(id);
        }
    }, []);
    const closeAll = (0, react_1.useCallback)(() => {
        setInlineNotifications([]);
    }, []);
    return (react_1.default.createElement(exports.NotificationContext.Provider, { value: {
            notify,
            notifySimple,
            notifySuccess,
            notifyError,
            notifyWarning,
            notifyInfo,
            closeNotification: closeNotificationById,
            closeAll
        } },
        children,
        react_1.default.createElement("div", { style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'none'
            } }, inlineNotifications.map(notification => {
            var _a;
            return (react_1.default.createElement("div", { key: notification.id, style: { pointerEvents: 'auto' } },
                react_1.default.createElement(FloatNotification_1.default, { id: notification.id, title: notification.title, body: notification.body, type: notification.type, duration: notification.duration, onClose: () => closeNotificationById(notification.id), onClick: notification.onClick, actions: (_a = notification.actions) === null || _a === void 0 ? void 0 : _a.map(action => ({
                        label: action.label,
                        onClick: () => {
                            var _a;
                            (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action);
                            if (action.closeOnClick !== false) {
                                closeNotificationById(notification.id);
                            }
                        }
                    })) })));
        }))));
};
exports.NotificationProvider = NotificationProvider;
exports.default = exports.NotificationProvider;
