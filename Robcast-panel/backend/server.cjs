const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración de seguridad y tamaño de archivos
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Conexión a la base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'robcast_db'
});

// --- RUTA DE PRUEBA ---
app.get('/', (req, res) => {
  res.json({ 
    message: "Servidor Robcast Operativo 🚀",
    version: "1.0",
    endpoints: {
      productos: "/productos",
      clientes: "/clientes",
      ventas: "/ventas",
      stats: "/stats/summary"
    }
  });
});

// ==================== PRODUCTOS ====================
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
});

app.post('/productos', (req, res) => {
  const { nombre, stock, precio, imagen } = req.body;
  if (!nombre) return res.status(400).json({ error: "El nombre es requerido" });
  
  const sql = 'INSERT INTO productos (nombre, stock, precio, imagen) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, stock || 0, precio || 0, imagen || ''], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, message: "Producto creado" });
  });
});

app.put('/productos/:id', (req, res) => {
  const { nombre, stock, precio, imagen } = req.body;
  const sql = 'UPDATE productos SET nombre=?, stock=?, precio=?, imagen=? WHERE id=?';
  db.query(sql, [nombre, stock, precio, imagen, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Producto actualizado" });
  });
});

app.delete('/productos/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Producto eliminado" });
  });
});

// ==================== CLIENTES ====================
app.get('/clientes', (req, res) => {
  db.query('SELECT * FROM clientes ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
});

app.post('/clientes', (req, res) => {
  const { nombre, email, telefono } = req.body;
  if (!nombre) return res.status(400).json({ error: "El nombre es requerido" });
  
  const sql = 'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)';
  db.query(sql, [nombre, email || '', telefono || ''], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, message: "Cliente creado" });
  });
});

app.delete('/clientes/:id', (req, res) => {
  db.query('DELETE FROM clientes WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cliente eliminado" });
  });
});

// ==================== VENTAS ====================
app.get('/ventas', (req, res) => {
  const sql = `
    SELECT v.id, v.cliente_id, c.nombre, v.total, v.created_at,
      GROUP_CONCAT(JSON_OBJECT('producto_id', dv.producto_id, 'cantidad', dv.cantidad, 'precio', dv.precio_unitario)) as detalles
    FROM ventas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
    GROUP BY v.id
    ORDER BY v.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results || []);
  });
});

app.post('/ventas', (req, res) => {
  const { cliente_id, productos, total } = req.body;
  
  if (!cliente_id || !productos || productos.length === 0) {
    return res.status(400).json({ error: "cliente_id y productos son requeridos" });
  }

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });
    
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: err.message });
      }

      const sqlVenta = 'INSERT INTO ventas (cliente_id, total) VALUES (?, ?)';
      connection.query(sqlVenta, [cliente_id, total], (err, result) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            res.status(500).json({ error: err.message });
          });
        }

        const ventaId = result.insertId;
        let processedCount = 0;
        let hasError = false;

        productos.forEach((p) => {
          const sqlDetalle = 'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)';
          connection.query(sqlDetalle, [ventaId, p.id, p.cantidad, p.precio], (err) => {
            if (err && !hasError) {
              hasError = true;
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: err.message });
              });
            }

            const sqlUpdateStock = 'UPDATE productos SET stock = stock - ? WHERE id = ?';
            connection.query(sqlUpdateStock, [p.cantidad, p.id], (err) => {
              if (err && !hasError) {
                hasError = true;
                return connection.rollback(() => {
                  connection.release();
                  res.status(500).json({ error: err.message });
                });
              }

              processedCount++;
              if (processedCount === productos.length) {
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ error: err.message });
                    });
                  }
                  connection.release();
                  res.json({ id: ventaId, message: "Venta exitosa" });
                });
              }
            });
          });
        });
      });
    });
  });
});

// ==================== ESTADÍSTICAS ====================
app.get('/stats/summary', (req, res) => {
  const queries = [
    { name: 'ingresos_totales', sql: 'SELECT COALESCE(SUM(total), 0) as value FROM ventas' },
    { name: 'total_productos', sql: 'SELECT COUNT(*) as value FROM productos' },
    { name: 'total_clientes', sql: 'SELECT COUNT(*) as value FROM clientes' },
    { name: 'total_ventas', sql: 'SELECT COUNT(*) as value FROM ventas' }
  ];

  const stats = {};
  let completedQueries = 0;

  queries.forEach(q => {
    db.query(q.sql, (err, results) => {
      if (!err && results.length > 0) {
        stats[q.name] = results[0].value;
      } else {
        stats[q.name] = 0;
      }
      completedQueries++;
      if (completedQueries === queries.length) {
        res.json(stats);
      }
    });
  });
});

// ==================== ERROR GLOBAL ====================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(3001, () => {
  console.log("✅ Backend Robcast en puerto 3001");
  console.log("📊 Dashboard: http://localhost:3001");
});