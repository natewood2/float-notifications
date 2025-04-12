import React, { ReactNode } from 'react';
import { NotificationOptions } from '../types';
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
export declare const NotificationContext: React.Context<NotificationContextValue>;
interface NotificationProviderProps {
    children: ReactNode;
    defaultDuration?: number;
    defaultPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
export declare const NotificationProvider: React.FC<NotificationProviderProps>;
export default NotificationProvider;
