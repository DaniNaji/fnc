const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function freePortLinux(port) {
  if (process.platform !== 'linux') return false;
  let killed = false;
  try {
    const hexPort = port.toString(16).toUpperCase().padStart(4, '0');
    const inodes = new Set();
    for (const netFile of ['/proc/net/tcp', '/proc/net/tcp6']) {
      if (!fs.existsSync(netFile)) continue;
      const lines = fs.readFileSync(netFile, 'utf8').split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 10 && parts[1] && parts[1].endsWith(`:${hexPort}`) && parts[3] === '0A') {
          inodes.add(parts[9]);
        }
      }
    }
    if (inodes.size === 0) return false;
    for (const entry of fs.readdirSync('/proc')) {
      const pid = parseInt(entry, 10);
      if (!pid || pid === process.pid || pid === process.ppid) continue;
      const fdDir = `/proc/${pid}/fd`;
      try {
        for (const fd of fs.readdirSync(fdDir)) {
          try {
            const target = fs.readlinkSync(`${fdDir}/${fd}`);
            for (const inode of inodes) {
              if (target === `socket:[${inode}]`) {
                console.log(`🔄 Beende alten Prozess auf Port ${port} (PID ${pid})...`);
                process.kill(pid, 'SIGKILL');
                killed = true;
              }
            }
          } catch {}
        }
      } catch {}
    }
  } catch {}
  return killed;
}

// Configure environment defaults for single-container hosting (Bonto)
process.env.BONTO_FULLSTACK = 'true';
if (!process.env.PORT) {
  process.env.PORT = '3000';
}
if (!process.env.DATA_DIR) {
  process.env.DATA_DIR = path.join(rootDir, 'data');
}

const targetPort = parseInt(process.env.PORT, 10) || 3000;
const wasKilled = freePortLinux(targetPort);

setTimeout(
  () => {
    require('./backend/dist/server.bundle.js');
  },
  wasKilled ? 400 : 0
);
