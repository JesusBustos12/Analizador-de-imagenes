import { Response, NextFunction } from 'express';
import { ResultSetHeader } from 'mysql2';
import { analyzeImageWithOpenAI } from '../services/openai.service.js';
import { logger } from '../config/logger.js';
import db from '../db.js';
import { AuthRequest } from '../types/index.js';

export const analyzeImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id || 'anonymous';
  try {
    const { base64Data, mimeType } = req.body;

    logger.info(`Solicitud de análisis de imagen iniciada. (Tipo: ${mimeType}, Usuario: ${userId})`);

    let result;

    if (userId !== 'anonymous') {
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        const [updateResult] = await connection.execute<ResultSetHeader>(
          `UPDATE users 
           SET daily_analyses_count = IF(last_analysis_date = CURRENT_DATE(), daily_analyses_count + 1, 1),
               last_analysis_date = CURRENT_DATE()
           WHERE id = ? AND (last_analysis_date != CURRENT_DATE() OR last_analysis_date IS NULL OR daily_analyses_count < 5)`,
          [userId]
        );

        if (updateResult.affectedRows === 0) {
          await connection.rollback();
          connection.release();
          logger.warn(`Intento de evadir límite diario bloqueado para el usuario ${userId}`);
          return res.status(429).json({ error: 'Has alcanzado el límite estricto de 5 análisis. Intenta nuevamente mañana.' });
        }

        // Realizamos el análisis mientras la transacción está abierta
        result = await analyzeImageWithOpenAI(base64Data, mimeType);
        
        await connection.commit();
        connection.release();
      } catch (err: any) {
        await connection.rollback();
        connection.release();
        throw err;
      }
    } else {
      result = await analyzeImageWithOpenAI(base64Data, mimeType);
    }
    
    logger.info(`Análisis de imagen completado exitosamente. (Usuario: ${userId}, Nivel Amenaza: ${result.threatLevel})`);
    res.json(result);
  } catch (error: any) {
    logger.error(`Error durante el análisis de imagen: ${error.message}`);
    next(error);
  }
};
