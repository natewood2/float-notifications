import { NotificationOptions } from '../types';
/**
 * Hook for creating notifications in Tauri applications
 */
export declare const useNotification: () => import("../components/NotificationProvider").NotificationContextValue | {
    notify: (options: NotificationOptions) => Promise<string>;
    notifySimple: (title: string, body: string) => Promise<string>;
    notifySuccess: (title: string, body: string) => Promise<string>;
    notifyError: (title: string, body: string) => Promise<string>;
    notifyWarning: (title: string, body: string) => Promise<string>;
    notifyInfo: (title: string, body: string) => Promise<string>;
};
export default useNotification;
