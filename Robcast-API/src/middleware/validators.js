const { body, validationResult } = require('express-validator');

/**
 * Validadores para productos
 */
const validarProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('precio')
    .notEmpty().withMessage('El precio es requerido')
    .isFloat({ min: 0.01 }).withMessage('El precio debe ser un número positivo'),
  
  body('stock')
    .notEmpty().withMessage('El stock es requerido')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo'),
  
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('categoria')
    .trim()
    .notEmpty().withMessage('La categoría es requerida')
    .isLength({ min: 2 }).withMessage('La categoría debe tener al menos 2 caracteres'),
  
  // Middleware para capturar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validación fallida',
        errores: errors.array().map(err => ({
          campo: err.param,
          mensaje: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validadores para crear venta
 */
const validarVenta = [
  body('usuario_id')
    .notEmpty().withMessage('usuario_id es requerido')
    .isInt().withMessage('usuario_id debe ser un número'),
  
  body('items')
    .notEmpty().withMessage('items es requerido')
    .isArray({ min: 1 }).withMessage('Debe haber al menos 1 item en la venta'),
  
  body('items.*.producto_id')
    .notEmpty().withMessage('producto_id es requerido')
    .isInt().withMessage('producto_id debe ser un número'),
  
  body('items.*.cantidad')
    .notEmpty().withMessage('cantidad es requerida')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero positivo'),
  
  body('direccion')
    .trim()
    .notEmpty().withMessage('La dirección es requerida')
    .isLength({ min: 5 }).withMessage('La dirección debe tener al menos 5 caracteres'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validación fallida',
        errores: errors.array().map(err => ({
          campo: err.param,
          mensaje: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validadores para registro de usuario
 */
const validarRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .toLowerCase(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),
  
  body('telefono')
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage('Teléfono inválido'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validación fallida',
        errores: errors.array().map(err => ({
          campo: err.param,
          mensaje: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validadores para login
 */
const validarLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .toLowerCase(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validación fallida',
        errores: errors.array().map(err => ({
          campo: err.param,
          mensaje: err.msg
        }))
      });
    }
    next();
  }
];

/**
 * Validadores para cupón
 */
const validarCupon = [
  body('codigo')
    .trim()
    .notEmpty().withMessage('El código de cupón es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El código debe tener entre 3 y 50 caracteres'),
  
  body('tipo')
    .notEmpty().withMessage('El tipo es requerido')
    .isIn(['porcentaje', 'monto_fijo']).withMessage('El tipo debe ser "porcentaje" o "monto_fijo"'),
  
  body('valor')
    .notEmpty().withMessage('El valor es requerido')
    .isFloat({ min: 0.01 }).withMessage('El valor debe ser positivo'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validación fallida',
        errores: errors.array().map(err => ({
          campo: err.param,
          mensaje: err.msg
        }))
      });
    }
    next();
  }
];

module.exports = {
  validarProducto,
  validarVenta,
  validarRegistro,
  validarLogin,
  validarCupon
};
