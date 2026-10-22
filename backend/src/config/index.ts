import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
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
    dataDir: path.resolve(process.env.DATA_DIR || './data'),
  },
};
