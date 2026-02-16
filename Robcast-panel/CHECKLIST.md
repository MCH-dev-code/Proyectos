# ✅ CHECKLIST DE CONFIGURACIÓN - ROBCAST

## Fase 1: Instalación de Dependencias
```
[ ] Node.js v18+ instalado (verificar con: node --version)
[ ] MySQL Server ejecutándose en puerto 3001
[ ] Terminal 1 - Ejecutar: cd backend && npm install
[ ] Terminal 2 - Ejecutar: npm install (en raíz)
```

## Fase 2: Base de Datos
```
[ ] Abrir MySQL Workbench o phpmyadmin  
[ ] Crear nueva conexión localhost:3306
[ ] Ejecutar archivo: setup_database.sql
[ ] Verificar que existen 4 tablas: productos, clientes, ventas, detalle_ventas
[ ] Verificar que hay datos de ejemplo
```

## Fase 3: Configuración .env
```
[ ] Archivo .env existe en raíz del proyecto
[ ] Archivo .env existe en carpeta backend/
[ ] Configurar credenciales MySQL:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=tu_password_aqui
    DB_NAME=robcast_db
```

## Fase 4: Iniciar Backend
```
Terminal 1:
[ ] cd backend
[ ] npm start
[ ] Mensaje esperado: "✅ Backend Robcast en puerto 3001"
[ ] Probar en navegador: http://localhost:3001
```

## Fase 5: Iniciar Frontend  
```
Terminal 2 (en raíz del proyecto):
[ ] npm run dev
[ ] Mensaje esperado: Enlace local como "http://localhost:5173"
[ ] Se abre automáticamente en navegador
```

## Fase 6: Prueba Funcional
```
Frontend:
[ ] Dashboard muestra "Online" en verde
[ ] Estadísticas cargan correctamente
[ ] Ir a Productos - Ver lista de producto
[ ] Ir a Clientes - Ver lista de clientes
[ ] Crear nuevo producto
[ ] Crear nueva venta
```

---

## 🔴 Si algo falla:

### Backend no inicia
- Verificar puerto 3001 no está en uso: `netstat -an | findstr :3001`
- Matar proceso en puerto: `taskkill /PID <PID> /F`
- Ver logs completos de error

### No conecta con MySQL
- Verificar MySQL Services está ejecutándose
- Probar conexión: `mysql -u root -p`
- Verificar credenciales en .env
- Ejecutar nuevamente setup_database.sql

### Frontend muestra "Cannot GET"  
- Asegurar Backend está ejecutándose
- Abrir DevTools → Console para ver errores
- Verificar CORS no está bloqueando

### Puerto 3001 en uso
```powershell
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# O simplemente cambiar puerto en server.cjs línea final
```

---

## 📞 Comandos Útiles

```bash
# Ver procesos usando puertos
netstat -an | findstr LISTEN

# Reiniciar MySQL (Windows)
net stop MySQL80
net start MySQL80

# Limpiar caché npm
npm cache clean --force

# Reinstalar todas las dependencias
rm -r node_modules package-lock.json
npm install
```

---

**¡Si todos los checks están completados, Robcast está 100% funcional! 🎉**
