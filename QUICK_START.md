# Guía Rápida: Todo lo que Necesitas Saber

## 🎯 TU FLUJO DE TRABAJO

### 1. Desarrollo Local

```bash
# Una sola vez: Inicializar Git
git init
git remote add origin git@github.com:TU_USUARIO/robcast.git

# Cada sesión: Levantar los servicios
docker-compose -f docker-compose.dev.yml up -d

# Editar archivos, ver cambios en tiempo real en:
# - Frontend: http://localhost:5173
# - Admin: http://localhost:5174
# - API: http://localhost:3001

# Hacer cambios y guardar (hot reload automático)
```

### 2. Probar cambios localmente

```bash
# En la terminal
./health-check.sh

# O manualmente
curl http://localhost:3001/api/health      # ¿API funciona?
curl http://localhost:5173                  # ¿Frontend funciona?
```

### 3. Subir a Git

```bash
# Un comando para todo
./push.sh

# Sigue las instrucciones (mensaje de commit + enter para subir)
```

### 4. Deploy en servidor

**Opción A: Automático con webhook (GitHub)**
- Cambios se suben automáticamente cuando haces push

**Opción B: Manual en servidor**
```bash
ssh usuario@servidor.com
cd /opt/robcast
git pull
docker-compose up -d --build
```

---

## 🚀 COMANDOS ÚTILES

| Tarea | Comando |
|-------|---------|
| Ver estado | `docker-compose ps` |
| Ver logs | `docker-compose logs -f` |
| Parar todo | `docker-compose down` |
| Reconstruir | `docker-compose build` |
| Restart | `docker-compose restart` |
| BBD MySQL | `docker exec -it robcast-mysql mysql -u robcast_user -p` |

O usa el menú interactivo:
```bash
./manage.sh
```

---

## 🔑 ARCHIVOS IMPORTANTES

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.dev.yml` | Desarrollo con hot reload |
| `docker-compose.yml` | Producción |
| `.env.example` | Plantilla de vars de entorno |
| `Robcast-API/.env` | Config real del servidor (NO subir) |
| `push.sh` | Automatizar push a Git |
| `manage.sh` | Menú de Docker |
| `WORKFLOW_GIT_DOCKER.md` | Guía completa |
| `DEPLOY_ROCKY_LINUX.md` | Deploy en Rocky 8 |

---

## 🛠 CONFIGURACIÓN MÍNIMA

### Antes de primer deploy:

1. **Git**
```bash
git init
git remote add origin git@github.com:TU_USUARIO/robcast.git
git branch -M main
```

2. **Archivo .env (servidor solamente)**
```bash
cp Robcast-API/.env.example Robcast-API/.env
# Editar con contraseñas reales:
# DB_PASSWORD=contraseña_fuerte
# JWT_SECRET=secreto_seguro
```

3. **Docker Compose (una sola vez)**
```bash
docker-compose build
docker-compose up -d
```

4. **Verificar**
```bash
./health-check.sh
```

---

## 🆘 ERRORES COMUNES

### "docker-compose: command not found"
→ Instalar: `sudo apt-get install docker-compose-plugin`

### "Cannot connect to API"
→ Verificar: `docker-compose ps` (¿están corriendo?)
→ Ver logs: `docker-compose logs api`

### "Puerto 3001 ya en uso"
→ Cambiar en docker-compose.yml o matar proceso:
```bash
lsof -i :3001
kill -9 <PID>
```

### "Font error en panel"
→ Normal, se resuelve cuando está en HTTPS en producción

### "Git no sube cambios"
→ Verificar SSH:
```bash
ssh -T git@github.com
```
→ Si falla, seguir: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 📊 STATUS: LISTO PARA PRODUCCIÓN

✅ Backend API (Node.js + Express + MySQL)
✅ Frontend (React + Vite)
✅ Panel Admin (React + Vite)
✅ Docker Compose (dev + prod)
✅ Database schema con tablas
✅ Autenticación con JWT
✅ Hot reload en desarrollo
✅ Scripts de automatización
✅ Documentación completa

---

**Todo está listo. Ahora solo necesitas:**
1. Inicializar Git
2. Crear repositorio en GitHub
3. Hacer push
4. Configurar servidor
5. Deploy

¿Necesitas ayuda con algún paso específico? 🚀
