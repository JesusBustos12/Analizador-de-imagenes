import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Ahora leemos el token de las cookies HttpOnly
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No hay sesión activa.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // attach user payload
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Sesión inválida o expirada.' });
  }
};
