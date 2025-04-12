const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourceDir = path.resolve(__dirname, '../src');
const destDir = path.resolve(__dirname, '../dist');

// Files to copy
const filesToCopy = [
  'notification.html'
];

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy each file
filesToCopy.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${sourcePath} to ${destPath}`);
  } else {
    console.error(`Source file not found: ${sourcePath}`);
  }
});

// Make sure component directories exist
const componentsDestDir = path.join(destDir, 'components');
const hooksDestDir = path.join(destDir, 'hooks');
const utilsDestDir = path.join(destDir, 'utils');

[componentsDestDir, hooksDestDir, utilsDestDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

console.log('Asset copying complete!');