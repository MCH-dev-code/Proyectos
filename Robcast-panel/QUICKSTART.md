# 🎯 QUICK START - Robcast en 5 minutos

## Paso 1: Preparar Base de Datos
```bash
# Ejecutar en client MySQL (phpMyAdmin, Workbench, etc)
# Abre el archivo: setup_database.sql
# Cópia TODO y ejecuta en tu cliente MySQL
```

✅ Si ves 4 tablas creadas, continúa.

---

## Paso 2: Instalar Dependencias

**Terminal 1:**
```bash
cd Robcast/backend
npm install
```

**Terminal 2 (nueva):**
```bash
cd Robcast
npm install
```

✅ Si ambas terminaron sin errores, continúa.

---

## Paso 3: Verificar .env

Abre archivo `.env` en la raíz del proyecto:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=      # Agrega tu password si tiene
DB_NAME=robcast_db
```

Guarda y continúa.

---

## Paso 4: Iniciar Backend

**Terminal 1:**
```bash
npm start
```

Deberías ver:
```
✅ Backend Robcast en puerto 3001
📊 Dashboard: http://localhost:3001
```

✅ Si ves estos mensajes, backend está corriendo.

---

## Paso 5: Iniciar Frontend  

**Terminal 2:**
```bash
npm run dev
```

Deberías ver algo como:
```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

Se abrirá automáticamente en tu navegador.

---

## Paso 6: Verificar Funcionamiento

En el navegador (http://localhost:5173):

✅ **Dashboard** - Debes ver 4 tarjetas con números
✅ **Productos** - Ver lista de productos con botón "+ NUEVO"
✅ **Clientes** - Ver 4 clientes de ejemplo
✅ **Ventas** - Poder seleccionar cliente y productos

---

## 🎉 ¡LISTO!

Robcast está 100% funcional. Ahora puedes:

- ✏️ Crear/editar/eliminar productos
- 👥 Gestionar clientes
- 💰 Registrar ventas
- 📊 Ver estadísticas en tiempo real

---

## ❌ Si algo falla

### Backend no inicia
```bash
# Verificar que MySQL está ejecutándose
# Cambiar .env con credenciales correctas
# Ejecutar setup_database.sql nuevamente
```

### "Cannot GET /productos"
```bash
# Frontend no ve backend
# Verificar puerto 3001 disponible
# Reiniciar ambos terminales
```

### "Cannot connect to Database"
```bash
# MySQL no está ejecutándose
# Iniciar MySQL Services (Windows/Mac/Linux)
# Crear database y tablas con setup_database.sql
```

---

## 📖 Documentación Adicional

- `INSTRUCCIONES.md` - Guía detallada
- `CHECKLIST.md` - Verificación paso a paso
- `PRUEBAS_API.md` - Testear endpoints
- `INCONSISTENCIAS_REPARADAS.md` - Qué se arregló

---

**Disfruta de Robcast! 🚀**
