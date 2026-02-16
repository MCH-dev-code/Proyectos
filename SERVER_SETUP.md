# Setup Inicial en Servidor Rocky Linux 8

## 📋 Paso a Paso

### 1. Conectarse al servidor

```bash
ssh usuario@IP_SERVIDOR

# Cambiar a root si necesario
sudo su -
```

### 2. Instalar dependencias

```bash
# Actualizar sistema
yum update -y

# Instalar Docker
yum install docker -y
systemctl start docker
systemctl enable docker
usermod -aG docker $USER

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
docker-compose --version

# Instalar Git
yum install git -y

# Instalar utilidades
yum install nano htop -y
```

### 3. Crear estructura de carpetas

```bash
# Crear directorio para el proyecto
mkdir -p /opt/robcast
cd /opt/robcast

# Asignar permisos
chown -R $USER:$USER /opt/robcast
chmod 755 /opt/robcast
```

### 4. Clonar repositorio

```bash
cd /opt/robcast

# Con HTTPS
git clone https://github.com/TU_USUARIO/robcast.git .

# O con SSH (si lo tienes configurado)
git clone git@github.com:TU_USUARIO/robcast.git .

# Ver que está todo
ls -la
```

### 5. Configurar variables de entorno

```bash
# Crear archivo .env con valores seguro
cd /opt/robcast

# Copiar plantilla
cp Robcast-API/.env.example Robcast-API/.env

# Editar con tu editor favorito
nano Robcast-API/.env
```

**Contenido recomendado en producción:**

```env
# Base de datos
DB_HOST=mysql
DB_PORT=3306
DB_USER=robcast_user
DB_PASSWORD=PASSWORD_MUY_FUERTE_AQUI_123!@#
DB_NAME=robcast_db

# JWT
JWT_SECRET=SECRETO_SUPER_SEGURO_CAMBIAR_ESTO_$TR0ng!

# App
NODE_ENV=production
API_PORT=3001

# URLs
FRONTEND_URL=https://tudominio.com
```

### 6. Crear archivo docker-compose.prod.yml (opcional)

Si necesitas diferentes puertos o configuración en producción, crea:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: robcast_db
      MYSQL_USER: robcast_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - robcast-network
    restart: unless-stopped

  api:
    build: ./Robcast-API
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_USER: robcast_user
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: robcast_db
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    ports:
      - "3001:3001"
    networks:
      - robcast-network
    restart: unless-stopped

  frontend:
    build: ./Robcast
    ports:
      - "80:80"
    networks:
      - robcast-network
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  robcast-network:
```

### 7. Levantar servicios

```bash
cd /opt/robcast

# Construir imágenes (primera vez)
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Verificar que están corriendo
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 8. Verificar funcionamiento

```bash
# Esperar 10 segundos a que MySQL se inicie
sleep 10

# Probar API
curl http://localhost:3001/api/health

# Probar Frontend
curl http://localhost

# Probar conexión a BD
docker exec robcast-mysql mysql -u robcast_user -p -e "SELECT 1"
```

### 9. Configurar dominio y SSL (Nginx)

**Sistema de archivos reales (RECOMENDADO no usar Docker para Nginx en prod):**

```bash
# Instalar Nginx
yum install nginx -y

# Crear configuración
nano /etc/nginx/conf.d/robcast.conf
```

**Contenido:**

```nginx
upstream api {
    server localhost:3001;
}

upstream frontend {
    server localhost:80;
}

server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;
    
    ssl_certificate /etc/ssl/certs/tu-dominio.com.crt;
    ssl_certificate_key /etc/ssl/private/tu-dominio.com.key;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/html text/xml text/css text/javascript 
               application/javascript application/json application/xml+rss;
    
    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Probar configuración
nginx -t

# Iniciar Nginx
systemctl start nginx
systemctl enable nginx
```

### 10. SSL con Let's Encrypt (GRATUITO)

