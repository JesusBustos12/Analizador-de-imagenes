import { Router } from 'express';
import { analyzeImage } from '../controllers/analyze.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { analyzeSchema } from '../schemas';
import { analyzeRateLimiter } from '../middlewares/security.middleware';

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
