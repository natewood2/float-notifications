# @float-tauri/notifications

[![npm version](https://img.shields.io/npm/v/@float-tauri/notifications)](https://www.npmjs.com/package/@float-tauri/notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A unified notification system for Tauri applications with support for:
- **System notifications** (native OS notifications)
- **Window notifications** (in-app floating notifications)
- **Inline notifications** (contextual UI messages)

## Features

✅ Cross-platform notification handling  
✅ Three display methods: `system`, `window`, and `inline`  
✅ TypeScript support  
✅ Customizable notification types (`success`, `error`, `warning`, `info`)  
✅ Notification click handlers  
✅ Promise-based API  

## Installation

```bash
npm install @float-tauri/notifications
# or
yarn add @float-tauri/notifications

import { float } from '@float-tauri/notifications';

// System notification (OS-level)
float.system.success('Success!', 'Operation completed successfully');

// Window notification (floating in-app)
float.window.warning('Warning', 'Disk space running low');

// Inline notification (UI element)
float.inline.info('New message', 'You have 3 unread messages');