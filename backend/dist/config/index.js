"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    jwt: {
        secret: process.env.JWT_SECRET || 'meinueberblick-default-jwt-secret-key-32chars',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    ai: {
        useMock: process.env.USE_MOCK_AI === 'true' || !process.env.MISTRAL_API_KEY || process.env.MISTRAL_API_KEY === 'mock-key',
        mistralApiKey: process.env.MISTRAL_API_KEY || '',
        mistralModel: process.env.MISTRAL_MODEL || 'mistral-small-latest',
        mistralEndpoint: 'https://api.mistral.ai/v1/chat/completions',
    },
    storage: {
        dataDir: path_1.default.resolve(process.env.DATA_DIR || './data'),
    },
};
