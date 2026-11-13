const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

function run(cmd, cwd) {
  console.log(`> [${path.basename(cwd)}] ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

// 1. Ensure dependencies are installed
if (!fs.existsSync(path.join(backendDir, 'node_modules'))) {
  run('npm install --include=dev', backendDir);
}
if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
  run('npm install --include=dev', frontendDir);
}

// 2. Ensure Frontend & Backend are built
if (!fs.existsSync(path.join(frontendDir, 'dist', 'index.html'))) {
  run('npm run build', frontendDir);
}
if (!fs.existsSync(path.join(backendDir, 'dist', 'server.js'))) {
  run('npm run build', backendDir);
}

// 3. Configure environment defaults for single-container hosting (Bonto)
process.env.BONTO_FULLSTACK = 'true';
if (!process.env.PORT) {
  process.env.PORT = '3000';
}
if (!process.env.DATA_DIR) {
  process.env.DATA_DIR = path.join(rootDir, 'data');
}

// 4. Start the Express Fullstack Server
require('./backend/dist/server.js');

