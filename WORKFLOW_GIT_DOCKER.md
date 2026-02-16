# GUÍA: Desarrollo Local → Git → Servidor

## 📋 Requisitos Previos

### En tu PC (Desarrollo)
- Git instalado
- Docker y Docker Compose
- Cuenta de GitHub/GitLab

### En el Servidor (Rocky Linux 8)
- Linux instalado
- Docker y Docker Compose
- Acceso SSH
- Clave SSH configurada

---

## 1️⃣ PREPARAR EL PROYECTO LOCAL

### Paso 1: Inicializar Git

```bash
cd ~/Proyectos  # O la carpeta del proyecto

# Si no hay Git todavía
git init
git remote add origin git@github.com:TU_USUARIO/robcast.git
```

### Paso 2: Crear rama principal

```bash
git branch -M main
git add .
git commit -m "Commit inicial: Robcast E-commerce con Docker"
```

### Paso 3: Verificar estructura

```bash
tree -L 2 -I 'node_modules|dist|mysql_data'

Proyectos/
├── .gitignore
├── .git/
├── docker-compose.yml
├── docker-compose.dev.yml
├── deploy-server.sh
├── push.sh
├── README.md
├── DEPLOY_ROCKY_LINUX.md
├── manage.sh
├── Robcast/                 (Frontend React)
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   ├── src/
│   └── package.json
├── Robcast-API/             (Backend Node.js)
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── src/
│   └── package.json
└── Robcast-panel/           (Admin Panel)
    ├── Dockerfile
    ├── src/
    └── package.json
```

---

## 2️⃣ DESARROLLO LOCAL CON DOCKER

### Para desarrollo (hot reload):

```bash
# En la carpeta del proyecto
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d

# Acceder a:
# Frontend:  http://localhost:5173
# API:       http://localhost:3001
# Panel:     http://localhost:5174
```

### Para producción (optimizado):

```bash
# Usar el docker-compose.yml normal
docker-compose build
docker-compose up -d

# Acceder a:
# Frontend:  http://localhost
# API:       http://localhost:3001
```

### Scripts útiles:

```bash
./manage.sh                        # Menú interactivo
./push.sh                          # Commit y push a Git
```

---

## 3️⃣ SUBIR A GIT

### Método 1: Script automático

```bash
chmod +x push.sh
./push.sh
```

Luego escribe el mensaje de commit y confirma.

### Método 2: Comandos manuales

```bash
git add .
git commit -m "Mensaje del commit"
git push origin main
```

---

## 4️⃣ CONFIGURAR EL SERVIDOR

### En el servidor Rocky Linux 8:

```bash
# Crear carpeta de proyecto
mkdir -p /opt/robcast
cd /opt/robcast

# Clonar repositorio
git clone git@github.com:TU_USUARIO/robcast.git .

# Crear archivos de configuración
cp Robcast-API/.env.example Robcast-API/.env

# Editar .env si necesario
nano Robcast-API/.env
```

### Configurar deploy automático con webhook (GitHub):

**Opción A: Usar script manual**

```bash
# En el servidor, hacer pull manual
cd /opt/robcast
git pull origin main
docker-compose up -d --build
```

**Opción B: Webhook automático (más avanzado)**

1. En GitHub: Settings → Webhooks → Add webhook
2. Payload URL: `http://TU_IP:9000/payload`
3. Content type: `application/json`
4. En el servidor, instalar `webhooks`:

```bash
go get github.com/adnanh/webhook
# O usar Docker
docker run -d -p 9000:9000 \
  -v $PWD/hooks.json:/etc/webhook/hooks.json \
  almir/webhook
```

---

## 5️⃣ DEPLOY INICIAL EN EL SERVIDOR

### Con SSH:

```bash
ssh usuario@TU_IP_SERVIDOR

cd /opt/robcast

# Construir imágenes
docker-compose build

# Levantar servicios
docker-compose up -d

# Verificar
curl http://localhost:3001/api/health
curl http://localhost
```

### Usar script automático:

```bash
chmod +x deploy-server.sh

# Editar la ruta del proyecto
nano deploy-server.sh
# Cambiar: PROJECT_DIR="/ruta/al/proyecto"

./deploy-server.sh
```

---

## 6️⃣ WORKFLOW DIARIO

### Cambios locales:

```bash
# 1. Trabajar en los archivos (código)

# 2. Probar en local
docker-compose down
docker-compose -f docker-compose.dev.yml up -d
# Verificar en http://localhost:5173

# 3. Subir a Git
./push.sh

# 4. En el servidor (automático o manual)
cd /opt/robcast
git pull origin main
docker-compose up -d --build
```

---

## 7️⃣ MONITOREO

### Ver logs en desarrollo:

```bash
docker-compose -f docker-compose.dev.yml logs -f
docker-compose -f docker-compose.dev.yml logs -f api
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Ver logs en servidor:

```bash
docker-compose logs -f
docker ps
docker system df
```

---

## 🔐 VARIABLES DE ENTORNO

### `.env` local (NO subir a Git)

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=robcast_user
DB_PASSWORD=contraseña_local
DB_NAME=robcast_db
JWT_SECRET=secreto_local
API_PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### `.env` en servidor (CAMBIADO)

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=robcast_user
DB_PASSWORD=contraseña_fuerte_produccion  # ← CAMBIAR
DB_NAME=robcast_db
JWT_SECRET=secreto_super_seguro_produccion  # ← CAMBIAR
API_PORT=3001
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.com  # ← CAMBIAR
```

---

## 🚨 SOLUCIONAR PROBLEMAS

### Mi push falló

```bash
# Falta configurar remoto
git remote add origin git@github.com:TU_USUARIO/robcast.git
git push origin main

# O si Git pide contraseña (SSH no configurado)
# Seguir: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### El servidor no actualiza

```bash
# Verificar cambios
git status
git log --oneline

# Tirar cambios forzadamente
git reset --hard origin/main
docker-compose up -d --build
```

### BD corrupta

```bash
# Hacer backup
docker exec robcast-mysql mysqldump -u root -p robcast_db > backup.sql

# Restaurar
docker exec -i robcast-mysql mysql -u root -p robcast_db < backup.sql
```

---

## 📊 ESTRUCTURA FINAL DE REPOS

```
GitHub/GitLab
└── robcast/
    ├── .git/
    ├── .gitignore
    ├── docker-compose.yml
    ├── docker-compose.dev.yml
    ├── push.sh
    ├── deploy-server.sh
    ├── README.md
    ├── Robcast/
    ├── Robcast-API/
    └── Robcast-panel/
```

---

## ✅ CHECKLIST FINAL

- [ ] Proyecto en GitHub/GitLab
- [ ] `.env` agregado a `.gitignore`
- [ ] Docker Compose funciona localmente
- [ ] Scripts tienen permisos de ejecución
- [ ] Servidor tiene acceso al repositorio
- [ ] Webhook configurado (opcional)
- [ ] BD iniciada con datos de prueba
- [ ] Frontend accesible en navegador
- [ ] API responde en /api/health
- [ ] Panel admin funciona

---

**¡Tu flujo de deploy está listo! 🚀**

Para más información, ver `DEPLOY_ROCKY_LINUX.md`.
