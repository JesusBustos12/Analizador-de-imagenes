import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: { error: 'Demasiados intentos de inicio de sesión, por favor intente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 analysis requests per windowMs
  message: { error: 'Demasiadas imágenes analizadas. Espere un momento.' },
  standardHeaders: true,
  legacyHeaders: false,
});
