const path = require('path');

const rootDir = __dirname;

// Configure environment defaults for single-container hosting (Bonto)
process.env.BONTO_FULLSTACK = 'true';
if (!process.env.PORT) {
  process.env.PORT = '3000';
}
if (!process.env.DATA_DIR) {
  process.env.DATA_DIR = path.join(rootDir, 'data');
}

// Start the standalone bundled Express + React Fullstack Server (zero install needed)
require('./backend/dist/server.bundle.js');
