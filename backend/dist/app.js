"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const finance_routes_1 = __importDefault(require("./routes/finance.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const createApp = () => {
    const app = (0, express_1.default)();
    // Security headers (configured for Web, Mobile App & Cloud Preview Iframes like Bonto)
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        frameguard: false,
    }));
    // CORS configured for Web & Mobile App (Capacitor)
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow mobile apps (Capacitor/Cordova) where origin is undefined or null, or any web domain
            callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)('dev'));
    // Health check endpoint
    app.get('/api/health', (req, res) => {
        res.json({
            status: 'ok',
            service: 'Mein Überblick Backend',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });
    // API Routes
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/finances', finance_routes_1.default);
    app.use('/api/ai', ai_routes_1.default);
    // Fallback 404 handler for unknown API routes
    app.all('/api/*', (req, res) => {
        res.status(404).json({ error: 'Endpoint nicht gefunden.' });
    });
    // Serve built React Frontend when available (Single-Container / Bonto Fullstack Mode)
    const frontendDistPath = path_1.default.resolve(__dirname, '../../frontend/dist');
    const frontendIndexHtml = path_1.default.join(frontendDistPath, 'index.html');
    if (fs_1.default.existsSync(frontendIndexHtml)) {
        app.use(express_1.default.static(frontendDistPath));
        app.get('*', (req, res) => {
            res.sendFile(frontendIndexHtml);
        });
    }
    else {
        // Fallback 404 handler if frontend is hosted separately
        app.use('*', (req, res) => {
            res.status(404).json({ error: 'Endpoint nicht gefunden.' });
        });
    }
    // Global Error Handler
    app.use(error_middleware_1.errorHandler);
    return app;
};
exports.createApp = createApp;
