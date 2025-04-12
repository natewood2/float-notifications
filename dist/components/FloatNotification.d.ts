import React from 'react';
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
export declare const FloatNotification: React.FC<NotificationProps>;
export default FloatNotification;
