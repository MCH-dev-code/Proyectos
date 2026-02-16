const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const productosController = require('../controllers/productosController');

// Rutas públicas
router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProductoPorId);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, productosController.crearProducto);
router.put('/:id', verificarToken, productosController.actualizarProducto);
router.delete('/:id', verificarToken, productosController.eliminarProducto);

module.exports = router;
