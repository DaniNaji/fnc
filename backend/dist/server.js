"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const app = (0, app_1.createApp)();
const server = app.listen(config_1.config.port, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`🚀 Mein Überblick Backend + Webapp gestartet`);
    console.log(`📡 URL: http://0.0.0.0:${config_1.config.port}`);
    console.log(`🤖 KI-Modus: ${config_1.config.ai.useMock ? 'MOCK (Testdaten)' : 'MISTRAL LIVE API'}`);
    console.log(`📁 Datenordner: ${config_1.config.storage.dataDir}`);
    console.log(`=========================================`);
});
// In single-container cloud environments (like Bonto), also listen on common proxy ports if free
if (process.env.BONTO_FULLSTACK === 'true') {
    const extraPorts = [3000, 5000, 8000, 8080].filter((p) => p !== config_1.config.port);
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
