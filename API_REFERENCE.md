# API Reference - Endpoints Disponibles

## 📡 Base URLs

| Entorno | URL |
|---------|-----|
| Local (dev) | `http://localhost:3001/api` |
| Local (prod) | `http://localhost/api` |
| Servidor | `https://tu-dominio.com/api` |

---

## 🔐 AUTENTICACIÓN

### Registro
```
POST /auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contraseña": "Password123!"
}

Respuesta (201):
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "token": "eyJhbGc..."
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "contraseña": "Password123!"
}

Respuesta (200):
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "token": "eyJhbGc...",
  "tienePuntosLealtad": 250,
  "puntos": 250
}
```

### Obtener Perfil (Requiere token)
```
GET /usuarios/perfil
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "cliente",
  "tienePuntosLealtad": true,
  "puntos": 250
}
```

---

## 📦 PRODUCTOS

### Obtener Todos los Productos
```
GET /productos

Parámetros opcionales:
  ?categoria=electronica
  ?buscar=laptop
  ?limite=10
  ?offset=0

Respuesta (200):
{
  "total": 50,
  "productos": [
    {
      "id": 1,
      "nombre": "Laptop Dell",
      "descripcion": "Laptop de 15 pulgadas",
      "precio": 899.99,
      "stock": 25,
      "imagen": "laptop.jpg",
      "categoria": "electronica",
      "valoracion_promedio": 4.5,
      "cantidad_opiniones": 12
    },
    ...
  ]
}
```

### Obtener Producto por ID
```
GET /productos/:id

Respuesta (200):
{
  "id": 1,
  "nombre": "Laptop Dell",
  "descripcion": "Laptop de 15 pulgadas",
  "precio": 899.99,
  "stock": 25,
  "imagen": "laptop.jpg",
  "categoria": "electronica",
  "valoracion_promedio": 4.5,
  "cantidad_opiniones": 12
}
```

### Crear Producto (Admin)
```
POST /productos
Headers:
  Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "nombre": "Mouse Logitech",
  "descripcion": "Mouse inalámbrico",
  "precio": 29.99,
  "stock": 100,
  "imagen": "mouse.jpg",
  "categoria": "accesorios"
}

Respuesta (201):
{
  "id": 2,
  "nombre": "Mouse Logitech",
  "precio": 29.99,
  "stock": 100
}
```

### Actualizar Producto (Admin)
```
PUT /productos/:id
Headers:
  Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "nombre": "Mouse Logitech Pro",
  "precio": 39.99,
  "stock": 85
}

Respuesta (200):
{
  "id": 2,
  "nombre": "Mouse Logitech Pro",
  "precio": 39.99
}
```

### Eliminar Producto (Admin)
```
DELETE /productos/:id
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "mensaje": "Producto eliminado correctamente"
}
```

---

## 🛒 CARRITO

### Agregar al Carrito (Requiere token)
```
POST /carrito/agregar
Headers:
  Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "producto_id": 1,
  "cantidad": 2
}

Respuesta (200):
{
  "mensaje": "Producto agregado al carrito",
  "carrito": [
    {
      "producto_id": 1,
      "nombre": "Laptop Dell",
      "cantidad": 2,
      "precio": 899.99
    }
  ]
}
```

### Obtener Carrito
```
GET /carrito
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "items": [
    {
      "producto_id": 1,
      "nombre": "Laptop Dell",
      "cantidad": 2,
      "precio": 899.99,
      "subtotal": 1799.98
    }
  ],
  "total": 1799.98
}
```

### Eliminar del Carrito
```
DELETE /carrito/:producto_id
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "mensaje": "Producto removido del carrito"
}
```

---

## ⭐ FAVORITOS/WISHLIST

### Agregar a Favoritos
```
POST /favoritos/agregar
Headers:
  Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "producto_id": 1
}

Respuesta (200):
{
  "mensaje": "Agregado a favoritos"
}
```

### Obtener Favoritos
```
GET /favoritos
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "favoritos": [
    {
      "id": 1,
      "nombre": "Laptop Dell",
      "precio": 899.99
    }
  ]
}
```

