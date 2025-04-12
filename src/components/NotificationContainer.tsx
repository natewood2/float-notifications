import React from 'react';
import { NotificationItem } from '../types';
import FloatNotification from './FloatNotification';

interface NotificationContainerProps {
  notifications: NotificationItem[];
  onClose: (id: string) => void;
}

const getContainerStyle = (position: string): React.CSSProperties => {
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

const NotificationContainer: React.FC<NotificationContainerProps> = ({ 
  notifications,
  onClose
}) => {
  // Group notifications by position
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const position = notification.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(notification);
    return acc;
  }, {} as Record<string, NotificationItem[]>);
  
  return (
    <>
      {Object.entries(groupedNotifications).map(([position, items]) => (
        <div key={position} style={getContainerStyle(position)}>
          {items.map(notification => (
            <div key={notification.id} style={{ pointerEvents: 'auto' }}>
              <FloatNotification
                id={notification.id}
                title={notification.title}
                body={notification.body}
                type={notification.type}
                duration={notification.duration}
                onClose={() => onClose(notification.id)}
                onClick={notification.onClick}
                actions={notification.actions?.map(action => ({
                  label: action.label,
                  onClick: () => {
                    action.onClick?.();
                    if (action.closeOnClick !== false) {
                      onClose(notification.id);
                    }
                  }
                }))}
                position={notification.position}
                displayMethod={notification.displayMethod}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default NotificationContainer;