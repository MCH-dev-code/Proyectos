-- ================================================================
-- MIGRACIONES PARA ROBCAST - NUEVAS TABLAS Y COLUMNAS
-- ================================================================
-- Ejecutar estas queries en la BD para agregar nuevas funcionalidades

-- 1. AGREGAR COLUMNA ROL A TABLA USUARIOS
-- ================================================================
ALTER TABLE usuarios ADD COLUMN rol ENUM('usuario', 'admin', 'vendedor') DEFAULT 'usuario' AFTER email;

-- Crear índice para consultas rápidas por rol
ALTER TABLE usuarios ADD INDEX idx_rol (rol);

-- Crear usuario admin inicial
-- IMPORTANTE: Cambiar estas credenciales en producción
-- Password: admin123 (hashed con bcrypt)
INSERT INTO usuarios (nombre, email, password, rol, telefono, created_at) 
VALUES (
  'Administrador',
  'admin@robcast.com.do',
  '$2b$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP', -- REEMPLAZAR CON HASH BCRYPT
  'admin',
  '+1-809-000-0000',
  NOW()
) ON DUPLICATE KEY UPDATE rol = 'admin';

-- 2. TABLA DE CUPONES/DESCUENTOS
-- ================================================================
CREATE TABLE IF NOT EXISTS cupones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  tipo ENUM('porcentaje', 'monto_fijo') DEFAULT 'porcentaje' NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT NULL COMMENT 'NULL = uso ilimitado',
  usado INT DEFAULT 0,
  valido_desde DATETIME,
  valido_hasta DATETIME,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_codigo (codigo),
  INDEX idx_activo (activo),
  INDEX idx_valido_desde (valido_desde),
  INDEX idx_valido_hasta (valido_hasta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA DE ENVÍOS
-- ================================================================
CREATE TABLE IF NOT EXISTS envios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL UNIQUE,
  numero_seguimiento VARCHAR(100) UNIQUE,
  empresa_envio VARCHAR(100),
  estado ENUM('pendiente', 'en_transito', 'entregado', 'devuelto', 'cancelado') DEFAULT 'pendiente',
  fecha_envio DATETIME,
  fecha_entrega_estimada DATETIME,
  fecha_entrega DATETIME,
  direccion TEXT,
  coordinador VARCHAR(255),
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  INDEX idx_numero_seguimiento (numero_seguimiento),
  INDEX idx_estado (estado),
  INDEX idx_venta_id (venta_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA DE FACTURAS
-- ================================================================
CREATE TABLE IF NOT EXISTS facturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL UNIQUE,
  numero_factura VARCHAR(50) UNIQUE,
  fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
  subtotal DECIMAL(10, 2),
  descuento DECIMAL(10, 2) DEFAULT 0,
  impuesto DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2),
  archivo_pdf VARCHAR(255),
  estado ENUM('borrador', 'emitida', 'anulada') DEFAULT 'borrador',
  empresa_nombre VARCHAR(255),
  empresa_cedula VARCHAR(50),
  empresa_telefono VARCHAR(20),
  empresa_email VARCHAR(100),
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  INDEX idx_numero_factura (numero_factura),
  INDEX idx_estado (estado),
  INDEX idx_venta_id (venta_id),
  INDEX idx_fecha_emision (fecha_emision)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA DE AUDITORÍA
-- ================================================================
CREATE TABLE IF NOT EXISTS auditorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  usuario_nombre VARCHAR(255),
  entidad VARCHAR(100) NOT NULL COMMENT 'productos, usuarios, ventas, etc',
  entidad_id INT NOT NULL,
  accion ENUM('crear', 'actualizar', 'eliminar', 'leer') NOT NULL,
  cambios JSON COMMENT 'Detalles de lo que cambió',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_entidad (entidad),
  INDEX idx_accion (accion),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. AGREGAR COLUMNAS A TABLA PRODUCTOS PARA MEJORES FUNCIONALIDADES
-- ================================================================
ALTER TABLE productos ADD COLUMN stock_minimo INT DEFAULT 10 AFTER stock;
ALTER TABLE productos ADD COLUMN activo BOOLEAN DEFAULT TRUE AFTER stock_minimo;
ALTER TABLE productos ADD COLUMN peso DECIMAL(8, 2) AFTER activo COMMENT 'en kg';
ALTER TABLE productos ADD COLUMN dimensiones VARCHAR(100) AFTER peso COMMENT '(Alto x Ancho x Profundo)';
ALTER TABLE productos ADD COLUMN proveedor VARCHAR(255) AFTER dimensiones;
ALTER TABLE productos ADD COLUMN costo_unitario DECIMAL(10, 2) AFTER proveedor;

-- Agregar índices para mejor rendimiento
ALTER TABLE productos ADD INDEX idx_categoria (categoria);
ALTER TABLE productos ADD INDEX idx_precio (precio);
ALTER TABLE productos ADD INDEX idx_stock (stock);
ALTER TABLE productos ADD INDEX idx_activo (activo);

-- 7. AGREGAR COLUMNAS A TABLA VENTAS PARA RASTREO
-- ================================================================
ALTER TABLE ventas ADD COLUMN comprador_nombre VARCHAR(255) AFTER usuario_id;
ALTER TABLE ventas ADD COLUMN comprador_email VARCHAR(100) AFTER comprador_nombre;
ALTER TABLE ventas ADD COLUMN comprador_telefono VARCHAR(20) AFTER comprador_email;
ALTER TABLE ventas ADD COLUMN codigo_seguimiento VARCHAR(100) UNIQUE AFTER estado;
ALTER TABLE ventas ADD COLUMN cupon_codigo VARCHAR(50) AFTER codigo_seguimiento;
ALTER TABLE ventas ADD COLUMN descuento DECIMAL(10, 2) DEFAULT 0 AFTER cupon_codigo;
ALTER TABLE ventas ADD COLUMN metodo_pago ENUM('tarjeta', 'transferencia', 'efectivo', 'otro') DEFAULT 'tarjeta' AFTER descuento;
ALTER TABLE ventas ADD COLUMN notas TEXT AFTER metodo_pago;
ALTER TABLE ventas ADD COLUMN actualizado_por INT AFTER notas;
ALTER TABLE ventas ADD COLUMN actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER actualizado_por;

ALTER TABLE ventas ADD INDEX idx_usuario_id (usuario_id);
ALTER TABLE ventas ADD INDEX idx_estado (estado);
ALTER TABLE ventas ADD INDEX idx_codigo_seguimiento (codigo_seguimiento);
ALTER TABLE ventas ADD INDEX idx_created_at (created_at);
ALTER TABLE ventas ADD FOREIGN KEY (actualizado_por) REFERENCES usuarios(id) ON DELETE SET NULL;

-- 8. AGREGAR COLUMNAS A TABLA USUARIOS
-- ================================================================
ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255) AFTER email;
ALTER TABLE usuarios ADD COLUMN ultimo_acceso DATETIME AFTER foto_perfil;
ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT TRUE AFTER ultimo_acceso;

