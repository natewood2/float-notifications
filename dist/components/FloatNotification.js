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
exports.FloatNotification = void 0;
// src/components/FloatNotification.tsx
const react_1 = __importStar(require("react"));
// Modern styles with enhanced visual hierarchy
const getNotificationStyles = (type, isExiting) => {
    // Base styles
    const styles = {
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        width: '320px',
        display: 'flex',
        alignItems: 'flex-start',
        transform: isExiting ? 'translateY(-10px) scale(0.95)' : 'translateY(0) scale(1)',
        opacity: isExiting ? 0 : 1,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none'
    };
    // Type-specific styles with more vibrant colors
    switch (type) {
        case 'success':
            styles.backgroundColor = '#f0fff4';
            styles.boxShadow = '0 8px 30px rgba(0, 168, 80, 0.12)';
            break;
        case 'error':
            styles.backgroundColor = '#fff5f5';
            styles.boxShadow = '0 8px 30px rgba(229, 62, 62, 0.12)';
            break;
        case 'warning':
            styles.backgroundColor = '#fffaf0';
            styles.boxShadow = '0 8px 30px rgba(221, 169, 46, 0.12)';
            break;
        case 'info':
            styles.backgroundColor = '#e6f6ff';
            styles.boxShadow = '0 8px 30px rgba(66, 153, 225, 0.12)';
            break;
        default:
            // Default remains neutral
            break;
    }
    return styles;
};
// Modern style definitions
const titleStyles = {
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '6px',
    color: '#1a202c'
};
const bodyStyles = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#4a5568'
};
const iconStyles = {
    width: '24px',
    height: '24px',
    marginRight: '16px',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flexShrink: 0
};
const contentStyles = {
    flex: 1,
    minWidth: 0
};
const closeStyles = {
    fontSize: '18px',
    lineHeight: 1,
    color: '#a0aec0',
    cursor: 'pointer',
    padding: '2px 6px',
    marginLeft: '8px',
    borderRadius: '50%',
    flexShrink: 0,
    opacity: 0.7,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px'
};
const actionsStyles = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '12px'
};
// More modern button style
const actionButtonStyles = {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '6px 12px',
    margin: '0 4px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    color: '#3182ce',
    textTransform: 'none',
    transition: 'background-color 0.2s ease',
    letterSpacing: '0.3px'
};
// Icon component for various notification types
const getIconForType = (type) => {
    const baseStyles = {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginRight: '16px'
    };
    // SVG paths and colors based on notification type
    switch (type) {
        case 'success':
            return (react_1.default.createElement("div", { style: { ...baseStyles, backgroundColor: '#e6fffa' } },
                react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    react_1.default.createElement("path", { d: "M20 6L9 17L4 12", stroke: "#38b2ac", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))));
        case 'error':
            return (react_1.default.createElement("div", { style: { ...baseStyles, backgroundColor: '#fed7d7' } },
                react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    react_1.default.createElement("path", { d: "M18 6L6 18M6 6L18 18", stroke: "#e53e3e", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))));
        case 'warning':
            return (react_1.default.createElement("div", { style: { ...baseStyles, backgroundColor: '#feebc8' } },
                react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    react_1.default.createElement("path", { d: "M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z", stroke: "#dd6b20", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))));
        case 'info':
            return (react_1.default.createElement("div", { style: { ...baseStyles, backgroundColor: '#bee3f8' } },
                react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    react_1.default.createElement("path", { d: "M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z", stroke: "#3182ce", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))));
        default:
            return (react_1.default.createElement("div", { style: { ...baseStyles, backgroundColor: '#e2e8f0' } },
                react_1.default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                    react_1.default.createElement("path", { d: "M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z", stroke: "#718096", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))));
    }
};
const FloatNotification = ({ id, title, body, icon, onClose, onClick, duration = 5000, type = 'default', actions = [] }) => {
    const [isExiting, setIsExiting] = (0, react_1.useState)(false);
    const timeoutRef = (0, react_1.useRef)(null);
    // Set up auto-close timeout
    (0, react_1.useEffect)(() => {
        if (duration > 0) {
            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, duration);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [duration]);
    // Handle mouse enter/leave for pause/resume auto-close
    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
    const handleMouseLeave = () => {
        if (duration > 0) {
            timeoutRef.current = setTimeout(() => {
                handleClose();
            }, duration);
        }
    };
    const handleClose = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setIsExiting(true);
        setTimeout(() => onClose(id), 300);
    };
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };
    return (react_1.default.createElement("div", { style: getNotificationStyles(type, isExiting), onClick: handleClick, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave },
        icon ? (react_1.default.createElement("div", { style: {
                ...iconStyles,
                backgroundImage: `url(${icon})`
            } })) : (getIconForType(type)),
        react_1.default.createElement("div", { style: contentStyles },
            react_1.default.createElement("div", { style: titleStyles }, title),
            react_1.default.createElement("div", { style: bodyStyles }, body),
            actions.length > 0 && (react_1.default.createElement("div", { style: actionsStyles }, actions.map((action, index) => (react_1.default.createElement("button", { key: index, style: actionButtonStyles, onClick: (e) => {
                    e.stopPropagation();
                    if (action.onClick) {
                        action.onClick();
                    }
                } }, action.label)))))),
        react_1.default.createElement("div", { style: closeStyles, onClick: handleClose, onMouseEnter: (e) => {
                e.currentTarget.style.backgroundColor = '#edf2f7';
                e.currentTarget.style.opacity = '1';
            }, onMouseLeave: (e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.opacity = '0.7';
            } }, "\u00D7")));
};
exports.FloatNotification = FloatNotification;
exports.default = exports.FloatNotification;
