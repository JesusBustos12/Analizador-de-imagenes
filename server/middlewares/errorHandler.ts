import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`[Error]: ${err.stack || err.message || err}`);
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    success: false,
    error: message,
    // Provide details only in development (assuming missing NODE_ENV is dev)
    ...(process.env.NODE_ENV !== 'production' && { details: err.stack }),
  });
};
