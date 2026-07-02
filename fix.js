import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
        if (p1.endsWith('.js')) return match;
        
        const absoluteTarget = path.join(path.dirname(fullPath), p1);
        let isDir = false;
        try {
          isDir = fs.statSync(absoluteTarget).isDirectory();
        } catch(e) {}
        
        if (isDir) {
           return `from '${p1}/index.js'`;
        }
        return `from '${p1}.js'`;
      });
      fs.writeFileSync(fullPath, content);
    }
  }
}
fixImports('./server');
