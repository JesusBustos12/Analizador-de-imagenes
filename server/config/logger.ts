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

const transportsList: winston.transport[] = [];

// En Vercel (o en Serverless en general), el sistema de archivos es de solo lectura.
// Por lo tanto, no podemos escribir en la carpeta 'logs/'. Solo usamos Console en Vercel.
if (!process.env.VERCEL) {
  const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/sati-backend-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '20m',
  });
  transportsList.push(fileRotateTransport);
}

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: transportsList.length > 0 ? transportsList : [new winston.transports.Console({ format: consoleFormat })],
});

// En desarrollo, también imprime en la consola con colores legibles (si no fue agregado ya)
if (env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}
