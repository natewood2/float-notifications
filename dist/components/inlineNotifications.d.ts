import { NotificationOptions } from '../types';
interface InlineNotificationAPI {
    show: (options: NotificationOptions) => string;
    success: (title: string, body: string, options?: Partial<NotificationOptions>) => string;
    error: (title: string, body: string, options?: Partial<NotificationOptions>) => string;
    warning: (title: string, body: string, options?: Partial<NotificationOptions>) => string;
    info: (title: string, body: string, options?: Partial<NotificationOptions>) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
}
export declare const inlineNotify: InlineNotificationAPI;
export default inlineNotify;
