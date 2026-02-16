const pool = require('../config/database');

// GET todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [productos] = await conn.query('SELECT * FROM productos WHERE deleted_at IS NULL');
    conn.release();
    
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    const [producto] = await conn.query('SELECT * FROM productos WHERE id = ? AND deleted_at IS NULL', [id]);
    conn.release();

    if (producto.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST crear producto (solo admin)
const crearProducto = async (req, res) => {
  try {
    const { nombre, stock, precio, descripcion, imagen } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }

    const conn = await pool.getConnection();
    const [result] = await conn.query(
      'INSERT INTO productos (nombre, stock, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?)',
      [nombre, stock || 0, precio, descripcion || '', imagen || '']
    );
    conn.release();

    res.status(201).json({
      id: result.insertId,
      nombre,
      stock: stock || 0,
      precio,
      descripcion: descripcion || '',
      imagen: imagen || ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT actualizar producto (solo admin)
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, stock, precio, descripcion, imagen } = req.body;

    const conn = await pool.getConnection();
    
    await conn.query(
      'UPDATE productos SET nombre = COALESCE(?, nombre), stock = COALESCE(?, stock), precio = COALESCE(?, precio), descripcion = COALESCE(?, descripcion), imagen = COALESCE(?, imagen), updated_at = NOW() WHERE id = ?',
      [nombre, stock, precio, descripcion, imagen, id]
    );
    
    const [producto] = await conn.query('SELECT * FROM productos WHERE id = ?', [id]);
    conn.release();

    res.json(producto[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE producto (soft delete)
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    
    await conn.query('UPDATE productos SET deleted_at = NOW() WHERE id = ?', [id]);
    conn.release();

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
