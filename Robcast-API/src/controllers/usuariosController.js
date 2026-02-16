const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { generarToken } = require('../middleware/auth');

// POST Registrarse
const registrarse = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    const conn = await pool.getConnection();

    // Verificar si email existe
    const [existe] = await conn.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      conn.release();
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash de contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const [result] = await conn.query(
      'INSERT INTO usuarios (nombre, email, password, telefono, puntos) VALUES (?, ?, ?, ?, 0)',
      [nombre, email, passwordHash, telefono || '']
    );

    const usuarioId = result.insertId;
    const token = generarToken(usuarioId);

    const [usuario] = await conn.query('SELECT id, nombre, email, telefono, puntos, fecha_registro FROM usuarios WHERE id = ?', [usuarioId]);
    conn.release();

    res.status(201).json({
      usuario: usuario[0],
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST Iniciar sesión
const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const conn = await pool.getConnection();
    const [usuarios] = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (usuarios.length === 0) {
      conn.release();
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const usuario = usuarios[0];
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      conn.release();
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const token = generarToken(usuario.id);

    const [usuarioData] = await conn.query(
      'SELECT id, nombre, email, telefono, puntos, direccion, metodo_pago, fecha_registro FROM usuarios WHERE id = ?',
      [usuario.id]
    );
    conn.release();

    res.json({
      usuario: usuarioData[0],
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET Perfil del usuario
const obtenerPerfil = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [usuario] = await conn.query(
      'SELECT id, nombre, email, telefono, dirección, metodo_pago, puntos, fecha_registro FROM usuarios WHERE id = ?',
      [req.usuario_id]
    );
    conn.release();

    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT Actualizar perfil
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, telefono, direccion, metodo_pago } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
      'UPDATE usuarios SET nombre = COALESCE(?, nombre), telefono = COALESCE(?, telefono), direccion = COALESCE(?, direccion), metodo_pago = COALESCE(?, metodo_pago), updated_at = NOW() WHERE id = ?',
      [nombre, telefono, direccion, metodo_pago, req.usuario_id]
    );

    const [usuario] = await conn.query(
      'SELECT id, nombre, email, telefono, direccion, metodo_pago, puntos FROM usuarios WHERE id = ?',
      [req.usuario_id]
    );
    conn.release();

    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: usuario[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registrarse,
  iniciarSesion,
  obtenerPerfil,
  actualizarPerfil
};
