import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import financeRoutes from './routes/finance.routes';
import aiRoutes from './routes/ai.routes';
import { errorHandler } from './middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configured for Web & Mobile App (Capacitor)
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow mobile apps (Capacitor/Cordova) where origin is undefined or null, or localhost
        if (
          !origin ||
          origin.startsWith('http://localhost') ||
          origin.startsWith('https://localhost') ||
          origin.startsWith('capacitor://') ||
          origin.startsWith('ionic://') ||
          origin === 'null'
        ) {
          callback(null, true);
        } else {
          // Allow all origins in development or specific domain in production
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Mein Überblick Backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/finances', financeRoutes);
  app.use('/api/ai', aiRoutes);

  // Fallback 404 handler
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint nicht gefunden.' });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
