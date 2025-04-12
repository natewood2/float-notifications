import React from 'react';
import { NotificationItem } from '../types';
interface NotificationContainerProps {
    notifications: NotificationItem[];
    onClose: (id: string) => void;
}
declare const NotificationContainer: React.FC<NotificationContainerProps>;
export default NotificationContainer;
