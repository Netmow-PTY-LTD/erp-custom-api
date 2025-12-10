const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const modulesPath = path.join(__dirname, 'modules');
fs.readdirSync(modulesPath).forEach((moduleName) => {
  const moduleDir = path.join(modulesPath, moduleName);
  if (!fs.statSync(moduleDir).isDirectory()) return;
  const moduleFiles = fs.readdirSync(moduleDir);
  moduleFiles.forEach((fileOrFolder) => {
    const candidate = path.join(moduleDir, fileOrFolder);
    if (fs.statSync(candidate).isDirectory()) {
      const submoduleName = fileOrFolder;
      const routeFile = path.join(candidate, `${submoduleName}.routes.js`);
      if (fs.existsSync(routeFile)) {
        // mount at /<submoduleName>
        router.use(`/${submoduleName}`, require(routeFile));
      }
    } else {
      if (fileOrFolder.endsWith('.routes.js')) {
        const routePath = path.join(moduleDir, fileOrFolder);
        const mountPath = '/' + moduleName;
        router.use(mountPath, require(routePath));
      }
    }
  });
});

module.exports = router;
