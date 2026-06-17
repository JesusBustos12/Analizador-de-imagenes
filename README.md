# SATI - Sistema Avanzado Táctico de Inteligencia (Full-Stack Portafolio)

## Descripción
SATI es una aplicación corporativa Full-Stack diseñada para analizar evidencia digital (imágenes) en búsqueda de amenazas para la seguridad pública, utilizando el modelo `gpt-4o-mini` de OpenAI y tecnologías de vanguardia para asegurar el rendimiento y la invulnerabilidad de la plataforma.

Construida con una arquitectura moderna utilizando **React 19, Vite y Tailwind CSS 4** en el frontend, respaldada por un servidor **Node.js y Express**. El proyecto cuenta con un diseño seguro y responsivo, compresión de archivos en el cliente, validación tipada estricta, y seguridad avanzada (tanto perimetral como interna) lista para su despliegue y uso corporativo.

## Objetivo
Como desarrollador, creé este proyecto para:

- Mostrar dominio en el desarrollo de aplicaciones seguras corporativas Full-Stack con **React, TypeScript y Node.js**.
- Integrar de forma segura y eficiente modelos de Inteligencia Artificial (OpenAI) para analizar y procesar imágenes.
- Diseñar interfaces ultrarrápidas y sanitizadas contra inyecciones XSS, reduciendo al máximo la latencia mediante compresión en el navegador.
- Implementar altos estándares de seguridad en el backend utilizando sesiones basadas en cookies **HttpOnly** para JWT, inyección de cabeceras seguras con **Helmet**, y mitigación de ataques de denegación de servicio (DDoS) o fuerza bruta mediante **Rate Limiting**.
- Construir una infraestructura sólida apoyada por bases de datos Serverless (TiDB Cloud) y validación rigurosa de entornos en tiempo de ejecución con Zod (mecanismo *Fail-Fast*).
- Establecer prácticas de ingeniería de software corporativas que incluyen documentación de APIs interactiva (Swagger) y un entorno extenso de pruebas automatizadas (Unitarias y E2E).

## Características
- **Análisis Táctico de Imágenes con IA**: Envío de evidencia minimizada mediante compresión en el cliente (Browser Image Compression) antes de ser evaluada de forma profunda por la API de OpenAI.
- **Seguridad Corporativa y Autenticación**: Sesiones robustas mediante JWT firmados y resguardados en HttpOnly cookies para prevenir ataques de extracción de tokens, emparejado con un sistema de ruteo con Guardias de Seguridad de navegación.
- **Validación Estricta (End-to-End)**: Utilización de Zod y React Hook Form en el cliente para prevenir renderizados innecesarios, complementado con validaciones estrictas de los datos de entrada y las variables de entorno en el servidor.
- **Arquitectura Escalable y Confiable**: Código estructurado y modular basado en Controladores, Rutas y Middlewares; respaldado de manera integral mediante pruebas unitarias (Vitest + JSDom) y de integración o End-to-End (Playwright).

## Tecnologías utilizadas
- **Frontend**: React 19, Vite, Tailwind CSS 4.
- **Backend**: Node.js + Express.
- **Base de Datos**: TiDB Cloud (MySQL Serverless), consultas implementadas usando `mysql2` con sentencias preparadas.
- **Seguridad**: JWT (HttpOnly Cookies), express-rate-limit, helmet, DOMPurify (sanitizador para inyecciones XSS).
- **Inteligencia Artificial**: OpenAI API (`gpt-4o-mini`).
- **Validación y Utilidades UI**: Zod, React Hook Form, Browser Image Compression.
- **Testing y Documentación**: Vitest, JSDom, Playwright, Swagger (API Docs).

## Estructura del proyecto
```
sati/
├── e2e/                      # Pruebas End-to-End automatizadas con Playwright
├── server/
│   ├── config/               # Configuración validada de variables de entorno (Zod)
│   ├── controllers/          # Lógica de negocio y manejo de peticiones
│   ├── middlewares/          # Filtros de autenticación, Rate Limiting y seguridad
│   ├── routes/               # Definición de rutas del API Backend
│   ├── schemas/              # Esquemas de validación Zod para las entradas
│   ├── services/             # Integración con IA externa y lógica complementaria
│   ├── db.ts                 # Conexión persistente y segura a TiDB Cloud
│   └── index.ts              # Punto de entrada de Express y documentación Swagger
├── src/
│   ├── components/           # Componentes UI reutilizables
│   ├── hooks/                # Hooks personalizados de React
│   ├── services/             # Utilidades y funciones de red (fetch al backend)
│   ├── types/                # Definiciones e interfaces de TypeScript
│   ├── App.tsx               # Orquestador principal y ruteo protegido
│   └── main.tsx              # Punto de entrada de la aplicación Vite
├── docker-compose.yml        # Orquestación de contenedores para la infraestructura
├── package.json              # Dependencias y scripts unificados
└── vercel.json               # Configuración de enrutamiento y despliegue Serverless
```

## Habilidades demostradas
Este proyecto refleja competencias de un desarrollador Full-Stack (Nivel Ssr) listo para aportar valor:

- **Arquitectura de Software Corporativo:** Implementación de patrones de diseño limpios, separando adecuadamente rutas, controladores, servicios y configuración en una aplicación integral.
- **Seguridad de Alto Nivel:** Dominio avanzado en el manejo de sesiones seguras y prevención activa de vulnerabilidades comunes (uso de HttpOnly Cookies, mitigación de abusos con Rate Limiting y sanitización agresiva de inputs/outputs).
- **Optimización de Rendimiento e IA:** Pre-procesamiento y compresión de archivos del lado del cliente para ahorrar ancho de banda, logrando un análisis contextual preciso y rápido integrando de manera responsable la API de OpenAI.
- **Calidad de Código y Pruebas Rigurosas:** Creación de aplicaciones altamente confiables, apoyadas en el principio "Fail-Fast", tipado estricto en ambas capas de la aplicación, y una cobertura amplia de pruebas en múltiples niveles.

## Notas para empleadores
Este es un proyecto orientado enteramente hacia la fiabilidad, seguridad y buenas prácticas del ámbito empresarial. Con él busqué demostrar que:

- Soy capaz de crear aplicaciones con una UI responsiva, ágil y limpia, pero que además cuenten con un nivel de diseño arquitectónico preparado para soportar exigencias de seguridad extremas (Helmet, prevención de XSS con DOMPurify, validación blindada con Zod).
- Comprendo a profundidad cómo proteger infraestructuras de backend. Conozco las mejores prácticas para manejar secretos, validarlos dinámicamente y salvaguardar el acceso a bases de datos alojadas en la nube.
- Puedo integrar y escalar flujos complejos de Inteligencia Artificial en producción, asumiendo la responsabilidad sobre el consumo y la latencia generada por las peticiones.
- Valoro la trazabilidad y la documentación, implementando entornos de pruebas desde el inicio y garantizando que otras partes (o miembros del equipo) puedan integrarse fácilmente gracias a herramientas como Swagger.

Estoy 100% listo para aportar valor real en un equipo como Full-Stack Developer. Busco mi primera oportunidad profesional y ¡me encantaría trabajar contigo!

## Contacto
- **GitHub:** github.com/JesusBustos12
- **LinkedIn:** linkedin.com/in/jesus-bustos-arizmendi-325329283
- **Correo:** jesusbustosarizmendi0@gmail.com

¡Gracias por revisar mi trabajo! 🚀
