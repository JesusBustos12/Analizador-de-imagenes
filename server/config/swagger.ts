import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SATI Secure Backend API',
      version: '1.0.0',
      description: 'API del Sistema Avanzado Táctico de Inteligencia para análisis de imágenes de seguridad con IA.',
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor API Local',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  // Document endpoints in these files
  apis: ['./server/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('✅ Swagger Docs running at /api-docs');
};
