# Etapa 1: Construcción (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos primero package.json para aprovechar el caché de Docker
COPY package*.json ./

# Instalamos TODAS las dependencias (necesarias para el build de Vite)
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# Compilamos el frontend (React/Vite)
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Copiamos package.json
COPY package*.json ./

# Instalamos SOLO dependencias de producción para mantener la imagen ligera
RUN npm ci --omit=dev --legacy-peer-deps

# Copiamos los archivos estáticos compilados del frontend
COPY --from=builder /app/dist ./dist

# Copiamos el código fuente del backend (Express/TS)
COPY server ./server

# Necesitamos compilar TypeScript en backend o usar tsx en producción.
# Instalamos tsx globalmente para correr el backend directamente (o localmente ya está en node_modules)
RUN npm install -g tsx

# Exponemos el puerto del backend
EXPOSE 3001

# Comando de inicio
CMD ["npm", "run", "start"]
