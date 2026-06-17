import { Router } from 'express';
import { analyzeImage } from '../controllers/analyze.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { analyzeSchema } from '../schemas/index.js';
import { analyzeRateLimiter } from '../middlewares/security.middleware.js';

const router = Router();

/**
 * @openapi
 * /analyze:
 *   post:
 *     tags: [Analyze]
 *     security:
 *       - cookieAuth: []
 *     summary: Analizar imagen con IA para detección de amenazas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 data URL de la imagen (e.g. data:image/jpeg;base64,...)
 *     responses:
 *       200:
 *         description: Reporte de análisis de la IA
 *       401:
 *         description: No autorizado
 *       429:
 *         description: Demasiadas solicitudes (Rate Limit excedido)
 */
router.post('/', authenticateToken, analyzeRateLimiter, validateRequest(analyzeSchema), analyzeImage);

export default router;
