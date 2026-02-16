const pool = require('../config/database');

// POST Crear venta/orden
const crearVenta = async (req, res) => {
  const conn = await pool.getConnection();
  
  try {
    const { items, total, direccion } = req.body;
    const usuario_id = req.usuario_id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Debe incluir al menos un producto' });
    }

    await conn.beginTransaction();

    // Crear venta
    const [resultVenta] = await conn.query(
      'INSERT INTO ventas (usuario_id, total, direccion, estado) VALUES (?, ?, ?, "Pendiente")',
      [usuario_id, total, direccion]
    );

    const venta_id = resultVenta.insertId;

    // Agregar detalles y actualizar stock
    for (const item of items) {
      // Verificar stock
      const [producto] = await conn.query('SELECT stock FROM productos WHERE id = ?', [item.producto_id]);
      
      if (producto.length === 0) {
        throw new Error(`Producto ${item.producto_id} no existe`);
      }

      if (producto[0].stock < item.cantidad) {
        throw new Error(`Stock insuficiente para producto ${item.producto_id}`);
      }

      // Insertar detalle
      await conn.query(
        'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [venta_id, item.producto_id, item.cantidad, item.precio_unitario]
      );

      // Actualizar stock
      await conn.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    // Agregar puntos al usuario (1 punto = 1 peso)
    const puntos = Math.floor(total);
    await conn.query(
      'UPDATE usuarios SET puntos = puntos + ? WHERE id = ?',
      [puntos, usuario_id]
    );

    await conn.commit();

    // Obtener datos de la venta creada
    const [venta] = await conn.query(`
      SELECT v.*, 
             JSON_ARRAYAGG(JSON_OBJECT('producto_id', dv.producto_id, 'cantidad', dv.cantidad, 'precio_unitario', dv.precio_unitario)) as items
      FROM ventas v
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
      WHERE v.id = ?
      GROUP BY v.id
    `, [venta_id]);

    res.status(201).json({
      mensaje: 'Orden creada exitosamente',
      venta: venta[0]
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// GET Órdenes del usuario
const obtenerOrdenes = async (req, res) => {
  try {
    const usuario_id = req.usuario_id;
    const conn = await pool.getConnection();

    const [ordenes] = await conn.query(`
      SELECT v.*, 
             JSON_ARRAYAGG(JSON_OBJECT(
               'producto_id', dv.producto_id,
               'nombre', p.nombre,
               'cantidad', dv.cantidad,
               'precio_unitario', dv.precio_unitario,
               'imagen', p.imagen
             )) as items
      FROM ventas v
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
      LEFT JOIN productos p ON dv.producto_id = p.id
      WHERE v.usuario_id = ?
      GROUP BY v.id
      ORDER BY v.created_at DESC
    `, [usuario_id]);

    conn.release();
    res.json(ordenes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET una orden por ID
const obtenerOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario_id;
    const conn = await pool.getConnection();

    const [orden] = await conn.query(`
      SELECT v.*,
             JSON_ARRAYAGG(JSON_OBJECT(
               'producto_id', dv.producto_id,
               'nombre', p.nombre,
               'cantidad', dv.cantidad,
               'precio_unitario', dv.precio_unitario,
               'imagen', p.imagen
             )) as items
      FROM ventas v
      LEFT JOIN detalle_ventas dv ON v.id = dv.venta_id
      LEFT JOIN productos p ON dv.producto_id = p.id
      WHERE v.id = ? AND v.usuario_id = ?
      GROUP BY v.id
    `, [id, usuario_id]);

    conn.release();

    if (orden.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(orden[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT Actualizar estado de orden (admin)
const actualizarEstadoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['Pendiente', 'En camino', 'Entregada', 'Cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const conn = await pool.getConnection();
    await conn.query('UPDATE ventas SET estado = ?, updated_at = NOW() WHERE id = ?', [estado, id]);

    const [orden] = await conn.query('SELECT * FROM ventas WHERE id = ?', [id]);
    conn.release();

    res.json({
      mensaje: 'Estado actualizado',
      orden: orden[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Estadísticas de ventas (admin)
const obtenerEstadisticas = async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [stats] = await conn.query(`
      SELECT
        COUNT(*) as total_ventas,
        SUM(total) as ingresos_totales,
        AVG(total) as ticket_promedio,
        COUNT(DISTINCT usuario_id) as clientes_unicos
      FROM ventas
      WHERE estado != 'Cancelada'
    `);

    const [ventasPorEstado] = await conn.query(`
      SELECT estado, COUNT(*) as cantidad
      FROM ventas
      GROUP BY estado
    `);

    conn.release();

    res.json({
      resumen: stats[0],
      por_estado: ventasPorEstado
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  crearVenta,
  obtenerOrdenes,
  obtenerOrdenPorId,
  actualizarEstadoOrden,
  obtenerEstadisticas
};
