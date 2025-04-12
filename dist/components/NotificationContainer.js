"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const FloatNotification_1 = __importDefault(require("./FloatNotification"));
const getContainerStyle = (position) => {
    const isTop = position.startsWith('top');
    const isRight = position.endsWith('right');
    return {
        position: 'fixed',
        top: isTop ? '20px' : 'auto',
        bottom: !isTop ? '20px' : 'auto',
        left: !isRight ? '20px' : 'auto',
        right: isRight ? '20px' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
        maxHeight: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none'
    };
};
const NotificationContainer = ({ notifications, onClose }) => {
    // Group notifications by position
    const groupedNotifications = notifications.reduce((acc, notification) => {
        const position = notification.position || 'top-right';
        if (!acc[position]) {
            acc[position] = [];
        }
        acc[position].push(notification);
        return acc;
    }, {});
    return (react_1.default.createElement(react_1.default.Fragment, null, Object.entries(groupedNotifications).map(([position, items]) => (react_1.default.createElement("div", { key: position, style: getContainerStyle(position) }, items.map(notification => {
        var _a;
        return (react_1.default.createElement("div", { key: notification.id, style: { pointerEvents: 'auto' } },
            react_1.default.createElement(FloatNotification_1.default, { id: notification.id, title: notification.title, body: notification.body, type: notification.type, duration: notification.duration, onClose: () => onClose(notification.id), onClick: notification.onClick, actions: (_a = notification.actions) === null || _a === void 0 ? void 0 : _a.map(action => ({
                    label: action.label,
                    onClick: () => {
                        var _a;
                        (_a = action.onClick) === null || _a === void 0 ? void 0 : _a.call(action);
                        if (action.closeOnClick !== false) {
                            onClose(notification.id);
                        }
                    }
                })), position: notification.position, displayMethod: notification.displayMethod })));
    }))))));
};
exports.default = NotificationContainer;
