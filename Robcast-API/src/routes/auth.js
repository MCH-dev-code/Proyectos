const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');

// ================================================================
// POST /auth/login - Iniciar sesión
// ================================================================
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email no válido'),
  body('password')
    .notEmpty()
    .withMessage('Password es requerido')
], async (req, res) => {
  try {
    // Validar input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validación fallida',
        detalles: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Buscar usuario en BD
    const [usuarios] = await db.promise().query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ? AND deleted_at IS NULL',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        error: 'No autorizado',
        mensaje: 'Email o contraseña incorrectos'
      });
    }

    const usuario = usuarios[0];

    // Validar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({
        error: 'No autorizado',
        mensaje: 'Email o contraseña incorrectos'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_2024',
      { expiresIn: '24h' }
    );

    // Retornar token y datos usuario
    res.json({
      success: true,
      mensaje: 'Sesión iniciada correctamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      error: 'Error interno',
      mensaje: 'Ocurrió un error al procesar el login'
    });
  }
});

// ================================================================
// POST /auth/registro - Crear nueva cuenta (usuario regular)
// ================================================================
router.post('/registro', [
  body('nombre')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nombre debe tener mínimo 3 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email no válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Contraseña debe tener mínimo 6 caracteres'),
  body('telefono')
    .optional()
    .isMobilePhone()
    .withMessage('Teléfono no válido')
], async (req, res) => {
  try {
    // Validar input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validación fallida',
        detalles: errors.array()
      });
    }

    const { nombre, email, password, telefono } = req.body;

    // Verificar si usuario ya existe
    const [usuariosExistentes] = await db.promise().query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(400).json({
        error: 'Validación fallida',
        mensaje: 'El email ya está registrado'
      });
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const [resultado] = await db.promise().query(
      `INSERT INTO usuarios (nombre, email, password, telefono, rol, created_at)
       VALUES (?, ?, ?, ?, 'usuario', NOW())`,
      [nombre, email, passwordHash, telefono || null]
    );

    const usuarioId = resultado.insertId;

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuarioId,
        email: email,
        nombre: nombre,
        rol: 'usuario'
      },
      process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_2024',
      { expiresIn: '24h' }
    );

    // Retornar token y datos usuario
    res.status(201).json({
      success: true,
      mensaje: 'Cuenta creada correctamente',
      token,
      usuario: {
        id: usuarioId,
        nombre: nombre,
        email: email,
        rol: 'usuario'
      }
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      error: 'Error interno',
      mensaje: 'Ocurrió un error al crear la cuenta'
    });
  }
});

// ================================================================
// GET /auth/verificar - Verificar token actual
// ================================================================
router.get('/verificar', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'No autorizado',
        mensaje: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_2024'
    );

    res.json({
      success: true,
      mensaje: 'Token válido',
      usuario: decoded
    });

  } catch (error) {
    res.status(401).json({
      error: 'No autorizado',
      mensaje: 'Token inválido o expirado'
    });
  }
});

module.exports = router;
