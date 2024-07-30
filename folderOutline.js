const fs = require('fs');
const path = require('path');

function getFolderOutline(dir, depth = 0) {
  let outline = '';
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();

    // Skip node_modules directory
    if (item === 'node_modules') {
      return;
    }

    outline += `${'  '.repeat(depth)}- ${item}\n`;
    if (isDirectory) {
      outline += getFolderOutline(itemPath, depth + 1);
    }
  });

  return outline;
}

const currentDir = __dirname;
const folderOutline = getFolderOutline(currentDir);

fs.writeFileSync('folder-outline.txt', folderOutline, 'utf-8');
console.log('Folder outline saved to folder-outline.txt');
