import { isTauri, createTauriNotification, closeNotification, closeAllNotifications, listenToNotificationClicks } from './utils/tauri-helper';
import { NotificationOptions, NotificationItem, NotificationAction } from './types';
import inlineNotify from './components/inlineNotifications';

// Export components
export { default as FloatNotification } from './components/FloatNotification';
export { default as NotificationProvider } from './components/NotificationProvider';
export { default as NotificationContainer } from './components/NotificationContainer';

// Export hooks
export { default as useNotification } from './hooks/useNotification';

// Export utils
export { 
  isTauri,
  createTauriNotification,
  closeNotification,
  closeAllNotifications,
  listenToNotificationClicks
} from './utils/tauri-helper';

// Export types
export * from './types';

// Export the inline notifications utility directly
export { default as inlineNotify } from './components/inlineNotifications';

// Define the interface first
export interface FloatNotificationAPI {
  success(title: string, body: string, options?: Partial<NotificationOptions>): string | Promise<string>;
  error(title: string, body: string, options?: Partial<NotificationOptions>): string | Promise<string>;
  warning(title: string, body: string, options?: Partial<NotificationOptions>): string | Promise<string>;
  info(title: string, body: string, options?: Partial<NotificationOptions>): string | Promise<string>;
  show(options: NotificationOptions): string | Promise<string>;
  dismiss(id: string): void | Promise<void>;
  dismissAll(): void | Promise<void>;
  inline: {
    success(title: string, body: string, options?: Partial<NotificationOptions>): string;
    error(title: string, body: string, options?: Partial<NotificationOptions>): string;
    warning(title: string, body: string, options?: Partial<NotificationOptions>): string;
    info(title: string, body: string, options?: Partial<NotificationOptions>): string;
    show(options: NotificationOptions): string;
  };
  system: {
    success(title: string, body: string, options?: Partial<NotificationOptions>): Promise<string>;
    error(title: string, body: string, options?: Partial<NotificationOptions>): Promise<string>;
    warning(title: string, body: string, options?: Partial<NotificationOptions>): Promise<string>;
    info(title: string, body: string, options?: Partial<NotificationOptions>): Promise<string>;
    show(options: NotificationOptions): Promise<string>;
  };
  window: {
    success(title: string, body: string, options?: Partial<NotificationOptions>): Promise<string>;
    error(title: string, body: string, options?: Partial<NotificationOptions>): Promise<string>;
    warning(title: string, body: string, options?: Partial<NotificationOptions>): Promise<string>;
    info(title: string, body: string, options?: Partial<NotificationOptions>): Promise<string>;
    show(options: NotificationOptions): Promise<string>;
  };
}

const floatApi: FloatNotificationAPI = {
  success: (title: string, body: string, options: Partial<NotificationOptions> = {}): string | Promise<string> => {
    if (isTauri()) {
      return createTauriNotification({
        title, 
        body, 
        type: 'success', 
        displayMethod: 'system', 
        ...options
      });
    }
    return inlineNotify.success(title, body, options);
  },
  
  error: (title: string, body: string, options: Partial<NotificationOptions> = {}): string | Promise<string> => {
    if (isTauri()) {
      return createTauriNotification({
        title, 
        body, 
        type: 'error', 
        displayMethod: 'system', 
        ...options
      });
    }
    return inlineNotify.error(title, body, options);
  },
  
  warning: (title: string, body: string, options: Partial<NotificationOptions> = {}): string | Promise<string> => {
    if (isTauri()) {
      return createTauriNotification({
        title, 
        body, 
        type: 'warning', 
        displayMethod: 'system', 
        ...options
      });
    }
    return inlineNotify.warning(title, body, options);
  },
  
  info: (title: string, body: string, options: Partial<NotificationOptions> = {}): string | Promise<string> => {
    if (isTauri()) {
      return createTauriNotification({
        title, 
        body, 
        type: 'info', 
        displayMethod: 'system', 
        ...options
      });
    }
    return inlineNotify.info(title, body, options);
  },

  show: (options: NotificationOptions): string | Promise<string> => {
    if (options.displayMethod === 'inline' || (!options.displayMethod && !isTauri())) {
      return inlineNotify.show(options);
    }
    return createTauriNotification(options);
  },

  dismiss: (id: string): void | Promise<void> => {
    if (id.startsWith('inline-')) {
      inlineNotify.dismiss(id);
      return;
    } 
    return closeNotification(id);
  },
  
  dismissAll: (): void | Promise<void> => {
    inlineNotify.dismissAll();
    if (isTauri()) {
      return closeAllNotifications();
    }
  },

  inline: {
    success: (title: string, body: string, options: Partial<NotificationOptions> = {}): string => 
      inlineNotify.success(title, body, { ...options, displayMethod: 'inline' }),
    error: (title: string, body: string, options: Partial<NotificationOptions> = {}): string => 
      inlineNotify.error(title, body, { ...options, displayMethod: 'inline' }),
    warning: (title: string, body: string, options: Partial<NotificationOptions> = {}): string => 
      inlineNotify.warning(title, body, { ...options, displayMethod: 'inline' }),
    info: (title: string, body: string, options: Partial<NotificationOptions> = {}): string => 
      inlineNotify.info(title, body, { ...options, displayMethod: 'inline' }),
    show: (options: NotificationOptions): string => 
      inlineNotify.show({ ...options, displayMethod: 'inline' })
  },
  
  system: {
    success: (title: string, body: string, options: Partial<NotificationOptions> = {}): Promise<string> => 
      createTauriNotification({ title, body, type: 'success', displayMethod: 'system', ...options }),
    error: (title: string, body: string, options: Partial<NotificationOptions> = {}): Promise<string> => 
      createTauriNotification({ title, body, type: 'error', displayMethod: 'system', ...options }),
    warning: (title: string, body: string, options: Partial<NotificationOptions> = {}): Promise<string> => 
      createTauriNotification({ title, body, type: 'warning', displayMethod: 'system', ...options }),
    info: (title: string, body: string, options: Partial<NotificationOptions> = {}): Promise<string> => 
      createTauriNotification({ title, body, type: 'info', displayMethod: 'system', ...options }),
    show: (options: NotificationOptions): Promise<string> => 
      createTauriNotification({ ...options, displayMethod: 'system' })
  },
  
  window: {
    success: (title: string, body: string, options: Partial<NotificationOptions> = {}): Promise<string> => 
      createTauriNotification({ title, body, type: 'success', displayMethod: 'window', ...options }),
    error: (title: string, body: string, options: Partial<NotificationOptions> = {}): Promise<string> => 
      createTauriNotification({ title, body, type: 'error', displayMethod: 'window', ...options }),
    warning: (title: string, body: string, options: Partial<NotificationOptions> = {}): Promise<string> => 
      createTauriNotification({ title, body, type: 'warning', displayMethod: 'window', ...options }),
    info: (title: string, body: string, options: Partial<NotificationOptions> = {}): Promise<string> => 
      createTauriNotification({ title, body, type: 'info', displayMethod: 'window', ...options }),
    show: (options: NotificationOptions): Promise<string> => 
      createTauriNotification({ ...options, displayMethod: 'window' })
  }
};

export const float = floatApi;
export default float;

if (typeof window !== 'undefined') {
  const initializeFloat = () => {
    console.log('Float notification library initialized');
    (window as any).__float = float;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFloat);
  } else {
    initializeFloat();
  }
}