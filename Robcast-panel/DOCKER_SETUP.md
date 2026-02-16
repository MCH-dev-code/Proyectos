# Configuración de Docker para Robcast Panel

## Requisitos Previos

- **Docker**: [Descargar](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Incluido en Docker Desktop

## Estructura Creada

```
Robcast-panel/
├── Dockerfile.frontend          # Imagen del frontend (React/Vite)
├── Dockerfile.backend           # Imagen del backend (Express)
├── docker-compose.yml           # Orquestación de servicios
├── .dockerignore                # Archivos a ignorar en Docker
└── .env.example                 # Variables de entorno de ejemplo
```

## Pasos de Configuración

### 1. Crear archivo de variables de entorno

```bash
cp .env.example .env
```

Edita `.env` según tus necesidades (contraseñas, puertos, etc.)

### 2. Construir las imágenes y levantar los contenedores

```bash
# Opción A: Construir y levantar en segundo plano
docker-compose up -d

# Opción B: Construir y levantar con salida visible
docker-compose up

# Opción C: Reconstruir desde cero
docker-compose up --build -d
```

### 3. Verificar el estado de los servicios

```bash
docker-compose ps
```

Deberías ver:
- `robcast_mysql` - ✓ Running
- `robcast_backend` - ✓ Running
- `robcast_frontend` - ✓ Running

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Base de datos**: localhost:3306

## Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Detener los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker-compose down -v

# Ejecutar comandos dentro de un contenedor
docker-compose exec backend npm install
docker-compose exec mysql mysql -u root -p

# Reconstruir una imagen específica
docker-compose build backend
docker-compose build frontend

# Actualizar y reiniciar un servicio
docker-compose up -d --build backend
```

## Estructura de Servicios

### MySQL (Puerto 3306)
- Usuario: `robcast_user`
- Contraseña: `robcast_pass` (configurable en `.env`)
- Base de datos: `robcast_db`
- El archivo `setup_database.sql` se ejecuta automáticamente

### Backend (Puerto 3001)
- API Express
- Conecta a MySQL automáticamente
- Variables de entorno configuradas desde `docker-compose.yml`

### Frontend (Puerto 5173)
- React + Vite
- Construido en production mode
- Servido con `serve`

## Solución de Problemas

### Puerto ya en uso
```bash
# Cambiar puertos en docker-compose.yml o .env
# Por ejemplo: "8080:5173" en lugar de "5173:5173"
```

### Base de datos no se conecta
```bash
# Verificar conexión
docker-compose exec backend npm start

# Verificar logs de MySQL
docker-compose logs mysql
```

### Cambios en código no se reflejan
```bash
# Frontend necesita reconstrucción
docker-compose up --build -d frontend

# Backend necesita reconstrucción
docker-compose up --build -d backend
```

### Limpiar todo y empezar de nuevo
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build -d
```

## Notas de Seguridad

⚠️ **IMPORTANTE**: Los valores en `.env.example` son valores por defecto.
- Cambiar contraseñas en producción
- No versionar el archivo `.env` en Git
- Usar variables de entorno seguras en producción

## Configuración para Producción

Para producción, considera:

1. **Cambiar contraseñas** - Usar valores seguros en `.env`
2. **Usar mínimo 2 réplicas** - Agregar replicas en servicios
3. **Volúmenes persistentes** - Backup regular de datos
4. **SSL/TLS** - Usar reverse proxy (nginx)
5. **Limites de recursos** - Agregar limits y requests en compose

Ejemplo con nginx (opcional para producción):
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
```

