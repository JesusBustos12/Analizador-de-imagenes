import winston from 'winston';
import 'winston-daily-rotate-file';
import { env } from './env.js';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Formato personalizado para la consola (desarrollo)
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }), // Imprime el stack trace si hay un error
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

// Rotador de archivos diarios para evitar logs gigantescos en producción
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/sati-backend-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d', // Mantiene logs de los últimos 14 días
  maxSize: '20m',  // Rota el archivo si pasa los 20MB
});

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json() // Formato JSON en archivos para fácil parseo forense
  ),
  transports: [
    fileRotateTransport,
  ],
});

// En desarrollo, también imprime en la consola con colores legibles
if (env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}
