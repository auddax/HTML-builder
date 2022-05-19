const fs = require('fs/promises');
const path = require('path');

const srcDirPathAssets = path.join(__dirname, 'assets');
const srcDirPathStyles = path.join(__dirname, 'styles');
const srcDirPathComponents = path.join(__dirname, 'components');
const srcFilePathTemplate = path.join(__dirname, 'template.html');
const destDirPathAssets = path.join(__dirname, 'project-dist/assets');
const destFilePathStyles = path.join(__dirname, 'project-dist/style.css');
const destFilePathHTML = path.join(__dirname, 'project-dist/index.html');

async function copyDir(srcDirPath, destDirPath) {
  await fs.mkdir(destDirPath, { recursive: true });
  const content = await fs.readdir(srcDirPath, {withFileTypes: true});
  for (const item of content) {
    const srcFilePath = path.join(srcDirPath, item.name);
    const destFilePath = path.join(destDirPath, item.name);
    if (item.isFile()) {
      await fs.copyFile(srcFilePath, destFilePath);  
    } else {
      copyDir(srcFilePath, destFilePath);
    }
  }
}

async function mergeStyles(srcDirPath, destFilePath) {
  const content = await fs.readdir(srcDirPath, {withFileTypes: true});
  for (const item of content) {
    if (item.isFile()) {
      const filePath = path.join(srcDirPath, item.name);
      const ext = path.parse(filePath).ext;
      if (ext === '.css') {
        const content = await fs.readFile(filePath);
        await fs.appendFile(destFilePath, content);
      }
    }
  }
}

async function buildHTML(srcDirPathComponents, srcFilePathTemplate, destFilePathHTML) {
  let content = await fs.readFile(srcFilePathTemplate, 'utf-8');
  const components = await fs.readdir(srcDirPathComponents, {withFileTypes: true});
  for (const item of components) {
    if (item.isFile()) {
      const filePath = path.join(srcDirPathComponents, item.name);
      const ext = path.parse(filePath).ext;
      const name = path.parse(filePath).name;
      if (ext === '.html') {
        const component = await fs.readFile(filePath, 'utf-8');
        content = content.replace('{{' + name + '}}', component);
      }
    }
  }
  await fs.writeFile(destFilePathHTML, content);
}

// Copy assets directory
(async function() {
  try {
    await fs.access(destDirPathAssets);
    await fs.rm(destDirPathAssets, { recursive: true });
    copyDir(srcDirPathAssets, destDirPathAssets);
  } catch (err) {
    if (err.code === 'ENOENT') {
      copyDir(srcDirPathAssets, destDirPathAssets);
    } else {
      console.log(err);
    }
  }
})();

// Merge styles
(async function() {
  try {
    await fs.access(destFilePathStyles);
    await fs.rm(destFilePathStyles);
    mergeStyles(srcDirPathStyles, destFilePathStyles);
  } catch (err) {
    if (err.code === 'ENOENT') {
      mergeStyles(srcDirPathStyles, destFilePathStyles);
    } else {
      console.log(err);
    }
  }
})();

// Build HTML
(async function() {
  try {
    buildHTML(srcDirPathComponents, srcFilePathTemplate, destFilePathHTML);
  } catch (err) {
    console.log(err);
  }
})();