```bash
# Instalar Certbot
yum install certbot python3-certbot-nginx -y

# Obtener certificado (automático)
certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática
systemctl enable certbot-renew.timer
```

---

## 🤖 Configurar Auto-Deploy con Webhook (GitHub)

### En el servidor:

```bash
# Instalar webhooks
yum install go-bindata -y

# Descargar webhook
cd /opt
git clone https://github.com/adnanh/webhook.git
cd webhook
go build -o webhook

# Crear directorio para scripts
mkdir -p /opt/webhooks
cd /opt/webhooks
```

Crear archivo `hooks.json`:

```json
[
  {
    "id": "robcast-deploy",
    "execute-command": "/opt/webhooks/deploy.sh",
    "command-working-directory": "/opt/robcast",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha256",
        "secret": "tu-secreto-webhook-123",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature-256"
        }
      }
    }
  }
]
```

Crear archivo `/opt/webhooks/deploy.sh`:

```bash
#!/bin/bash
cd /opt/robcast
git pull origin main
docker-compose build
docker-compose up -d
echo "Deploy completado: $(date)" >> /opt/webhooks/deploy.log
```

```bash
chmod +x /opt/webhooks/deploy.sh
chmod +x /opt/webhook
```

Crear servicio systemd:

```bash
nano /etc/systemd/system/webhook.service
```

```ini
[Unit]
Description=Webhook Service for Robcast
After=network.target

[Service]
User=root
ExecStart=/opt/webhook/webhook -hooks /opt/webhooks/hooks.json -port 9000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable webhook
systemctl start webhook
```

Verificar:
```bash
curl http://localhost:9000/
```

### En GitHub:

1. Ir a: Repositorio → Settings → Webhooks
2. Click: Add webhook
3. Configurar:
   - **Payload URL:** `http://TU_IP:9000/hooks/robcast-deploy`
   - **Content type:** `application/json`
   - **Secret:** El mismo de `hooks.json`
   - **Events:** Push events
4. Click: Add webhook

---

## 📊 Monitoreo

### Ver estado de servicios

```bash
# Ver contenedores
docker ps

# Ver logs en tiempo real
docker-compose logs -f

# Específico del API
docker-compose logs -f api

# Base de datos
docker-compose logs -f mysql
```

### Backup de base de datos

```bash
# Crear backup
docker exec robcast-mysql mysqldump -u robcast_user -p robcast_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar
docker exec -i robcast-mysql mysql -u robcast_user -p robcast_db < backup.sql
```

### Monitoreo de recursos

```bash
# Ver uso de CPU/memoria
docker stats

# Espacio en disco
df -h
du -sh /opt/robcast
```

---

## 🔐 Checklist de Seguridad

- [ ] Cambiar contraseña root de MySQL
- [ ] Cambiar JWT_SECRET a un valor único
- [ ] Cambiar DB_PASSWORD
- [ ] Firewall: Permitir solo puertos 80, 443 y SSH
- [ ] SSL/TLS: Certificado de Let's Encrypt
- [ ] Backups automáticos de BD
- [ ] Logs centralizados (opcional: ELK stack)
- [ ] Monitoreo de uptime
- [ ] Política de contraseñas

---

## 🆘 Troubleshooting

### "Permission denied" al ejecutar docker

```bash
# Agregar usuario al grupo docker
usermod -aG docker $USER
newgrp docker
```

### "Certificado SSL expirado"

```bash
# Renovar
certbot renew --force-renewal

# O automático (cron)
0 0 * * * certbot renew &> /dev/null
```

### "Conexión a MySQL rechazada"

```bash
# Verificar que MySQL está corriendo
docker ps | grep mysql

# Ver logs
docker-compose logs mysql

# Reiniciar
docker-compose restart mysql
```

### "Out of memory"

```bash
# Limpiar imágenes no usadas
docker system prune -a

# Ver uso
docker system df
```

---

**¡Tu servidor está configurado! Cualquier cambio en Git se deployan automáticamente. 🚀**
