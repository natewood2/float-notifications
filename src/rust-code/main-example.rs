#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
  )]
  
  mod notification_handlers;
  
  use notification_handlers::{
    show_system_notification,
    show_window_notification,
    close_window_notification,
    close_all_notifications
  };
  
  fn main() {
    tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![
        show_system_notification,
        show_window_notification,
        close_window_notification,
        close_all_notifications
      ])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
  }