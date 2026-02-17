# 🚀 Instrucciones de Deployment - Rocky Linux 8

## 📋 Requisitos previos

- Rocky Linux 8 instalado
- Acceso SSH como root o usuario con sudo
- Dominio: `Tienda.robcast.com.do` (registrado y apuntando al servidor)
- Subdominios DNS configurados:
  - `Tienda.robcast.com.do` → IP del servidor
  - `api.Tienda.robcast.com.do` → IP del servidor
  - `admin.Tienda.robcast.com.do` → IP del servidor

---

## 📝 PASO 1: Preparar el servidor

Conecta por SSH:
```bash
ssh root@tu_ip_del_servidor
```

o

```bash
ssh usuario@tu_ip_del_servidor
```

---

## ⬇️ PASO 2: Descargar y ejecutar el script

**Opción A: Descargar directamente desde GitHub**
```bash
curl -O https://raw.githubusercontent.com/MCH-dev-code/Proyectos/main/setup-servidor.sh
chmod +x setup-servidor.sh
./setup-servidor.sh
```

**Opción B: Copiar manualmente**
1. Copia el contenido de `setup-servidor.sh`
2. En el servidor, crea: `nano setup-servidor.sh`
3. Pega el contenido
4. Presiona Ctrl+X, luego Y, Enter
5. Ejecuta: `chmod +x setup-servidor.sh && ./setup-servidor.sh`

---

## 🔒 PASO 3: Obtener certificado SSL (Certbot)

Cuando el script termine, ejecuta:
```bash
sudo certbot -d Tienda.robcast.com.do -d api.Tienda.robcast.com.do -d admin.Tienda.robcast.com.do
```

Certbot te pedirá:
- Email de contacto
- Aceptar términos
- Si compartir email con EFF

Selecciona:
```
2: Redirect - Make all requests redirect to secure HTTPS version
```

---

## ⚙️ PASO 4: Configurar variables de entorno

El script crea archivos `.env` básicos. Edítales:

```bash
cd /opt/robcast

# Editar API
sudo nano Robcast-API/.env
```

Actualiza:
```env
PORT=3000
NODE_ENV=production
DB_HOST=db
DB_USER=robcast_user
DB_PASSWORD=TU_PASSWORD_SEGURO_AQUI  # Cambiar esto
DB_NAME=robcast_db
DB_PORT=3306
CORS_ORIGIN=https://Tienda.robcast.com.do
JWT_SECRET=TU_JWT_SECRET_SUPER_SEGURO  # Cambiar esto
```

```bash
# Editar Panel
sudo nano Robcast-panel/.env
```

```env
VITE_API_URL=https://api.Tienda.robcast.com.do
VITE_APP_NAME=Robcast Panel
ENV=production
```

---

## 🐳 PASO 5: Revisar docker-compose.yml

**IMPORTANTE:** Revisa que el `docker-compose.yml` en la raíz tenga:
- Puerto correcto para MySQL (si necesita cambiar)
- Volúmenes correctamente configurados
- Variables de entorno correctas

```bash
cat /opt/robcast/docker-compose.yml
```

Si necesitas cambios:
```bash
nano /opt/robcast/docker-compose.yml
```

---

## 🚀 PASO 6: Levantar los servicios

```bash
cd /opt/robcast

# Builds e inicia todos los servicios
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f
```

Espera 20-30 segundos para que los servicios se inicien.

---

## ✅ PASO 7: Verificar que todo funciona

```bash
# Ver todos los contenedores corriendo
docker ps

# Ver logs específicos
docker-compose logs robcast_api      # API
docker-compose logs robcast_frontend # Frontend
docker-compose logs robcast_panel    # Panel
docker-compose logs db               # Base de datos

# Probar acceso desde el servidor
curl https://Tienda.robcast.com.do
curl https://api.Tienda.robcast.com.do
curl https://admin.Tienda.robcast.com.do
```

---

## 🌐 Acceso desde navegador

Una vez que todo está corriendo:

- **Tienda**: https://Tienda.robcast.com.do
- **API**: https://api.Tienda.robcast.com.do/health
- **Panel Admin**: https://admin.Tienda.robcast.com.do

---

## 🛠️ Comandos útiles después del setup

```bash
cd /opt/robcast

# Ver estado de servicios
docker-compose ps

# Reiniciar un servicio específico
docker-compose restart robcast_api

# Reiniciar todo
docker-compose restart

# Detener servicios
docker-compose down

# Bajar servicios y limpiar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Actualizar código (si haces cambios en GitHub)
git pull
docker-compose up -d --build

# Ver logs completos
docker-compose logs robcast_api | tail -100

# Acceder a un contenedor
docker exec -it robcast-api bash
docker exec -it robcast-db mysql -u robcast_user -p
```

---

## 📊 Estructura final de carpetas

```
/opt/robcast/
├── Robcast/                 # Frontend
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── Robcast-API/             # Backend
│   ├── src/
│   ├── .env                 # Editar con credenciales
│   ├── package.json
│   └── Dockerfile
├── Robcast-panel/           # Panel Admin
│   ├── src/
│   ├── backend/
│   ├── .env                 # Editar URLs
│   └── Dockerfile*
├── docker-compose.yml       # Orquestación
└── datos/
    └── mysql/               # Base de datos (persistente)
```

---

## 🔐 Nginx - Reverse Proxy

Nginx está configurado en:
```bash
/etc/nginx/conf.d/robcast.conf
```

Redirige:
- Puerto 80 → 443 (HTTP → HTTPS)
- `Tienda.robcast.com.do` → Frontend (puerto 5173)
- `api.Tienda.robcast.com.do` → API (puerto 3000)
- `admin.Tienda.robcast.com.do` → Panel (puerto 5174)

Todos con SSL (Certbot).

---

## ⚠️ Troubleshooting

**Error: "Cannot connect to Docker daemon"**
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
```

**Error: Puerto ya en uso**
```bash
# Ver puertos en uso
sudo lsof -i :3000
sudo lsof -i :5173

# Matar proceso
sudo kill -9 <PID>
```

**Error: Nginx no inicia**
```bash
# Verificar sintaxis
sudo nginx -t

# Ver errores
sudo systemctl status nginx
sudo journalctl -xe
```

**Error: SSL certificado no se genera**
```bash
# Verificar DNS
nslookup Tienda.robcast.com.do

# Ver logs de Certbot
sudo certbot renew --dry-run -v
```

**Base de datos no conecta**
```bash
# Revisar logs
docker-compose logs db

# Reintentar conexión
docker exec -it robcast-db mysql -h 127.0.0.1 -u robcast_user -p -e "SELECT 1;"
```

---

## 🔄 Renovación automática de SSL

El script configura renovación automática. Verifica:
```bash
# Ver estado de renovación
sudo certbot renew --dry-run

# Cron automático (lista)
sudo systemctl enable certbot-renew.timer
```

---

## 📞 Soporte

Si hay errores, proporciona:
```bash
# Colectar información
docker-compose ps
docker-compose logs --tail=50
sudo systemctl status nginx
sudo firewall-cmd --list-all
```

---

**El deployment está completo. Tu aplicación ya debería estar disponible en las URLs asignadas.** 🎉