### Remover de Favoritos
```
DELETE /favoritos/:producto_id
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "mensaje": "Removido de favoritos"
}
```

---

## 💳 VENTAS/PEDIDOS

### Crear Venta (Orden)
```
POST /ventas/crear
Headers:
  Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "carrito": [
    {
      "producto_id": 1,
      "cantidad": 2
    }
  ],
  "monto_total": 1799.98
}

Respuesta (201):
{
  "id": 1,
  "usuario_id": 1,
  "total": 1799.98,
  "estado": "pendiente",
  "fecha_venta": "2024-01-15T10:30:00Z",
  "detalles": [
    {
      "producto_id": 1,
      "cantidad": 2,
      "precio_unitario": 899.99
    }
  ]
}
```

### Obtener Historial de Ventas
```
GET /ventas/historial
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "ventas": [
    {
      "id": 1,
      "total": 1799.98,
      "estado": "entregado",
      "fecha_venta": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Obtener Detalles de Venta
```
GET /ventas/:id
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "id": 1,
  "total": 1799.98,
  "estado": "entregado",
  "fecha_venta": "2024-01-15T10:30:00Z",
  "detalles": [
    {
      "producto_id": 1,
      "nombre": "Laptop Dell",
      "cantidad": 2,
      "precio_unitario": 899.99,
      "subtotal": 1799.98
    }
  ]
}
```

---

## ⭐ CALIFICACIONES

### Agregar Calificación
```
POST /opiniones/agregar
Headers:
  Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "producto_id": 1,
  "calificacion": 5,
  "comentario": "Excelente producto!"
}

Respuesta (201):
{
  "id": 1,
  "producto_id": 1,
  "calificacion": 5,
  "comentario": "Excelente producto!"
}
```

### Obtener Calificaciones de Producto
```
GET /opiniones/:producto_id

Respuesta (200):
{
  "calificaciones": [
    {
      "id": 1,
      "usuario": "Juan Pérez",
      "calificacion": 5,
      "comentario": "Excelente producto!",
      "fecha": "2024-01-15T10:30:00Z"
    }
  ],
  "promedio": 4.8,
  "total": 10
}
```

---

## 🎁 PUNTOS DE LEALTAD

### Obtener Puntos
```
GET /lealtad/puntos
Headers:
  Authorization: Bearer <TOKEN>

Respuesta (200):
{
  "usuario_id": 1,
  "puntos_totales": 250,
  "nivel": "Gold",
  "historial": [
    {
      "fecha": "2024-01-15",
      "concepto": "Compra",
      "puntos": 50
    }
  ]
}
```

### Canjear Puntos
```
POST /lealtad/canjear
Headers:
  Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "puntos": 100,
  "concepto": "descuento"
}

Respuesta (200):
{
  "mensaje": "Puntos canjeados",
  "puntos_restantes": 150,
  "descuento_aplicado": 10.00
}
```

---

## 🏥 HEALTH CHECK

### Verificar API
```
GET /health

Respuesta (200):
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## ⚠️ CÓDIGOS DE ERROR

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o ausente |
| 403 | Forbidden - Permisos insuficientes |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error en el servidor |

**Ejemplo de error:**
```json
{
  "error": "Token inválido o expirado",
  "codigo": 401
}
```

---

## 🔒 Autenticación con Token

Todos los endpoints que requieren autenticación esperan el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El token se obtiene en el login y tiene validez de 24 horas.

---

## 📝 EJEMPLOS CON CURL

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "contraseña": "Password123!"
  }'
```

### Obtener Productos
```bash
curl http://localhost:3001/api/productos
```

### Crear Venta (con token)
```bash
curl -X POST http://localhost:3001/api/ventas/crear \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "carrito": [{"producto_id": 1, "cantidad": 2}],
    "monto_total": 1799.98
  }'
```

---

## 🧪 Testing con Postman

1. Importar la colección de endpoints
2. Configurar variable de entorno: `{{TOKEN}}`
3. Ejecutar login para obtener token
4. Usar token en requests autenticadas
5. Probar cada endpoint

---

**Última actualización:** Enero 2024  
Para más información, ver `README.md` o `DEPLOY_ROCKY_LINUX.md`
