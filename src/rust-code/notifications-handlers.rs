use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, Runtime, WindowBuilder, WindowUrl, Window};
use tauri::api::notification::Notification;
use uuid::Uuid;

// Notification options structure that matches your TypeScript interface
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationOptions {
    pub title: String,
    pub body: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub icon: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub click_action: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub actions: Option<Vec<NotificationAction>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub display_method: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationAction {
    pub label: String,
    pub id: String,
}

// Command to show a system notification (native OS notification)
#[tauri::command]
pub fn show_system_notification<R: Runtime>(
    app: AppHandle<R>,
    options: NotificationOptions,
) -> Result<String, String> {
    println!("DEBUG: show_system_notification called with title: {}", options.title);
    println!("DEBUG: Full options: {:?}", options);
    // Generate unique ID for the notification
    let id = format!("system-{}", Uuid::new_v4().to_string());
    
    let notification_type = options.r#type.clone().unwrap_or_else(|| "default".to_string());
    
    // Create system notification
    let mut notification_builder = Notification::new(&app.config().tauri.bundle.identifier)
        .title(&options.title)
        .body(&options.body);
    
    // Add icon if provided
    if let Some(icon) = options.icon.as_ref() {
        notification_builder = notification_builder.icon(icon);
    }
    
    // Show the notification
    match notification_builder.show() {
        Ok(_) => Ok(id),
        Err(e) => Err(format!("Failed to show system notification: {}", e)),
    }
}

// Command to spawn a window notification
#[tauri::command]
pub fn show_window_notification<R: Runtime>(
    app: AppHandle<R>,
    options: NotificationOptions,
) -> Result<String, String> {
    println!("DEBUG: show_window_notification called with title: {}", options.title);
    println!("DEBUG: Full options: {:?}", options);
    println!("DEBUG: display_method: {:?}", options.display_method);
    // Generate unique ID for the window
    let id = format!("window-{}", Uuid::new_v4().to_string());
    
    // Create a new window for the notification
    let window = match WindowBuilder::new(
        &app,
        id.clone(),
        WindowUrl::App("index.html?notification=true".into())
    )
    .title(&options.title)
    .inner_size(320.0, 64.0)
    .decorations(false)  // No window frame
    .always_on_top(true)
    .skip_taskbar(true)  // Don't show in taskbar
    .center()
    .build() {
        Ok(window) => window,
        Err(e) => return Err(format!("Failed to create notification window: {}", e)),
    };
    
    // Position the window based on the requested position
    match options.position.as_deref() {
        Some("top-right") | None => position_window_top_right(&window, 0)?,
        Some("top-left") => position_window_top_left(&window, 0)?,
        Some("bottom-right") => position_window_bottom_right(&window, 0)?,
        Some("bottom-left") => position_window_bottom_left(&window, 0)?,
        _ => position_window_top_right(&window, 0)?,
    }
    
    // Pass notification data to the window
    if let Err(e) = window.emit("notification-data", options.clone()) {
        return Err(format!("Failed to send notification data: {}", e));
    }
    
    // Set up auto-close timer if duration is specified
    if let Some(duration) = options.duration {
        if duration > 0 {
            let window_clone = window.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(duration));
                let _ = window_clone.close();
            });
        }
    }
    
    Ok(id)
}

// Helper function to position a window in the top-right corner
fn position_window_top_right<R: Runtime>(window: &Window<R>, offset_y: i32) -> Result<(), String> {
    // Get the primary monitor
    let monitor = match window.primary_monitor() {
        Ok(Some(monitor)) => monitor,
        Ok(None) => return Err("No primary monitor found".to_string()),
        Err(e) => return Err(format!("Failed to get primary monitor: {}", e)),
    };
    
    // Get the monitor size
    let monitor_size = monitor.size();
    
    // Get the window size
    let window_size = match window.inner_size() {
        Ok(size) => size,
        Err(e) => return Err(format!("Failed to get window size: {}", e)),
    };
    
    // Calculate position (top-right corner with some padding)
    let x = (monitor_size.width as i32) - (window_size.width as i32) - 20;
    let y = 20 + offset_y;
    
    // Set the window position
    match window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y })) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to set window position: {}", e)),
    }
}

// Helper function to position a window in the top-left corner
fn position_window_top_left<R: Runtime>(window: &Window<R>, offset_y: i32) -> Result<(), String> {
    // Calculate position (top-left corner with some padding)
    let x = 20;
    let y = 20 + offset_y;
    
    // Set the window position
    match window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y })) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to set window position: {}", e)),
    }
}

// Helper function to position a window in the bottom-right corner
fn position_window_bottom_right<R: Runtime>(window: &Window<R>, offset_y: i32) -> Result<(), String> {
    // Get the primary monitor
    let monitor = match window.primary_monitor() {
        Ok(Some(monitor)) => monitor,
        Ok(None) => return Err("No primary monitor found".to_string()),
        Err(e) => return Err(format!("Failed to get primary monitor: {}", e)),
    };
    
    // Get the monitor size
    let monitor_size = monitor.size();
    
    // Get the window size
    let window_size = match window.inner_size() {
        Ok(size) => size,
        Err(e) => return Err(format!("Failed to get window size: {}", e)),
    };
    
    // Calculate position (bottom-right corner with some padding)
    let x = (monitor_size.width as i32) - (window_size.width as i32) - 20;
    let y = (monitor_size.height as i32) - (window_size.height as i32) - 20 - offset_y;
    
    // Set the window position
    match window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y })) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to set window position: {}", e)),
    }
}

// Helper function to position a window in the bottom-left corner
fn position_window_bottom_left<R: Runtime>(window: &Window<R>, offset_y: i32) -> Result<(), String> {
    // Get the primary monitor
    let monitor = match window.primary_monitor() {
        Ok(Some(monitor)) => monitor,
        Ok(None) => return Err("No primary monitor found".to_string()),
        Err(e) => return Err(format!("Failed to get primary monitor: {}", e)),
    };
    
    // Get the monitor size
    let monitor_size = monitor.size();
    
    // Get the window size
    let window_size = match window.inner_size() {
        Ok(size) => size,
        Err(e) => return Err(format!("Failed to get window size: {}", e)),
    };
    
    // Calculate position (bottom-left corner with some padding)
    let x = 20;
    let y = (monitor_size.height as i32) - (window_size.height as i32) - 20 - offset_y;
    
    // Set the window position
    match window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y })) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to set window position: {}", e)),
    }
}

// Command to close a notification window
#[tauri::command]
pub fn close_window_notification<R: Runtime>(
    app: AppHandle<R>,
    id: String,
) -> Result<(), String> {
    match app.get_window(&id) {
        Some(window) => match window.close() {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Failed to close notification window: {}", e)),
        },
        None => Err(format!("Window with id '{}' not found", id)),
    }
}

// Command to close all notifications
#[tauri::command]
pub fn close_all_notifications<R: Runtime>(
    app: AppHandle<R>,
) -> Result<(), String> {
    // Close all windows that start with "window-"
    for window in app.windows().values() {
        if window.label().starts_with("window-") {
            let _ = window.close();
        }
    }
    
    Ok(())
}