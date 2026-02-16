const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const usuariosController = require('../controllers/usuariosController');

// Rutas públicas
router.post('/registrarse', usuariosController.registrarse);
router.post('/iniciar-sesion', usuariosController.iniciarSesion);

// Rutas protegidas
router.get('/perfil', verificarToken, usuariosController.obtenerPerfil);
router.put('/perfil', verificarToken, usuariosController.actualizarPerfil);

module.exports = router;
