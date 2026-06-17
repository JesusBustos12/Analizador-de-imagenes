import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import analyzeRoutes from './routes/analyze.routes';
import { errorHandler } from './middlewares/errorHandler';
import { initDb } from './db';
import { setupSwagger } from './config/swagger';
import { logger } from './config/logger';

const app = express();
const port = env.PORT || 3001;

// --- SEGURIDAD Y MIDDLEWARES GLOBALES ---
app.use(helmet({
  contentSecurityPolicy: false, // Opcional: desactivar CSP si da problemas con imágenes en línea, o configurarlo bien
}));

// Morgan para logging profesional
app.use(morgan('dev'));

// Restrict CORS (En prod debería ser solo el dominio del cliente)
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true, // Necesario para enviar HttpOnly cookies
}));

app.use(express.json({ limit: '50mb' })); // Incrementamos limite si las imgs son grandes, aunque usaremos compresión en frontend
app.use(cookieParser()); // Para poder leer req.cookies.token

// --- RUTAS API ---
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);

// --- STATIC FILES SPA FALLBACK ---
app.use(express.static(path.resolve(process.cwd(), 'dist')));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
});

// --- SWAGGER DOCS ---
setupSwagger(app);

// --- MANEJO GLOBAL DE ERRORES ---
// Debe ir al final después de todas las rutas
app.use(errorHandler);

// Initialize DB and start server
// Initialize DB and start server
initDb().then(() => {
  // Solo iniciar listen en desarrollo o entornos que no sean serverless de Vercel
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
      logger.info(`SATI Secure Backend running on port ${port}`);
    });
  }
}).catch((error) => {
  logger.error('Failed to initialize DB and start server:', error);
});

// Export default app for Vercel Serverless deployment
export default app;

