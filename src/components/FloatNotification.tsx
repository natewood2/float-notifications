import React, { useEffect, useState, useRef } from 'react';
import { NotificationOptions } from '../types';

export interface NotificationProps extends Omit<NotificationOptions, 'clickAction' | 'actions'> {
  id: string;
  onClose: (id: string) => void;
  onClick?: () => void;
  actions?: Array<{
    label: string;
    onClick?: () => void;
  }>;
}

// Modern styles with enhanced visual hierarchy
const getNotificationStyles = (
  type: 'default' | 'success' | 'error' | 'warning' | 'info',
  isExiting: boolean
): React.CSSProperties => {
  // Base styles
  const styles: React.CSSProperties = {
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
const titleStyles: React.CSSProperties = {
  fontWeight: '600',
  fontSize: '16px',
  marginBottom: '6px',
  color: '#1a202c'
};

const bodyStyles: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#4a5568'
};

const iconStyles: React.CSSProperties = {
  width: '24px',
  height: '24px',
  marginRight: '16px',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  flexShrink: 0
};

const contentStyles: React.CSSProperties = {
  flex: 1,
  minWidth: 0
};

const closeStyles: React.CSSProperties = {
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

const actionsStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '12px'
};

// More modern button style
const actionButtonStyles: React.CSSProperties = {
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
const getIconForType = (type: 'default' | 'success' | 'error' | 'warning' | 'info'): React.ReactNode => {
  const baseStyles: React.CSSProperties = {
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
      return (
        <div style={{...baseStyles, backgroundColor: '#e6fffa'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#38b2ac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    case 'error':
      return (
        <div style={{...baseStyles, backgroundColor: '#fed7d7'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    case 'warning':
      return (
        <div style={{...baseStyles, backgroundColor: '#feebc8'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#dd6b20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    case 'info':
      return (
        <div style={{...baseStyles, backgroundColor: '#bee3f8'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#3182ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
    default:
      return (
        <div style={{...baseStyles, backgroundColor: '#e2e8f0'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      );
  }
};

export const FloatNotification: React.FC<NotificationProps> = ({
  id,
  title,
  body,
  icon,
  onClose,
  onClick,
  duration = 5000,
  type = 'default',
  actions = []
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set up auto-close timeout
  useEffect(() => {
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

  const handleClose = (e?: React.MouseEvent) => {
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

  return (
    <div 
      style={getNotificationStyles(type, isExiting)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon ? (
        <div style={{
          ...iconStyles,
          backgroundImage: `url(${icon})`
        }} />
      ) : (
        getIconForType(type)
      )}
      <div style={contentStyles}>
        <div style={titleStyles}>{title}</div>
        <div style={bodyStyles}>{body}</div>
        
        {actions.length > 0 && (
          <div style={actionsStyles}>
            {actions.map((action, index) => (
              <button
                key={index}
                style={actionButtonStyles}
                onClick={(e) => {
                  e.stopPropagation();
                  if (action.onClick) {
                    action.onClick();
                  }
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div 
        style={closeStyles} 
        onClick={handleClose}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#edf2f7';
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.opacity = '0.7';
        }}
      >
        ×
      </div>
    </div>
  );
};

export default FloatNotification;