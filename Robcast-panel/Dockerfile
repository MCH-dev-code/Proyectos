# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
