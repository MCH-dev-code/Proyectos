const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarAdmin } = require('../middleware/authAdmin');
const { 
  validarProducto, 
  validarVenta,
  validarCupon 
} = require('../middleware/validators');
const { 
  uploadProductos, 
  handleUploadError,
  getImageUrl,
  deleteImage 
} = require('../middleware/fileUpload');

/**
 * PRODUCTOS - CRUD Administrativo
 */

// GET - Obtener todos los productos con paginación
router.get('/productos', verificarAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Obtener productos
    const [productos] = await db.promise().query(
      'SELECT * FROM productos WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    // Obtener total de productos
    const [[{ total }]] = await db.promise().query(
      'SELECT COUNT(*) as total FROM productos WHERE deleted_at IS NULL'
    );

    res.json({
      data: productos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error GET /admin/productos:', error);
    res.status(500).json({ error: 'Error al obtener productos', mensaje: error.message });
  }
});

// GET - Obtener un producto por ID
router.get('/productos/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [[producto]] = await db.promise().query(
      'SELECT * FROM productos WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto', mensaje: error.message });
  }
});

// POST - Crear nuevo producto con imagen
router.post('/productos', 
  verificarAdmin,
  uploadProductos.single('imagen'),
  handleUploadError,
  validarProducto,
  async (req, res) => {
    try {
      const { nombre, precio, stock, descripcion, categoria } = req.body;

      // Validar que se subió imagen
      if (!req.file) {
        return res.status(400).json({ 
          error: 'Imagen requerida',
          mensaje: 'Debe proporcionar una imagen para el producto' 
        });
      }

      const imagenUrl = `/uploads/productos/${req.file.filename}`;

      // Insertar producto en BD
      const [result] = await db.promise().query(
        'INSERT INTO productos (nombre, precio, stock, descripcion, categoria, imagen, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [nombre, parseFloat(precio), parseInt(stock), descripcion || null, categoria, imagenUrl]
      );

      // Registrar auditoría
      await db.promise().query(
        'INSERT INTO auditorias (usuario_id, entidad, entidad_id, accion, cambios) VALUES (?, ?, ?, ?, ?)',
        [req.usuario_id, 'productos', result.insertId, 'crear', JSON.stringify({ nombre, precio, stock, categoria })]
      );

      res.status(201).json({
        id: result.insertId,
        nombre,
        precio,
        stock,
        categoria,
        imagen: imagenUrl,
        mensaje: 'Producto creado exitosamente'
      });
    } catch (error) {
      console.error('Error POST /admin/productos:', error);
      // Eliminar imagen si ocurrió un error
      if (req.file) {
        deleteImage(req.file.filename).catch(() => {});
      }
      res.status(500).json({ error: 'Error al crear producto', mensaje: error.message });
    }
  }
);

// PUT - Actualizar producto
router.put('/productos/:id',
  verificarAdmin,
  uploadProductos.single('imagen'),
  handleUploadError,
  validarProducto,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, precio, stock, descripcion, categoria } = req.body;

      // Obtener producto actual
      const [[producto]] = await db.promise().query(
        'SELECT * FROM productos WHERE id = ? AND deleted_at IS NULL',
        [id]
      );

      if (!producto) {
        if (req.file) deleteImage(req.file.filename).catch(() => {});
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Manejar nueva imagen
      let imagenUrl = producto.imagen;
      if (req.file) {
        // Eliminar imagen anterior
        const oldFilename = producto.imagen.split('/').pop();
        deleteImage(oldFilename).catch(() => {});
        imagenUrl = `/uploads/productos/${req.file.filename}`;
      }

      // Actualizar producto
      await db.promise().query(
        'UPDATE productos SET nombre = ?, precio = ?, stock = ?, descripcion = ?, categoria = ?, imagen = ?, updated_at = NOW() WHERE id = ?',
        [nombre, parseFloat(precio), parseInt(stock), descripcion || null, categoria, imagenUrl, id]
      );

      // Registrar auditoría
      const cambios = {
        nombre: { antes: producto.nombre, despues: nombre },
        precio: { antes: producto.precio, despues: precio },
        stock: { antes: producto.stock, despues: stock }
      };
      await db.promise().query(
        'INSERT INTO auditorias (usuario_id, entidad, entidad_id, accion, cambios) VALUES (?, ?, ?, ?, ?)',
        [req.usuario_id, 'productos', id, 'actualizar', JSON.stringify(cambios)]
      );

      res.json({
        id,
        nombre,
        precio,
        stock,
        categoria,
        imagen: imagenUrl,
        mensaje: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error PUT /admin/productos/:id:', error);
      if (req.file) deleteImage(req.file.filename).catch(() => {});
      res.status(500).json({ error: 'Error al actualizar producto', mensaje: error.message });
    }
  }
);

