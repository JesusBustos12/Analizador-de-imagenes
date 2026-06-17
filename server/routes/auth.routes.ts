import { Router } from 'express';
import { register, login, updateProfile, logout, checkAuth } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/index.js';
import { loginRateLimiter } from '../middlewares/security.middleware.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente y cookie asignada
 *       400:
 *         description: Email ya en uso o validación fallida
 */
router.post('/register', validateRequest(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión iniciada
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginRateLimiter, validateRequest(loginSchema), login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión (Limpia Cookie)
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */
router.post('/logout', logout);

/**
 * @openapi
 * /auth/profile:
 *   put:
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     summary: Actualizar perfil de usuario
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       401:
 *         description: No autorizado
 */
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);

/**
 * @openapi
 * /auth/check:
 *   get:
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     summary: Verificar sesión activa
 *     responses:
 *       200:
 *         description: Retorna el usuario autenticado
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/check', authenticateToken, checkAuth);

export default router;
