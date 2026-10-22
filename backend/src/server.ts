import { createApp } from './app';
import { config } from './config';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🚀 Mein Überblick Backend gestartet`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🤖 KI-Modus: ${config.ai.useMock ? 'MOCK (Testdaten)' : 'MISTRAL LIVE API'}`);
  console.log(`📁 Datenordner: ${config.storage.dataDir}`);
  console.log(`=========================================`);
});

const gracefulShutdown = () => {
  console.log('Fahre Server herunter...');
  server.close(() => {
    console.log('Server erfolgreich beendet.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