ALTER TABLE usuarios ADD INDEX idx_email (email);
ALTER TABLE usuarios ADD INDEX idx_activo (activo);

-- 9. CREAR TABLA DE REVIEWS/VALORACIONES
-- ================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  venta_id INT,
  calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  titulo VARCHAR(255),
  comentario TEXT,
  fotos JSON,
  fecha_compra DATE,
  fue_verificada BOOLEAN DEFAULT TRUE,
  utiles INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_product (usuario_id, producto_id),
  INDEX idx_producto_id (producto_id),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_calificacion (calificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. CREAR TABLA DE PROMOCIONES
-- ================================================================
CREATE TABLE IF NOT EXISTS promociones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo ENUM('porcentaje', 'monto_fijo', 'compre_lleve') DEFAULT 'porcentaje',
  valor DECIMAL(10, 2) NOT NULL,
  minimo_compra DECIMAL(10, 2) DEFAULT 0,
  valido_desde DATETIME NOT NULL,
  valido_hasta DATETIME NOT NULL,
  aplicar_a ENUM('todos', 'categoria', 'producto') DEFAULT 'todos',
  categoria_id INT,
  producto_id INT,
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_categoria_id (categoria_id),
  INDEX idx_producto_id (producto_id),
  INDEX idx_activa (activa),
  INDEX idx_valido_desde (valido_desde)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- FIN DE LAS MIGRACIONES
-- ================================================================
