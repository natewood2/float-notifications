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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.float = exports.inlineNotify = exports.listenToNotificationClicks = exports.closeAllNotifications = exports.closeNotification = exports.createTauriNotification = exports.isTauri = exports.useNotification = exports.NotificationContainer = exports.NotificationProvider = exports.FloatNotification = void 0;
// src/index.ts
const tauri_helper_1 = require("./utils/tauri-helper");
const inlineNotifications_1 = __importDefault(require("./components/inlineNotifications"));
// Export components
var FloatNotification_1 = require("./components/FloatNotification");
Object.defineProperty(exports, "FloatNotification", { enumerable: true, get: function () { return __importDefault(FloatNotification_1).default; } });
var NotificationProvider_1 = require("./components/NotificationProvider");
Object.defineProperty(exports, "NotificationProvider", { enumerable: true, get: function () { return __importDefault(NotificationProvider_1).default; } });
var NotificationContainer_1 = require("./components/NotificationContainer");
Object.defineProperty(exports, "NotificationContainer", { enumerable: true, get: function () { return __importDefault(NotificationContainer_1).default; } });
// Export hooks
var useNotification_1 = require("./hooks/useNotification");
Object.defineProperty(exports, "useNotification", { enumerable: true, get: function () { return __importDefault(useNotification_1).default; } });
// Export utils
var tauri_helper_2 = require("./utils/tauri-helper");
Object.defineProperty(exports, "isTauri", { enumerable: true, get: function () { return tauri_helper_2.isTauri; } });
Object.defineProperty(exports, "createTauriNotification", { enumerable: true, get: function () { return tauri_helper_2.createTauriNotification; } });
Object.defineProperty(exports, "closeNotification", { enumerable: true, get: function () { return tauri_helper_2.closeNotification; } });
Object.defineProperty(exports, "closeAllNotifications", { enumerable: true, get: function () { return tauri_helper_2.closeAllNotifications; } });
Object.defineProperty(exports, "listenToNotificationClicks", { enumerable: true, get: function () { return tauri_helper_2.listenToNotificationClicks; } });
// Export types
__exportStar(require("./types"), exports);
// Export the inline notifications utility directly
var inlineNotifications_2 = require("./components/inlineNotifications");
Object.defineProperty(exports, "inlineNotify", { enumerable: true, get: function () { return __importDefault(inlineNotifications_2).default; } });
const floatApi = {
    success: (title, body, options = {}) => {
        if ((0, tauri_helper_1.isTauri)()) {
            return (0, tauri_helper_1.createTauriNotification)({
                title,
                body,
                type: 'success',
                displayMethod: 'system',
                ...options
            });
        }
        return inlineNotifications_1.default.success(title, body, options);
    },
    error: (title, body, options = {}) => {
        if ((0, tauri_helper_1.isTauri)()) {
            return (0, tauri_helper_1.createTauriNotification)({
                title,
                body,
                type: 'error',
                displayMethod: 'system',
                ...options
            });
        }
        return inlineNotifications_1.default.error(title, body, options);
    },
    warning: (title, body, options = {}) => {
        if ((0, tauri_helper_1.isTauri)()) {
            return (0, tauri_helper_1.createTauriNotification)({
                title,
                body,
                type: 'warning',
                displayMethod: 'system',
                ...options
            });
        }
        return inlineNotifications_1.default.warning(title, body, options);
    },
    info: (title, body, options = {}) => {
        if ((0, tauri_helper_1.isTauri)()) {
            return (0, tauri_helper_1.createTauriNotification)({
                title,
                body,
                type: 'info',
                displayMethod: 'system',
                ...options
            });
        }
        return inlineNotifications_1.default.info(title, body, options);
    },
    show: (options) => {
        if (options.displayMethod === 'inline' || (!options.displayMethod && !(0, tauri_helper_1.isTauri)())) {
            return inlineNotifications_1.default.show(options);
        }
        return (0, tauri_helper_1.createTauriNotification)(options);
    },
    dismiss: (id) => {
        if (id.startsWith('inline-')) {
            inlineNotifications_1.default.dismiss(id);
            return;
        }
        return (0, tauri_helper_1.closeNotification)(id);
    },
    dismissAll: () => {
        inlineNotifications_1.default.dismissAll();
        if ((0, tauri_helper_1.isTauri)()) {
            return (0, tauri_helper_1.closeAllNotifications)();
        }
    },
    inline: {
        success: (title, body, options = {}) => inlineNotifications_1.default.success(title, body, { ...options, displayMethod: 'inline' }),
        error: (title, body, options = {}) => inlineNotifications_1.default.error(title, body, { ...options, displayMethod: 'inline' }),
        warning: (title, body, options = {}) => inlineNotifications_1.default.warning(title, body, { ...options, displayMethod: 'inline' }),
        info: (title, body, options = {}) => inlineNotifications_1.default.info(title, body, { ...options, displayMethod: 'inline' }),
        show: (options) => inlineNotifications_1.default.show({ ...options, displayMethod: 'inline' })
    },
    system: {
        success: (title, body, options = {}) => (0, tauri_helper_1.createTauriNotification)({ title, body, type: 'success', displayMethod: 'system', ...options }),
        error: (title, body, options = {}) => (0, tauri_helper_1.createTauriNotification)({ title, body, type: 'error', displayMethod: 'system', ...options }),
        warning: (title, body, options = {}) => (0, tauri_helper_1.createTauriNotification)({ title, body, type: 'warning', displayMethod: 'system', ...options }),
        info: (title, body, options = {}) => (0, tauri_helper_1.createTauriNotification)({ title, body, type: 'info', displayMethod: 'system', ...options }),
        show: (options) => (0, tauri_helper_1.createTauriNotification)({ ...options, displayMethod: 'system' })
    },
    window: {
        success: (title, body, options = {}) => (0, tauri_helper_1.createTauriNotification)({ title, body, type: 'success', displayMethod: 'window', ...options }),
        error: (title, body, options = {}) => (0, tauri_helper_1.createTauriNotification)({ title, body, type: 'error', displayMethod: 'window', ...options }),
        warning: (title, body, options = {}) => (0, tauri_helper_1.createTauriNotification)({ title, body, type: 'warning', displayMethod: 'window', ...options }),
        info: (title, body, options = {}) => (0, tauri_helper_1.createTauriNotification)({ title, body, type: 'info', displayMethod: 'window', ...options }),
        show: (options) => (0, tauri_helper_1.createTauriNotification)({ ...options, displayMethod: 'window' })
    }
};
exports.float = floatApi;
exports.default = exports.float;
if (typeof window !== 'undefined') {
    const initializeFloat = () => {
        console.log('Float notification library initialized');
        window.__float = exports.float;
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFloat);
    }
    else {
        initializeFloat();
    }
}
