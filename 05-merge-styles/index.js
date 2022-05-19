const fs = require('fs/promises');
const path = require('path');

const srcDirPath = path.join(__dirname, 'styles');
const destFilePath = path.join(__dirname, 'project-dist/bundle.css');

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

(async function(srcDirPath, destFilePath) {
  try {
    await fs.access(destFilePath);
    await fs.rm(destFilePath);
    mergeStyles(srcDirPath, destFilePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      mergeStyles(srcDirPath, destFilePath);
    } else {
      console.log(err);
    }
  }
})(srcDirPath, destFilePath);