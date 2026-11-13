import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.routes';
import financeRoutes from './routes/finance.routes';
import aiRoutes from './routes/ai.routes';
import { errorHandler } from './middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // Security headers (configured for Web, Mobile App & Cloud Preview Iframes like Bonto)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      frameguard: false,
    })
  );

  // CORS configured for Web & Mobile App (Capacitor)
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow mobile apps (Capacitor/Cordova) where origin is undefined or null, or any web domain
        callback(null, true);
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

  // Fallback 404 handler for unknown API routes
  app.all('/api/*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint nicht gefunden.' });
  });

  // Serve built React Frontend when available (Single-Container / Bonto Fullstack Mode)
  const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
  const frontendIndexHtml = path.join(frontendDistPath, 'index.html');

  if (fs.existsSync(frontendIndexHtml)) {
    app.use(express.static(frontendDistPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(frontendIndexHtml);
    });
  } else {
    // Fallback 404 handler if frontend is hosted separately
    app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ error: 'Endpoint nicht gefunden.' });
    });
  }

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
