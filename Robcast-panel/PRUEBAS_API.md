# 🧪 PRUEBAS DE API - ROBCAST

## Verificar que backend esté funcionando

### Con PowerShell:
```powershell
# Verificar que backend responde
Invoke-WebRequest -Uri "http://localhost:3001" -Method GET | Select-Object StatusCode, Content
```

### Con cURL (cualquier terminal):
```bash
curl http://localhost:3001
```

Respuesta esperada:
```json
{
  "message": "Servidor Robcast Operativo 🚀",
  "version": "1.0",
  "endpoints": { ... }
}
```

---

## 📦 PRODUCTOS

### Listar todos los productos
```bash
curl http://localhost:3001/productos
```

### Crear producto
```bash
curl -X POST http://localhost:3001/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mouse Inalámbrico","stock":10,"precio":850,"imagen":""}'
```

### Actualizar producto (ID 1)
```bash
curl -X PUT http://localhost:3001/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mouse Inalámbrico RGB","stock":15,"precio":950,"imagen":""}'
```

### Eliminar producto (ID 1)
```bash
curl -X DELETE http://localhost:3001/productos/1
```

---

## 👥 CLIENTES

### Listar todos los clientes
```bash
curl http://localhost:3001/clientes
```

### Crear cliente
```bash
curl -X POST http://localhost:3001/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Roberto García","email":"roberto@example.com","telefono":"809-999-9999"}'
```

### Eliminar cliente (ID 1)
```bash
curl -X DELETE http://localhost:3001/clientes/1
```

---

## 💰 VENTAS

### Listar todas las ventas
```bash
curl http://localhost:3001/ventas
```

### Crear venta
Primero verifica los IDs de cliente y producto con GET.

```bash
curl -X POST http://localhost:3001/ventas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "productos": [
      {"id": 1, "cantidad": 2, "precio": 450},
      {"id": 2, "cantidad": 1, "precio": 1500}
    ],
    "total": 2400
  }'
```

---

## 📊 ESTADÍSTICAS

### Obtener resumen general
```bash
curl http://localhost:3001/stats/summary
```

Respuesta esperada:
```json
{
  "ingresos_totales": 2400,
  "total_productos": 5,
  "total_clientes": 4,
  "total_ventas": 1
}
```

---

## 🐛 Debugging en Navegador

### Con JavaScript en DevTools Console:

```javascript
// Listar productos
fetch('http://localhost:3001/productos')
  .then(res => res.json())
  .then(console.log);

// Crear cliente
fetch('http://localhost:3001/clientes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Test Cliente',
    email: 'test@example.com',
    telefono: '809-000-0000'
  })
})
.then(res => res.json())
.then(console.log);

// Obtener estadísticas
fetch('http://localhost:3001/stats/summary')
  .then(res => res.json())
  .then(console.log);
```

---

## 📋 Casos de Prueba Completos

### Flujo: Crear producto → Crear cliente → Realizar venta

1. **Crear un producto**
   ```bash
   curl -X POST http://localhost:3001/productos \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Producto Test","stock":5,"precio":1000}'
   ```
   Anotate el `id` devuelto (ej: 6)

2. **Crear un cliente**
   ```bash
   curl -X POST http://localhost:3001/clientes \
     -H "Content-Type: application/json" \
     -d '{"nombre":"Cliente Test","email":"test@test.com","telefono":"809-123-4567"}'
   ```
   Anotate el `id` devuelto (ej: 5)

3. **Realizar una venta**
   ```bash
   curl -X POST http://localhost:3001/ventas \
     -H "Content-Type: application/json" \
     -d '{"cliente_id":5,"productos":[{"id":6,"cantidad":2,"precio":1000}],"total":2000}'
   ```

4. **Verificar estadísticas actualizadas**
   ```bash
   curl http://localhost:3001/stats/summary
   ```
   Debería mostrar: ingresos_totales: 2000, total_ventas: 1

---

## 🔍 Códigos de Error Esperados

| Código | Significado | Ejemplo |
|--------|------------|---------|
| 200 | ✅ Éxito | GET /productos |
| 201 | ✅ Creado | POST /clientes |
| 400 | ❌ Datos inválidos | `{"nombre":""}` |
| 500 | ❌ Error servidor | MySQL no conecta |

---

## 💡 Consejos

- Siempre ejecuta **backend primero** (Terminal 1)
- Espera el mensaje `✅ Backend Robcast en puerto 3001`
- Si request falla, verifica:
  - Backend está ejecutándose
  - MySQL está ejecutándose
  - Base de datos y tablas existen
  - Credenciales .env son correctas
- Para ver detalles de error, abre DevTools (F12)

---

**¡Ready para testear! 🚀**
