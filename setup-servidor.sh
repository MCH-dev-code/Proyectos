#!/bin/bash

# ============================================
# SETUP INICIAL SERVIDOR ROCKY LINUX 8
# Proyecto: Robcast
# Dominio: Tienda.robcast.com.do
# ============================================

set -e  # Salir si hay error

DOMINIO="Tienda.robcast.com.do"
RUTA_APP="/opt/robcast"
RUTA_NGINX="/etc/nginx"

echo "🚀 Iniciando configuración del servidor Rocky Linux 8..."

# ============================================
# 1. ACTUALIZAR SISTEMA
# ============================================
echo "📦 Actualizando sistema..."
sudo yum update -y
sudo yum install -y curl wget git yum-utils

# ============================================
# 2. INSTALAR DOCKER
# ============================================
echo "🐳 Instalando Docker..."
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# Instalar docker-compose (versión standalone)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar usuario actual al grupo docker
sudo usermod -aG docker $USER
newgrp docker

echo "✅ Docker instalado"

# ============================================
# 3. INSTALAR NGINX
# ============================================
echo "📝 Instalando Nginx..."
sudo yum install -y nginx

# Crear carpeta de logs si no existe
sudo mkdir -p /var/log/nginx

# Iniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ Nginx instalado"

# ============================================
# 4. CREAR ESTRUCTURA DE CARPETAS
# ============================================
echo "📂 Creando estructura de carpetas..."
sudo mkdir -p $RUTA_APP
sudo chown -R $USER:$USER $RUTA_APP
mkdir -p $RUTA_APP/datos/mysql
mkdir -p $RUTA_APP/logs

echo "✅ Carpetas creadas en: $RUTA_APP"

# ============================================
# 5. CLONAR REPOSITORIO
# ============================================
echo "📥 Clonando repositorio..."
cd $RUTA_APP
git clone https://github.com/MCH-dev-code/Proyectos.git .

echo "✅ Repositorio clonado"

# ============================================
# 6. CREAR ARCHIVOS .ENV
# ============================================
echo "⚙️  Configurando variables de entorno..."

# .env para Robcast-API
cat > Robcast-API/.env << 'EOF'
PORT=3000
NODE_ENV=production
DB_HOST=db
DB_USER=robcast_user
DB_PASSWORD=RobcastSecure2025!
DB_NAME=robcast_db
DB_PORT=3306

CORS_ORIGIN=https://Tienda.robcast.com.do
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
EOF

# .env para Robcast-panel
cat > Robcast-panel/.env << 'EOF'
VITE_API_URL=https://api.Tienda.robcast.com.do
VITE_APP_NAME=Robcast Panel
ENV=production
EOF

echo "✅ Archivos .env creados"
echo "⚠️  Edita: $RUTA_APP/Robcast-API/.env con credenciales reales"

# ============================================
# 7. CONFIGURAR NGINX
# ============================================
echo "🔧 Configurando Nginx como reverse proxy..."

# Respaldar config original
sudo cp $RUTA_NGINX/nginx.conf $RUTA_NGINX/nginx.conf.backup

# Crear config para el dominio
sudo tee $RUTA_NGINX/conf.d/robcast.conf > /dev/null << 'EOF'
# Upstream para los servicios
upstream robcast_frontend {
    server localhost:5173;
}

upstream robcast_api {
    server localhost:3000;
}

upstream robcast_panel {
    server localhost:5174;
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name Tienda.robcast.com.do;
    return 301 https://$server_name$request_uri;
}

# HTTPS - Tienda (Frontend)
server {
    listen 443 ssl http2;
    server_name Tienda.robcast.com.do;

    ssl_certificate /etc/letsencrypt/live/Tienda.robcast.com.do/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/Tienda.robcast.com.do/privkey.pem;

    # SSL mejorado
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 50M;

    location / {
        proxy_pass http://robcast_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    access_log /var/log/nginx/robcast-access.log;
    error_log /var/log/nginx/robcast-error.log;
}

# HTTPS - API
server {
    listen 443 ssl http2;
    server_name api.Tienda.robcast.com.do;

    ssl_certificate /etc/letsencrypt/live/Tienda.robcast.com.do/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/Tienda.robcast.com.do/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 50M;

    location / {
        proxy_pass http://robcast_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    access_log /var/log/nginx/api-access.log;
    error_log /var/log/nginx/api-error.log;
}

# HTTPS - Panel Admin
server {
    listen 443 ssl http2;
    server_name admin.Tienda.robcast.com.do;

    ssl_certificate /etc/letsencrypt/live/Tienda.robcast.com.do/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/Tienda.robcast.com.do/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 50M;

    location / {
        proxy_pass http://robcast_panel;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    access_log /var/log/nginx/panel-access.log;
    error_log /var/log/nginx/panel-error.log;
}
EOF

# Recargar Nginx
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Nginx configurado"

# ============================================
# 8. INSTALAR CERTBOT (SSL)
# ============================================
echo "🔒 Instalando Certbot para SSL..."
sudo yum install -y epel-release
sudo yum install -y certbot python3-certbot-nginx

echo "⚠️  Ejecuta esto después para obtener SSL:"
echo "   sudo certbot -d Tienda.robcast.com.do -d api.Tienda.robcast.com.do -d admin.Tienda.robcast.com.do"

# ============================================
# 9. ABRIR PUERTOS EN FIREWALL
# ============================================
echo "🔓 Configurando firewall (firewalld)..."
sudo systemctl start firewalld
sudo systemctl enable firewalld

sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp    # API
sudo firewall-cmd --permanent --add-port=5173/tcp    # Frontend
sudo firewall-cmd --permanent --add-port=5174/tcp    # Panel
sudo firewall-cmd --permanent --add-port=3306/tcp    # MySQL
sudo firewall-cmd --reload

echo "✅ Puertos abiertos"

# ============================================
# INFORMACIÓN FINAL
# ============================================
echo ""
echo "=========================================="
echo "✅ SETUP COMPLETADO"
echo "=========================================="
echo ""
echo "📍 Ubicación de la aplicación: $RUTA_APP"
echo "📍 Dominio: https://Tienda.robcast.com.do"
echo ""
echo "🔒 PRÓXIMOS PASOS:"
echo ""
echo "1️⃣  OBTENER CERTIFICADO SSL:"
echo "   sudo certbot -d Tienda.robcast.com.do -d api.Tienda.robcast.com.do -d admin.Tienda.robcast.com.do"
echo ""
echo "2️⃣  EDITAR VARIABLES DE ENTORNO:"
echo "   cd $RUTA_APP"
echo "   nano Robcast-API/.env        # Editar credenciales BD"
echo "   nano Robcast-panel/.env      # Editar URLs"
echo ""
echo "3️⃣  LEVANTAR LOS SERVICIOS:"
echo "   cd $RUTA_APP"
echo "   docker-compose up -d"
echo ""
echo "4️⃣  VERIFICAR SERVICIOS:"
echo "   docker-compose ps"
echo "   docker-compose logs -f"
echo ""
echo "📊 ACCESO:"
echo "   Tienda:     https://Tienda.robcast.com.do"
echo "   API:        https://api.Tienda.robcast.com.do"
echo "   Panel:      https://admin.Tienda.robcast.com.do"
echo ""
echo "=========================================="