// DELETE - Eliminar producto (soft delete)
router.delete('/productos/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [[producto]] = await db.promise().query(
      'SELECT * FROM productos WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Soft delete - marcar como eliminado
    await db.promise().query(
      'UPDATE productos SET deleted_at = NOW() WHERE id = ?',
      [id]
    );

    // Registrar auditoría
    await db.promise().query(
      'INSERT INTO auditorias (usuario_id, entidad, entidad_id, accion, cambios) VALUES (?, ?, ?, ?, ?)',
      [req.usuario_id, 'productos', id, 'eliminar', JSON.stringify({ nombre: producto.nombre })]
    );

    res.json({ 
      mensaje: 'Producto eliminado exitosamente',
      id
    });
  } catch (error) {
    console.error('Error DELETE /admin/productos/:id:', error);
    res.status(500).json({ error: 'Error al eliminar producto', mensaje: error.message });
  }
});

/**
 * VENTAS - Gestión Administrativa
 */

// GET - Obtener todas las ventas
router.get('/ventas', verificarAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const estado = req.query.estado; // opcional: filtrar por estado

    let query = `
      SELECT v.*, u.nombre as usuario_nombre, u.email, u.telefono,
             COUNT(dv.id) as items_count
      FROM ventas v
      LEFT JOIN usuarios u ON v.usuario_id = u.id
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
    `;
    const params = [];

    if (estado) {
      query += ' WHERE v.estado = ?';
      params.push(estado);
    }

    query += ' GROUP BY v.id ORDER BY v.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [ventas] = await db.promise().query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM ventas';
    if (estado) {
      countQuery += ' WHERE estado = ?';
    }
    const countParams = estado ? [estado] : [];
    const [[{ total }]] = await db.promise().query(countQuery, countParams);

    res.json({
      data: ventas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error GET /admin/ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas', mensaje: error.message });
  }
});

// GET - Obtener detalle de una venta
router.get('/ventas/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener venta main
    const [[venta]] = await db.promise().query(
      `SELECT v.*, u.nombre, u.email, u.telefono, u.direccion
       FROM ventas v
       LEFT JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.id = ?`,
      [id]
    );

    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Obtener items de la venta
    const [items] = await db.promise().query(
      `SELECT dv.*, p.nombre as producto_nombre, p.imagen
       FROM detalle_ventas dv
       LEFT JOIN productos p ON dv.producto_id = p.id
       WHERE dv.venta_id = ?`,
      [id]
    );

    // Obtener envío si existe
    const [[envio]] = await db.promise().query(
      'SELECT * FROM envios WHERE venta_id = ?',
      [id]
    );

    // Obtener factura si existe
    const [[factura]] = await db.promise().query(
      'SELECT * FROM facturas WHERE venta_id = ?',
      [id]
    );

    res.json({
      ...venta,
      items,
      envio,
      factura
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener venta', mensaje: error.message });
  }
});

// PUT - Actualizar estado de venta
router.put('/ventas/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'procesada', 'enviada', 'entregada', 'cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido',
        mensaje: `Estado debe ser uno de: ${estadosValidos.join(', ')}`
      });
    }

    const [[venta]] = await db.promise().query('SELECT * FROM ventas WHERE id = ?', [id]);
    if (!venta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    await db.promise().query('UPDATE ventas SET estado = ?, updated_at = NOW() WHERE id = ?', [estado, id]);

    // Registrar auditoría
    await db.promise().query(
      'INSERT INTO auditorias (usuario_id, entidad, entidad_id, accion, cambios) VALUES (?, ?, ?, ?, ?)',
      [req.usuario_id, 'ventas', id, 'actualizar', JSON.stringify({ estado_anterior: venta.estado, estado_nuevo: estado })]
    );

    res.json({ 
      id,
      estado,
      mensaje: 'Estado de venta actualizado'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar venta', mensaje: error.message });
  }
});

/**
 * REPORTES Y ESTADÍSTICAS
 */

