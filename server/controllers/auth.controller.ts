import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { logger } from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

// Opciones seguras para las cookies
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const [existingUsers]: any = await db.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUsers.length > 0) {
      logger.warn(`Registro fallido: Email ya en uso (${email})`);
      return res.status(400).json({ error: 'El email ya está en uso' });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const id = Math.random().toString(36).substring(2, 11);

    await db.execute(
      'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
      [id, name, email, hash]
    );

    // No seteamos cookie de sesión aquí para forzar login manual según los requerimientos
    logger.info(`Nuevo usuario registrado exitosamente: ${email}. Esperando login manual.`);
    res.json({ success: true, message: 'Registro exitoso' });
  } catch (err: any) {
    logger.error(`Error durante el registro de usuario: ${err.message}`);
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const [users]: any = await db.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (users.length === 0) {
      logger.warn(`Intento de login fallido (Usuario no existe): ${email}`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      logger.warn(`Intento de login fallido (Contraseña incorrecta): ${email}`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    let count = user.daily_analyses_count || 0;
    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.last_analysis_date ? new Date(user.last_analysis_date).toISOString().split('T')[0] : null;
    if (lastDate !== today) count = 0;

    const payload = { id: user.id, name: user.name, email: user.email, daily_analyses_count: count };
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, cookieOptions);
    logger.info(`Usuario inició sesión exitosamente: ${email}`);
    res.json({ success: true, user: payload });
  } catch (err: any) {
    logger.error(`Error durante login: ${err.message}`);
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { name, email, password } = req.body;
    
    const [currentUsers]: any = await db.execute(
      'SELECT email FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (currentUsers.length === 0) {
      logger.warn(`Intento de actualización de perfil en usuario inexistente: ${userId}`);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const currentUser = currentUsers[0];

    if (email && email !== currentUser.email) {
      const [existingUsers]: any = await db.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email]
      );

      if (existingUsers.length > 0) {
        logger.warn(`Actualización de perfil fallida, email ya en uso: ${email}`);
        return res.status(400).json({ error: 'El nuevo correo ya está en uso' });
      }
    }

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await db.execute(
        'UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?',
        [name, email, hash, userId]
      );
    } else {
      await db.execute(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, userId]
      );
    }

    const updatedPayload = { id: userId, name, email };
    const newToken = jwt.sign(updatedPayload, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', newToken, cookieOptions);
    logger.info(`Perfil actualizado exitosamente: ${email}`);
    res.json({ success: true, user: updatedPayload });
  } catch (err: any) {
    logger.error(`Error actualizando perfil: ${err.message}`);
    next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('token');
  logger.info(`Sesión cerrada (Logout)`);
  res.json({ success: true });
};

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const [rows]: any = await db.execute(
      'SELECT daily_analyses_count, last_analysis_date FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (rows.length > 0) {
      let { daily_analyses_count, last_analysis_date } = rows[0];
      const today = new Date().toISOString().split('T')[0];
      const lastDate = last_analysis_date ? new Date(last_analysis_date).toISOString().split('T')[0] : null;
      if (lastDate !== today) {
        daily_analyses_count = 0;
      }
      return res.json({ success: true, user: { ...(req as any).user, daily_analyses_count } });
    }
    
    res.json({ success: true, user: (req as any).user });
  } catch (err) {
    next(err);
  }
};
