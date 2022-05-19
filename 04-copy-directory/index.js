const fs = require('fs/promises');
const path = require('path');

const srcDirPath = path.join(__dirname, 'files');
const destDirPath = path.join(__dirname, 'files-copy');

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

(async function(srcDirPath, destDirPath) {
  try {
    await fs.access(destDirPath);
    await fs.rm(destDirPath, { recursive: true });
    copyDir(srcDirPath, destDirPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      copyDir(srcDirPath, destDirPath);
    } else {
      console.log(err);
    }
  }
})(srcDirPath, destDirPath);