// GET - Resumen general (Dashboard)
router.get('/reportes/resumen', verificarAdmin, async (req, res) => {
  try {
    // Ingresos totales
    const [[{ ingresos_totales = 0 }]] = await db.promise().query(
      'SELECT SUM(total) as ingresos_totales FROM ventas WHERE estado != "cancelada"'
    );

    // Total de ventas
    const [[{ total_ventas = 0 }]] = await db.promise().query(
      'SELECT COUNT(*) as total_ventas FROM ventas WHERE estado != "cancelada"'
    );

    // Total de productos
    const [[{ total_productos = 0 }]] = await db.promise().query(
      'SELECT COUNT(*) as total_productos FROM productos WHERE deleted_at IS NULL'
    );

    // Total de clientes
    const [[{ total_clientes = 0 }]] = await db.promise().query(
      'SELECT COUNT(*) as total_clientes FROM usuarios WHERE rol = "usuario"'
    );

    // Venta promedio
    const [[{ venta_promedio = 0 }]] = await db.promise().query(
      'SELECT AVG(total) as venta_promedio FROM ventas WHERE estado != "cancelada"'
    );

    // Stock bajo (< 10 unidades)
    const [productos_bajo_stock] = await db.promise().query(
      'SELECT id, nombre, stock FROM productos WHERE deleted_at IS NULL AND stock < 10 ORDER BY stock ASC LIMIT 5'
    );

    res.json({
      ingresos_totales: parseFloat(ingresos_totales),
      total_ventas,
      total_productos,
      total_clientes,
      venta_promedio: parseFloat(venta_promedio),
      productos_bajo_stock
    });
  } catch (error) {
    console.error('Error GET /admin/reportes/resumen:', error);
    res.status(500).json({ error: 'Error al obtener resumen', mensaje: error.message });
  }
});

// GET - Ventas por periodo (día, semana, mes)
router.get('/reportes/ventas-por-periodo', verificarAdmin, async (req, res) => {
  try {
    const periodo = req.query.periodo || 'mes'; // dia, semana, mes

    let groupBy;
    if (periodo === 'dia') {
      groupBy = "DATE(v.created_at)";
    } else if (periodo === 'semana') {
      groupBy = "WEEK(v.created_at)";
    } else {
      groupBy = "MONTH(v.created_at)";
    }

    const [ventas] = await db.promise().query(`
      SELECT 
        ${groupBy} as fecha,
        COUNT(*) as ventas,
        SUM(total) as ingresos,
        AVG(total) as promedio
      FROM ventas
      WHERE estado != 'cancelada'
      GROUP BY ${groupBy}
      ORDER BY fecha DESC
      LIMIT 30
    `);

    res.json({
      periodo,
      data: ventas.map(v => ({
        fecha: v.fecha,
        cantidad: v.ventas,
        total: parseFloat(v.ingresos),
        promedio: parseFloat(v.promedio)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes', mensaje: error.message });
  }
});

/**
 * CLIENTES
 */

// GET - Obtener todos los clientes
router.get('/clientes', verificarAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [clientes] = await db.promise().query(`
      SELECT u.*, COUNT(v.id) as total_compras, SUM(v.total) as total_gastado
      FROM usuarios u
      LEFT JOIN ventas v ON u.id = v.usuario_id AND v.estado != 'cancelada'
      WHERE u.rol = 'usuario'
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [[{ total }]] = await db.promise().query(
      'SELECT COUNT(*) as total FROM usuarios WHERE rol = "usuario"'
    );

    res.json({
      data: clientes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes', mensaje: error.message });
  }
});

/**
 * CUPONES/DESCUENTOS
 */

// POST - Crear nuevo cupón
router.post('/cupones', verificarAdmin, validarCupon, async (req, res) => {
  try {
    const { codigo, descripcion, tipo, valor, stock, valido_desde, valido_hasta } = req.body;

    const [result] = await db.promise().query(`
      INSERT INTO cupones 
      (codigo, descripcion, tipo, valor, stock, valido_desde, valido_hasta, activo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, NOW())
    `, [codigo.toUpperCase(), descripcion, tipo, parseFloat(valor), stock || null, valido_desde, valido_hasta]);

    res.status(201).json({
      id: result.insertId,
      codigo: codigo.toUpperCase(),
      tipo,
      valor,
      mensaje: 'Cupón creado exitosamente'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El código de cupón ya existe' });
    }
    res.status(500).json({ error: 'Error al crear cupón', mensaje: error.message });
  }
});

module.exports = router;
