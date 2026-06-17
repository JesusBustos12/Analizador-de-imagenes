import { Request, Response, NextFunction } from 'express';
import { analyzeImageWithOpenAI } from '../services/openai.service.js';
import { logger } from '../config/logger.js';
import db from '../db.js';

export const analyzeImage = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.id || 'anonymous';
  try {
    const { base64Data, mimeType } = req.body;

    logger.info(`Solicitud de análisis de imagen iniciada. (Tipo: ${mimeType}, Usuario: ${userId})`);

    // Validación de límites diarios con actualización ATÓMICA para prevenir vulnerabilidades de Condición de Carrera (Race Conditions)
    if (userId !== 'anonymous') {
      const [updateResult]: any = await db.execute(
        `UPDATE users 
         SET daily_analyses_count = IF(last_analysis_date = CURRENT_DATE(), daily_analyses_count + 1, 1),
             last_analysis_date = CURRENT_DATE()
         WHERE id = ? AND (last_analysis_date != CURRENT_DATE() OR last_analysis_date IS NULL OR daily_analyses_count < 5)`,
        [userId]
      );

      // Si affectedRows es 0, significa que la cláusula WHERE falló (el usuario ya tiene 5 y es el mismo día)
      if (updateResult.affectedRows === 0) {
        logger.warn(`Intento de evadir límite diario bloqueado para el usuario ${userId}`);
        return res.status(429).json({ error: 'Has alcanzado el límite estricto de 5 análisis. Intenta nuevamente mañana.' });
      }
    }

    const result = await analyzeImageWithOpenAI(base64Data, mimeType);
    
    logger.info(`Análisis de imagen completado exitosamente. (Usuario: ${userId}, Nivel Amenaza: ${result.threatLevel})`);
    res.json(result);
  } catch (error: any) {
    // Si hubo un error en OpenAI o en el proceso, "reembolsamos" el token al usuario de manera atómica
    if (userId !== 'anonymous') {
      await db.execute(
        `UPDATE users SET daily_analyses_count = GREATEST(0, daily_analyses_count - 1) WHERE id = ? AND last_analysis_date = CURRENT_DATE()`,
        [userId]
      ).catch(err => logger.error(`Error al reembolsar token al usuario ${userId}: ${err.message}`));
    }
    
    logger.error(`Error durante el análisis de imagen: ${error.message}`);
    next(error);
  }
};
