const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const ventasController = require('../controllers/ventasController');

// Rutas protegidas (usuario autenticado)
router.post('/', verificarToken, ventasController.crearVenta);
router.get('/', verificarToken, ventasController.obtenerOrdenes);
router.get('/:id', verificarToken, ventasController.obtenerOrdenPorId);

// Rutas admin
router.put('/:id/estado', verificarToken, ventasController.actualizarEstadoOrden);
router.get('/reportes/estadisticas', verificarToken, ventasController.obtenerEstadisticas);

module.exports = router;
