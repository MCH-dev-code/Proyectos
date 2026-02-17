const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar que el usuario es administrador
 * Requiere que el usuario esté autenticado y tenga rol 'admin'
 */
const verificarAdmin = async (req, res, next) => {
  try {
    // Obtener token del header Authorization: Bearer token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No autorizado',
        mensaje: 'Token no proporcionado' 
      });
    }

    const token = authHeader.substring(7); // Eliminar "Bearer "
    
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario tenga rol admin
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        mensaje: 'Se requiere rol de administrador' 
      });
    }

    // Guardar información del usuario en la request
    req.usuario_id = decoded.usuario_id;
    req.rol = decoded.rol;
    req.nombre = decoded.nombre;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Sesión expirada',
        mensaje: 'El token ha expirado' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'No autorizado',
        mensaje: 'Token inválido' 
      });
    }

    return res.status(500).json({ 
      error: 'Error interno',
      mensaje: error.message 
    });
  }
};

/**
 * Middleware para permitir tanto usuarios como admins
 * (para rutas que ambos pueden acceder con diferentes permisos)
 */
const verificarAutenticacion = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No autorizado',
        mensaje: 'Token no proporcionado' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.usuario_id = decoded.usuario_id;
    req.rol = decoded.rol;
    req.nombre = decoded.nombre;
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'No autorizado',
      mensaje: 'Token inválido o expirado' 
    });
  }
};

module.exports = {
  verificarAdmin,
  verificarAutenticacion
};
