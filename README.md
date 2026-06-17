# SATI - Sistema Avanzado Táctico de Inteligencia

SATI es una aplicación corporativa Full-Stack diseñada para analizar evidencia digital (imágenes) en búsqueda de amenazas para la seguridad pública, utilizando el modelo `gpt-5-mini` de OpenAI y tecnologías de vanguardia para asegurar el rendimiento y la invulnerabilidad de la plataforma.

## 🚀 Tecnologías Destacadas

### Frontend (Cliente Seguro)
- **React 19 + Vite**: Interfaz ultrarrápida.
- **Tailwind CSS 4**: Diseño estilizado y responsivo, sin frameworks acoplados pesados.
- **Zod + React Hook Form**: Validación robusta, tipada y sin renderizados innecesarios.
- **React Router DOM**: Ruteo con Guardias de Seguridad de navegación.
- **Browser Image Compression**: Minimización extrema de red al comprimir evidencia localmente antes de enviarla.
- **DOMPurify**: Sanitizador de inyecciones XSS para las respuestas de IA.

### Backend (SATI Secure API)
- **Node.js + Express**: Arquitectura estructurada en Rutas, Controladores y Middlewares.
- **TiDB Cloud (MySQL)**: Base de datos Serverless robusta mediante `mysql2` con sentencias preparadas.
- **Seguridad Perimetral**:
  - `Helmet` para inyección de headers seguros y prevención de clics no deseados.
  - `Express Rate Limit` para mitigación de ataques DDoS o Fuerza Bruta a los endpoints de análisis o Login.
- **Autenticación (HttpOnly Cookies)**: Sesiones basadas en JWT (JSON Web Tokens) fuertemente firmados. El token viaja en galletas restringidas al lado del servidor (HttpOnly), protegiéndolo de ataques de extracción.
- **Variables de Entorno Tipadas (Zod)**: Configuración validada en tiempo de ejecución (`config/env.ts`), garantizando el mecanismo *Fail-Fast* en producción.

## 📦 Documentación de API
Este proyecto utiliza **Swagger** para facilitar una documentación interactiva de la API Backend.
Una vez levantado el entorno, puedes acceder a la consola interactiva mediante:
```
http://localhost:3001/api-docs
```

## ⚙️ Instalación y Levantamiento Local

### Requisitos
- Node.js (v18+)
- NPM
- Cuenta en OpenAI y TiDB Cloud.

### Pasos

1. Instalar dependencias:
```bash
npm install
```

2. Configurar el Entorno:
Modifica tu `.env.local` e introduce tus llaves reales:
```env
OPENAI_API_KEY="tu-llave"
DATABASE_URL="mysql://.../sati_db?ssl=true"
JWT_SECRET="sati-secure-backend-jwt-super-secret-key-2026"
```

3. Iniciar el Entorno de Desarrollo Simultáneo:
```bash
npm run dev
```
*(El servidor de desarrollo correrá automáticamente tanto el Frontend en el puerto 3000 como el Backend en el puerto 3001).*

## 🧪 Pruebas
SATI implementa una base sólida de pruebas para ambientes corporativos:
```bash
# Ejecutar pruebas Unitarias (Vitest + JSDom)
npm run test

# Ejecutar pruebas E2E (Playwright)
npm run test:e2e
```
