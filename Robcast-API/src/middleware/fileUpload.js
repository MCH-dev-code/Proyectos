const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Configuración de multer para subida de imágenes
 * Almacena imágenes en /uploads/productos/
 * Única para productos solamente
 */

// Crear directorio de uploads si no existe
const uploadDir = path.join(__dirname, '../../uploads/productos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Configuración de almacenamiento en disco
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp_id_random_originalname
    const uniqueName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

/**
 * Validar tipos de archivo permitidos
 */
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes en formato JPEG, PNG, WebP o GIF'));
  }
};

/**
 * Instancia de multer para productos
 */
const uploadProductos = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

/**
 * Middleware para manejar errores de multer
 */
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'Archivo muy grande',
        mensaje: 'El tamaño máximo permitido es 5MB' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Demasiados archivos',
        mensaje: 'Solo se permite 1 archivo por vez' 
      });
    }
  }
  
  if (err) {
    return res.status(400).json({ 
      error: 'Error en subida',
      mensaje: err.message 
    });
  }

  next();
};

/**
 * Función para obtener URL pública de imagen
 * @param {string} filename - Nombre del archivo subido
 * @param {string} baseUrl - URL base del servidor (ej: http://localhost:3001)
 * @returns {string} URL pública completa
 */
const getImageUrl = (filename, baseUrl) => {
  return `${baseUrl}/uploads/productos/${filename}`;
};

/**
 * Función para eliminar imagen del disco
 * @param {string} filename - Nombre del archivo a eliminar
 */
const deleteImage = (filename) => {
  const filePath = path.join(uploadDir, filename);
  
  // Verificar que no intenten acceder fuera de /uploads/productos
  if (!filePath.startsWith(uploadDir)) {
    throw new Error('Ruta inválida');
  }

  // Habilitar si el archivo existe
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  uploadProductos,
  handleUploadError,
  getImageUrl,
  deleteImage,
  uploadDir
};
