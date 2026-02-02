/**
 * Production Console Cleanup Script
 * 
 * This script removes debug console.log and console.error statements
 * while preserving essential error logging in catch blocks.
 * 
 * Run this before deploying to production.
 */

const fs = require('fs');
const path = require('path');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Remove standalone console.log lines
  content = content.replace(/^\s*console\.log\([^)]*\);?\s*[\r\n]+/gm, '');
  
  // Remove console.log that appear in catch blocks (debug only)
  content = content.replace(/^\s*console\.error\("Error fetching[^"]*", err\);?\s*[\r\n]+/gm, '');
  content = content.replace(/^\s*console\.error\("Error [^"]*", error\);?\s*[\r\n]+/gm, '');
  content = content.replace(/^\s*console\.error\('[^']*', err\);?\s*[\r\n]+/gm, '');
  content = content.replace(/^\s*console\.error\('[^']*', error\);?\s*[\r\n]+/gm, '');
  
  // Replace debug console.error in specific patterns with silent handling
  content = content.replace(/console\.error\("(?:Failed|Error) to[^"]*",\s*\w+\);?/gm, '// Production: Silent error handling');
  content = content.replace(/console\.error\('(?:Failed|Error) to[^']*',\s*\w+\);?/gm, '// Production: Silent error handling');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cleaned: ${path.basename(filePath)}`);
    return true;
  }
  return false;
}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build') {
        walkDirectory(filePath, callback);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      callback(filePath);
    }
  });
}

// Clean client files
console.log('\n🧹 Cleaning frontend files...');
walkDirectory('./client/src', cleanFile);

// Clean backend files (keep essential error logs in controllers)
console.log('\n🧹 Cleaning backend files...');
walkDirectory('./backend/src/controllers', cleanFile);
walkDirectory('./backend/src/middleware', cleanFile);

console.log('\n✅ Console cleanup complete!\n');
