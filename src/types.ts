export interface NotificationAction {
  label: string;
  id: string;
  onClick?: () => void;
  closeOnClick?: boolean;
}

export interface NotificationOptions {
  /**
   * The title of the notification
   */
  title: string;
  
  /**
   * The main content/message of the notification
   */
  body: string;
  
  /**
   * Path to the icon image (optional)
   */
  icon?: string;
  
  /**
   * Duration in milliseconds before the notification disappears
   * Default: 5000ms (5 seconds)
   */
  duration?: number;
  
  /**
   * Action identifier for click events
   */
  clickAction?: string;
  
  /**
   * Click handler for the entire notification
   */
  onClick?: () => void;
  
  /**
   * Position of the notification on the screen
   * Default: 'top-right'
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  
  /**
   * Type of notification which affects styling
   * Default: 'default'
   */
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  
  /**
   * Optional array of action buttons
   */
  actions?: NotificationAction[];
  
  /**
   * Display method for the notification
   * - 'system': Use native system notifications (default in Tauri)
   * - 'window': Use custom window notifications
   * - 'inline': Use inline notifications within the current window
   * Default: 'system' in Tauri, 'inline' in web
   */
  displayMethod?: 'system' | 'window' | 'inline';
}

export interface NotificationItem extends NotificationOptions {
  id: string;
}