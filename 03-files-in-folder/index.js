const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

(async function(dirPath) {
  try {
    const content = await fs.readdir(dirPath, {withFileTypes: true});
    for (const item of content)
      if (item.isFile()) {
        const filePath = path.join(dirPath, item.name);
        const stat = await fs.stat(filePath);
        const name = path.parse(filePath).name;
        const ext = path.parse(filePath).ext.slice(1);
        const size = (stat.size/1024).toFixed(3) + 'kb';
        console.log(name + ' - ' + ext + ' - ' + size);
      }
  } catch (err) {
    console.error(err);
  }
})(dirPath);