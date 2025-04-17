import { useCallback, useContext } from 'react';
import { NotificationOptions } from '../types';
import { NotificationContext } from '../components/NotificationProvider';
import { createTauriNotification, isTauri } from '../utils/tauri-helper';

/**
 * Hook for creating notifications in Tauri applications
 */
export const useNotification = () => {
  // Try to use the context if it exists
  try {
    return useContext(NotificationContext);
  } catch (error) {
    // Fallback implementation if used outside provider
    const notify = useCallback((options: NotificationOptions): Promise<string> => {
      if (isTauri()) {
        return createTauriNotification(options);
      }
      
      // Fallback for non-Tauri environments
      const id = `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      if (typeof Notification !== 'undefined') {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon
        });
      } else {
        console.log(`Notification: ${options.title} - ${options.body}`);
      }
      
      return Promise.resolve(id);
    }, []);

    const notifySimple = useCallback((title: string, body: string): Promise<string> => {
      return notify({ title, body });
    }, [notify]);

    const notifySuccess = useCallback((title: string, body: string): Promise<string> => {
      return notify({ title, body, type: 'success' });
    }, [notify]);

    const notifyError = useCallback((title: string, body: string): Promise<string> => {
      return notify({ title, body, type: 'error', duration: 6000 });
    }, [notify]);

    const notifyWarning = useCallback((title: string, body: string): Promise<string> => {
      return notify({ title, body, type: 'warning' });
    }, [notify]);

    const notifyInfo = useCallback((title: string, body: string): Promise<string> => {
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

export default useNotification;