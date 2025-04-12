import { NotificationOptions } from './types';
export { default as FloatNotification } from './components/FloatNotification';
export { default as NotificationProvider } from './components/NotificationProvider';
export { default as NotificationContainer } from './components/NotificationContainer';
export { default as useNotification } from './hooks/useNotification';
export { isTauri, createTauriNotification, closeNotification, closeAllNotifications, listenToNotificationClicks } from './utils/tauri-helper';
export * from './types';
export { default as inlineNotify } from './components/inlineNotifications';
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
export declare const float: FloatNotificationAPI;
export default float;
