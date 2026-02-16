# 🚀 Robcast E-commerce - Guía de Deploy con Docker en Rocky Linux 8

## Estructura del Proyecto

```
Proyectos/
├── docker-compose.yml          # Orquestación de contenedores
├── Robcast/                    # Frontend React + Vite
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ... (resto de archivos React)
├── Robcast-API/                # Backend Node.js/Express
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── package.json
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   └── .env.example
└── Robcast-panel/
    └── setup_database.sql      # Script de base de datos
```

## 1. Instalación en Rocky Linux 8

### Prerrequisitos

```bash
# Actualizar sistema
sudo dnf update -y

# Instalar Docker
sudo dnf install -y docker

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario actual al grupo docker (para no usar sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### Verificar instalación

```bash
docker --version
docker-compose --version
```

## 2. Preparar el Proyecto

### Clonar o descargar el proyecto

```bash
cd /home/usuario
git clone <tu-repo> Proyectos
cd Proyectos
```

### Configurar variables de entorno

```bash
cd Robcast-API

# Crear archivo .env desde el ejemplo
cp .env.example .env

# Editar el .env con tus valores (opcional, los valores por defecto están bien)
nano .env
```

**Contenido del .env:**
```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=robcast_user
DB_PASSWORD=robcast_password_123
DB_NAME=robcast_db

JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion

API_PORT=3001
NODE_ENV=production

FRONTEND_URL=http://localhost
```

### Volver a la raíz del proyecto

```bash
cd ..
```

## 3. Levantar los Servicios con Docker Compose

### Construir las imágenes

```bash
docker-compose build
```

### Iniciar los servicios

```bash
# En primer plano (para ver logs)
docker-compose up

# O en segundo plano (con -d)
docker-compose up -d
```

### Esperar a que los servicios estén listos

```bash
# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f api
docker-compose logs -f mysql
docker-compose logs -f frontend
```

## 4. Verificar que todo funciona

### Base de datos

```bash
# Acceder a MySQL
docker exec -it robcast-mysql mysql -u robcast_user -p robcast_db

# Dentro de MySQL:
SHOW TABLES;
SELECT * FROM productos;
EXIT;
```

### API

```bash
# En otra terminal
curl http://localhost:3001/api/health

# Debería retornar:
# {"status":"API Robcast funcionando ✅"}
```

### Frontend

```bash
# Abrir en navegador
http://localhost
```

## 5. Monitoreo y Mantenimiento

### Ver logs en tiempo real

```bash
docker-compose logs -f
```

### Reiniciar servicios

```bash
# Reiniciar todos
docker-compose restart

# Reiniciar uno específico
docker-compose restart api
docker-compose restart mysql
docker-compose restart frontend
```

### Detener servicios

```bash
docker-compose down
```

### Detener y eliminar volúmenes (CUIDADO: elimina datos!)

```bash
docker-compose down -v
```

## 6. Configuración de Nginx en Producción

El archivo `Robcast/nginx.conf` incluye:
- Proxy hacia la API backend
- Compresión gzip para assets
- Cache de archivos estáticos
- SPA routing (index.html para todas las rutas)

Para cambiar el servidor:

```bash
# Editar nginx.conf
nano Robcast/nginx.conf

# Reconstruir el contenedor
docker-compose up -d --build frontend
```

## 7. Variables de Entorno Importantes

### Frontend (`Robcast/nginx.conf`)
- `VITE_API_URL`: URL de la API (por defecto `http://localhost:3001`)

### Backend (`.env`)
- `JWT_SECRET`: Cambiar a un valor aleatorio fuerte en producción
- `NODE_ENV`: `production` para desactivar logs verbosos
- `FRONTEND_URL`: URL del frontend para CORS

### Base de Datos (`docker-compose.yml`)
- `MYSQL_ROOT_PASSWORD`: Contraseña del usuario root
- `MYSQL_PASSWORD`: Contraseña del usuario robcast_user

## 8. Casos de Uso Comunes

### Restaurar backup de BD

```bash
# Obtener dump
docker exec robcast-mysql mysqldump -u robcast_user -p robcast_db > backup.sql

# Restaurar
docker exec -i robcast-mysql mysql -u robcast_user -p robcast_db < backup.sql
```

### Editar la BD mientras corre

```bash
docker exec -it robcast-mysql mysql -u robcast_user -p robcast_db
```

### Ver el espacio usado

```bash
docker system df
```

### Limpiar imágenes y contenedores no usados

```bash
docker system prune -a
```

## 9. Solución de Problemas

### Puerto en uso

```bash
# Si el puerto 80, 3306 o 3001 está en uso:
# Cambiar en docker-compose.yml, ejemplo:
# ports:
#   - "8080:80"  # Cambiar 80 → 8080

docker-compose down
docker-compose up -d --build
```

### Conexión a BD fallida

```bash
# Verificar que MySQL está corriendo
docker ps | grep mysql

# Ver logs de MySQL
docker-compose logs mysql

# Esperar entre 10-15 segundos tras iniciar
```

### API no responde

```bash
# Verificar logs de API
docker-compose logs api

# Reiniciar API
docker-compose restart api
```

### Frontend no carga

```bash
# Limpiar caché del navegador (Ctrl+Shift+Del)
# O forzar reconstruir
docker-compose down
docker-compose up -d --build frontend
```

## 10. URLs en Producción

Una vez que todo está funcionando:

- **Frontend**: `http://tu-servidor-ip`
- **API**: `http://tu-servidor-ip/api` (proxied por Nginx)
- **Base de datos**: `localhost:3306` (solo accesible localmente)

## 11. Configuración de Dominio

### Si quieres usar un dominio en lugar de IP

1. Apuntar el DNS a tu servidor
2. Editar `Robcast/nginx.conf`:
   ```nginx
   server_name tu-dominio.com www.tu-dominio.com;
   ```
3. Opcionalmente agregar SSL with Let's Encrypt:
   ```bash
   sudo dnf install certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d tu-dominio.com
   ```
4. Actualizar el docker-compose.yml con los certificados

## 12. Deploy Automático (Opcional)

Para actualizar automáticamente cuando haya cambios:

```bash
# En la carpeta del proyecto
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Con webhook de GitHub:

1. En GitHub: Settings → Webhooks → Add webhook
2. Payload URL: `http://tu-servidor:9000/payload`
3. En el servidor, usar `webhooks` para auto-deploy

---

## Resumen Rápido

```bash
# 1. Instalar dependencias
sudo dnf install -y docker docker-compose

# 2. Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# 3. Navegar al proyecto
cd /home/usuario/Proyectos

# 4. Construir y levantar
docker-compose build
docker-compose up -d

# 5. Verificar
curl http://localhost/api/health
# Abrir navegador: http://localhost
```

## Soporte

- **Logs**: `docker-compose logs -f`
- **Ejecutar comando en contenedor**: `docker exec -it <contenedor> <comando>`
- **Acceder al contenedor**: `docker exec -it <contenedor> /bin/sh`

¡Listo! Tu aplicación Robcast está corriendo en Docker 🎉
