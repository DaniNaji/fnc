import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`🚀 Mein Überblick Backend + Webapp gestartet`);
  console.log(`📡 URL: http://0.0.0.0:${config.port}`);
  console.log(`🤖 KI-Modus: ${config.ai.useMock ? 'MOCK (Testdaten)' : 'MISTRAL LIVE API'}`);
  console.log(`📁 Datenordner: ${config.storage.dataDir}`);
  console.log(`=========================================`);
});

// In single-container cloud environments (like Bonto), also listen on common proxy ports if free
if (process.env.BONTO_FULLSTACK === 'true') {
  const extraPorts = [3000, 5000, 8000, 8080].filter((p) => p !== config.port);
  for (const p of extraPorts) {
    const extraServer = app.listen(p, '0.0.0.0', () => {
      console.log(`🔗 Cloud-Port-Listener aktiv auf Port ${p}`);
    });
    extraServer.on('error', () => {
      // Ignore if port is already in use
    });
  }
}

const gracefulShutdown = () => {
  console.log('Fahre Server herunter...');
  server.close(() => {
    console.log('Server erfolgreich beendet.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
