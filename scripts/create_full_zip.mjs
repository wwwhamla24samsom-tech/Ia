import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function buildFullZip() {
  console.log('📦 Starting Full Project ZIP compression...');
  const zip = new JSZip();
  const rootDir = process.cwd();

  const ignoreDirs = new Set(['node_modules', '.git', 'dist', '.vite', '.next']);
  const ignoreFiles = new Set(['.DS_Store']);

  function addFolderToZip(currentDir, relativePath = '') {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      if (ignoreDirs.has(item) || ignoreFiles.has(item)) continue;
      const fullPath = path.join(currentDir, item);
      const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        addFolderToZip(fullPath, itemRelativePath);
      } else {
        // Skip existing large zip files in public
        if (item.endsWith('.zip')) continue;
        const fileData = fs.readFileSync(fullPath);
        zip.file(itemRelativePath, fileData);
      }
    }
  }

  addFolderToZip(rootDir);

  // Ensure public folder exists
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'sarah_sovereign_full_codebase.zip');
  console.log('🗜️ Generating ZIP buffer...');
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  fs.writeFileSync(outputPath, content);
  const sizeMb = (content.length / (1024 * 1024)).toFixed(2);
  console.log(`✅ Successfully generated full project zip at: ${outputPath} (${sizeMb} MB)`);
}

buildFullZip().catch(console.error);
