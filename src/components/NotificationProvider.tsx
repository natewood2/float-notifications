import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { NotificationOptions, NotificationItem } from '../types';
import { createTauriNotification, listenToNotificationClicks, isTauri, closeNotification } from '../utils/tauri-helper';
import FloatNotification from './FloatNotification';

export interface NotificationContextValue {
  notify: (options: NotificationOptions) => Promise<string>;
  notifySimple: (title: string, body: string) => Promise<string>;
  notifySuccess: (title: string, body: string) => Promise<string>;
  notifyError: (title: string, body: string) => Promise<string>;
  notifyWarning: (title: string, body: string) => Promise<string>;
  notifyInfo: (title: string, body: string) => Promise<string>;
  closeNotification: (id: string) => Promise<void>;
  closeAll: () => void;
}

export const NotificationContext = createContext<NotificationContextValue>({
  notify: () => Promise.resolve(''),
  notifySimple: () => Promise.resolve(''),
  notifySuccess: () => Promise.resolve(''),
  notifyError: () => Promise.resolve(''),
  notifyWarning: () => Promise.resolve(''),
  notifyInfo: () => Promise.resolve(''),
  closeNotification: () => Promise.resolve(),
  closeAll: () => {}
});

interface NotificationProviderProps {
  children: ReactNode;
  defaultDuration?: number;
  defaultPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  defaultDuration = 5000,
  defaultPosition = 'top-right'
}) => {
  const [inlineNotifications, setInlineNotifications] = useState<NotificationItem[]>([]);

  // Set up notification click listener
  useEffect(() => {
    let unlistenPromise: Promise<() => void>;
    
    if (isTauri()) {
      unlistenPromise = listenToNotificationClicks((actionId) => {
        console.log(`Notification clicked with action: ${actionId}`);
      });
    }
    
    return () => {
      if (unlistenPromise) {
        unlistenPromise.then(unlisten => unlisten());
      }
    };
  }, []);

  const notify = useCallback(
    async (options: NotificationOptions): Promise<string> => {
      const fullOptions: NotificationItem = {
        ...options,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        duration: options.duration ?? defaultDuration,
        position: options.position ?? defaultPosition,
        displayMethod: options.displayMethod ?? (isTauri() ? 'system' : 'inline')
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
      if (isTauri() && fullOptions.displayMethod === 'window') {
        try {
          const { invoke } = await import('@tauri-apps/api');
          await invoke('show_window_notification', { options: fullOptions });
          return fullOptions.id;
        } catch (error) {
          console.error('Window notification failed, falling back to system:', error);
          return createTauriNotification({ ...fullOptions, displayMethod: 'system' });
        }
      }

      // Handle system notifications (Tauri)
      if (isTauri()) {
        return createTauriNotification(fullOptions);
      }

      // Web fallback (non-Tauri)
      if (typeof Notification !== 'undefined') {
        new Notification(fullOptions.title, {
          body: fullOptions.body,
          icon: fullOptions.icon
        });
      } else {
        console.log(`Notification: ${fullOptions.title} - ${fullOptions.body}`);
      }
      return fullOptions.id;
    },
    [defaultDuration, defaultPosition]
  );

  // Helper methods
  const notifySimple = useCallback(
    (title: string, body: string) => notify({ title, body }),
    [notify]
  );

  const notifySuccess = useCallback(
    (title: string, body: string) => notify({ title, body, type: 'success' }),
    [notify]
  );

  const notifyError = useCallback(
    (title: string, body: string) => notify({ 
      title, 
      body, 
      type: 'error', 
      duration: Math.max(defaultDuration, 6000) 
    }),
    [notify, defaultDuration]
  );

  const notifyWarning = useCallback(
    (title: string, body: string) => notify({ title, body, type: 'warning' }),
    [notify]
  );

  const notifyInfo = useCallback(
    (title: string, body: string) => notify({ title, body, type: 'info' }),
    [notify]
  );

  const closeNotificationById = useCallback(
    async (id: string) => {
      setInlineNotifications(prev => prev.filter(n => n.id !== id));
      if (isTauri()) {
        await closeNotification(id);
      }
    },
    []
  );

  const closeAll = useCallback(() => {
    setInlineNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notify,
        notifySimple,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        closeNotification: closeNotificationById,
        closeAll
      }}
    >
      {children}
      
      {/* Inline Notifications Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        {inlineNotifications.map(notification => (
          <div key={notification.id} style={{ pointerEvents: 'auto' }}>
            <FloatNotification
              id={notification.id}
              title={notification.title}
              body={notification.body}
              type={notification.type}
              duration={notification.duration}
              onClose={() => closeNotificationById(notification.id)}
              onClick={notification.onClick}
              actions={notification.actions?.map(action => ({
                label: action.label,
                onClick: () => {
                  action.onClick?.();
                  if (action.closeOnClick !== false) {
                    closeNotificationById(notification.id);
                  }
                }
              }))}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;