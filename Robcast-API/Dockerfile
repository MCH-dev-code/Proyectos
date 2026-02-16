# Base image
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar código
COPY src ./src

# Exponer puerto
EXPOSE 3001

# Comando para iniciar
CMD ["node", "src/server.js"]
