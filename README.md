# SATI - Sistema Avanzado Táctico de Inteligencia

## Descripción
SATI es una plataforma Full-Stack orientada al análisis táctico de evidencia digital mediante Inteligencia Artificial. Diseñada bajo rigurosos estándares de seguridad y rendimiento, la aplicación utiliza el modelo `gpt-4o-mini` de OpenAI para escanear e identificar amenazas potenciales en imágenes, facilitando la toma de decisiones en entornos de seguridad pública.

La arquitectura del sistema está construida sobre tecnologías modernas y Serverless, garantizando escalabilidad, resiliencia y una protección perimetral e interna de nivel corporativo.

## Características Principales
- **Análisis Táctico Automatizado:** Procesamiento avanzado de imágenes con modelos de IA para detección de armas, sustancias y amenazas, optimizado mediante compresión asíncrona en el cliente previa a la transmisión.
- **Seguridad y Control de Sesiones:** Sistema de autenticación robusto basado en JSON Web Tokens (JWT) firmados y encapsulados exclusivamente en cookies **HttpOnly**, mitigando vectores de ataque de extracción de tokens vía XSS.
- **Rate Limiting y Prevención de Abusos:** Protección activa contra ataques de fuerza bruta y denegación de servicio (DDoS) a nivel de red, emparejado con transacciones atómicas a nivel de base de datos para prevenir vulnerabilidades de Condición de Carrera (Race Conditions) en las cuotas de uso.
- **Validación Tipada Estricta (End-to-End):** Implementación integral de Zod (mecanismo *Fail-Fast*) para la validación estricta de contratos de datos, payloads de red y variables de entorno, garantizando un flujo de datos sanitizado.
- **Infraestructura Cloud-Native:** Backend optimizado para despliegues Serverless y conectado de forma segura a una base de datos distribuida en la nube (TiDB Cloud).
- **Interfaz Inmersiva:** UI táctica responsiva construida con Tailwind CSS 4 y Framer Motion, incluyendo transiciones fluidas y una experiencia de usuario (UX) pulida.

## Stack Tecnológico
- **Frontend:** React 19, Vite, Tailwind CSS 4, Framer Motion.
- **Backend:** Node.js, Express, TypeScript.
- **Base de Datos:** TiDB Cloud (MySQL distribuido), operado a través de `mysql2` utilizando *prepared statements* para evitar inyecciones SQL.
- **Seguridad Integral:** `helmet`, `express-rate-limit`, `DOMPurify` (sanitizador XSS), `bcrypt`.
- **Inteligencia Artificial:** OpenAI API (`gpt-4o-mini`).
- **Validación y Manejo de Estado:** Zod, React Hook Form, Browser Image Compression.
- **Testing y Documentación:** Vitest, Playwright, Swagger UI para documentación interactiva de APIs.

## Estructura del Proyecto
```
sati/
├── e2e/                      # Pruebas End-to-End automatizadas con Playwright
├── server/
│   ├── config/               # Configuración centralizada y validada (Zod)
│   ├── controllers/          # Lógica de negocio y manejo transaccional
│   ├── middlewares/          # Autenticación, Rate Limiting y seguridad HTTP
│   ├── routes/               # Enrutamiento modular del API REST
│   ├── schemas/              # Esquemas de validación Zod (Input/Output)
│   ├── services/             # Integración con IA externa y lógica complementaria
│   ├── db.ts                 # Conexión persistente y segura a TiDB Cloud
│   └── index.ts              # Punto de entrada y configuración de Express/Swagger
├── src/
│   ├── components/           # Componentes UI reutilizables y modulares
│   ├── hooks/                # Custom hooks (Gestión de sesiones, análisis, etc.)
│   ├── services/             # Abstracción de llamadas de red (API client)
│   ├── types/                # Definiciones e interfaces TypeScript
│   ├── App.tsx               # Orquestador principal y ruteo protegido
│   └── main.tsx              # Punto de entrada de la aplicación React
├── docker-compose.yml        # Orquestación de infraestructura local
├── package.json              # Dependencias y scripts del monorepo
└── vercel.json               # Configuración de despliegue Serverless (Proxies, Headers)
```

## Arquitectura y Decisiones de Diseño
- **Single Source of Truth Transaccional:** Las validaciones críticas de cuotas de uso y límites de tiempo se delegan directamente al motor de la base de datos utilizando `CURRENT_DATE()` y sentencias condicionales SQL. Esto elimina por completo discrepancias de zona horaria entre los nodos de cómputo y el clúster de base de datos.
- **Optimización de Payload (Edge Computing):** La infraestructura incluye compresión agresiva en el navegador, reduciendo drásticamente el consumo de ancho de banda y la latencia en el procesamiento de modelos de lenguaje visual (VLM).
- **Arquitectura basada en Middlewares:** Implementación de un flujo de control seguro donde ninguna petición alcanza la lógica de negocio sin haber pasado por capas de validación de esquemas, verificación de sesión y rate limiting.

## Instalación y Configuración Local
1. Clonar el repositorio.
2. Instalar dependencias mediante `npm install`.
3. Configurar el archivo `.env.local` basado en el `.env.example` proporcionado (requiere llaves de OpenAI y cadena de conexión a TiDB).
4. Ejecutar el entorno de desarrollo con `npm run dev`.

## Contacto
- **GitHub:** [JesusBustos12](https://github.com/JesusBustos12)
- **LinkedIn:** [Jesús Bustos Arizmendi](https://linkedin.com/in/jesus-bustos-arizmendi-325329283)
- **Correo:** jesusbustosarizmendi0@gmail.com
