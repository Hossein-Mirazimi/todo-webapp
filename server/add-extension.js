import fs from 'fs';
import path from 'path';

function updateImportsInDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);

    if (fs.statSync(fullPath).isDirectory()) {
      updateImportsInDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      updateImportPathsInFile(fullPath);
    }
  }
}

function updateImportPathsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex for static imports: import ... from './path'
  const staticImportRegex = /from\s+(['"])(\.{1,2}\/[^'"\s]+?)(?<!\.js)\1/g;

  // Regex for dynamic imports: await import('./path')
  const dynamicImportRegex = /import\s*\(\s*(['"])(\.{1,2}\/[^'"\s]+?)(?<!\.js)\1\s*\)/g;

  content = content.replace(staticImportRegex, (match, quote, path) => {
    return `from ${quote}${path}.js${quote}`;
  });

  content = content.replace(dynamicImportRegex, (match, quote, path) => {
    return `import(${quote}${path}.js${quote})`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated imports in: ${filePath}`);
}

const targetDirectory = process.argv[2];

if (!targetDirectory) {
  console.error('Please provide a target directory as an argument.');
  console.error('Usage: node update-imports.js <target-directory>');
  process.exit(1);
}

if (!fs.existsSync(targetDirectory)) {
  console.error(`The provided directory does not exist: ${targetDirectory}`);
  process.exit(1);
}

// Start processing
updateImportsInDirectory(targetDirectory);
console.log('Import paths updated successfully.');
