-- ================================================================
-- ROBCAST - SCRIPT DE INICIALIZACIÓN DATABASE
-- ================================================================
-- Ejecutado automáticamente al crear el contenedor MariaDB
-- Crea todas las tablas necesarias para tienda + panel

-- ================================================================
-- TABLA: USUARIOS (Clientes y Administradores)
-- ================================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion VARCHAR(255),
  ciudad VARCHAR(100),
  estado VARCHAR(50),
  codigo_postal VARCHAR(20),
  rol ENUM('admin', 'usuario') DEFAULT 'usuario',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: CATEGORÍAS
-- ================================================================
CREATE TABLE IF NOT EXISTS categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  imagen VARCHAR(255),
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: PRODUCTOS
-- ================================================================
CREATE TABLE IF NOT EXISTS productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  sku VARCHAR(50) UNIQUE,
  precio DECIMAL(10, 2) NOT NULL,
  precio_oferta DECIMAL(10, 2),
  stock INT DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  descripcion LONGTEXT,
  especificaciones JSON,
  categoria_id INT,
  imagen VARCHAR(255),
  galeria JSON,
  activo BOOLEAN DEFAULT TRUE,
  visible_tienda BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  INDEX idx_nombre (nombre),
  INDEX idx_categoria (categoria_id),
  INDEX idx_stock (stock),
  FULLTEXT idx_busqueda (nombre, descripcion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: CARRITO (Temporal)
-- ================================================================
CREATE TABLE IF NOT EXISTS carrito (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id),
  UNIQUE KEY unique_carrito (usuario_id, producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: VENTAS (Órdenes)
-- ================================================================
CREATE TABLE IF NOT EXISTS ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  usuario_id INT,
  numero_pedido VARCHAR(50) UNIQUE,
  subtotal DECIMAL(10, 2) NOT NULL,
  impuesto DECIMAL(10, 2) DEFAULT 0,
  descuento DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('pendiente', 'procesada', 'enviada', 'entregada', 'cancelada') DEFAULT 'pendiente',
  metodo_pago VARCHAR(50),
  comentarios TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  INDEX idx_cliente (cliente_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: DETALLE VENTAS (Ítems en orden)
-- ================================================================
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id),
  INDEX idx_venta (venta_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: CUPONES Y DESCUENTOS
-- ================================================================
CREATE TABLE IF NOT EXISTS cupones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  tipo ENUM('porcentaje', 'monto') DEFAULT 'porcentaje',
  valor DECIMAL(10, 2) NOT NULL,
  minimo_compra DECIMAL(10, 2) DEFAULT 0,
  stock INT,
  usos_restantes INT,
  valido_desde DATE,
  valido_hasta DATE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_codigo (codigo),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: ENVÍOS
-- ================================================================
CREATE TABLE IF NOT EXISTS envios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venta_id INT NOT NULL UNIQUE,
  transportista VARCHAR(100),
  numero_seguimiento VARCHAR(100) UNIQUE,
  direccion_entrega VARCHAR(255) NOT NULL,
  estado_envio ENUM('preparando', 'enviado', 'en_transito', 'entregado', 'fallido') DEFAULT 'preparando',
  fecha_envio TIMESTAMP NULL,
  fecha_entrega_estimada DATE,
  fecha_entrega_real TIMESTAMP NULL,
  costo_envio DECIMAL(10, 2) DEFAULT 0,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  INDEX idx_estado (estado_envio),
  INDEX idx_seguimiento (numero_seguimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: FACTURAS
-- ================================================================
CREATE TABLE IF NOT EXISTS facturas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venta_id INT NOT NULL UNIQUE,
  numero_factura VARCHAR(50) UNIQUE,
  tipo_factura ENUM('factura', 'proforma', 'nota_credito') DEFAULT 'factura',
  ruc_empresa VARCHAR(20),
  razon_social VARCHAR(255),
  monto_total DECIMAL(10, 2) NOT NULL,
  estado_pago ENUM('pendiente', 'pagada', 'parcial') DEFAULT 'pendiente',
  fecha_pago TIMESTAMP NULL,
  metodo_pago_usado VARCHAR(50),
  referencia_pago VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: AUDITORÍA (Log de cambios)
-- ================================================================
CREATE TABLE IF NOT EXISTS auditorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  entidad VARCHAR(50) NOT NULL,
  entidad_id INT,
  accion VARCHAR(50) NOT NULL,
  cambios JSON,
  direccion_ip VARCHAR(15),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_entidad (entidad),
  INDEX idx_usuario (usuario_id),
  INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: CONTACTOS/SOLICITUDES
-- ================================================================
CREATE TABLE IF NOT EXISTS contactos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  asunto VARCHAR(255) NOT NULL,
  mensaje LONGTEXT NOT NULL,
  estado ENUM('nuevo', 'leido', 'respondido', 'cerrado') DEFAULT 'nuevo',
  respuesta LONGTEXT,
  respondido_por INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (respondido_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_estado (estado),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLA: COMENTARIOS Y RATINGS
-- ================================================================
CREATE TABLE IF NOT EXISTS comentarios_producto (
  id INT PRIMARY KEY AUTO_INCREMENT,
  producto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  venta_id INT,
  titulo VARCHAR(200) NOT NULL,
  contenido LONGTEXT NOT NULL,
  calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
  fotos JSON,
  util INT DEFAULT 0,
  estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE SET NULL,
  INDEX idx_producto (producto_id),
  INDEX idx_calificacion (calificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- INSERTS INICIALES
-- ================================================================

-- Admin por defecto (contraseña: admin123)
INSERT IGNORE INTO usuarios (nombre, email, password, telefono, rol, activo)
VALUES (
  'Administrador',
  'admin@robcast.com.do',
  '$2b$10$bT9T..4YoSuuGb1nJAuDt.OKIK7MdhLOYic3ILNIy0DbdGePHxXRy',
  '+1-809-123-4567',
  'admin',
  TRUE
);

-- Categorías básicas
INSERT IGNORE INTO categorias (nombre, descripcion)
VALUES
  ('Electrónica', 'Equipos electrónicos y gadgets'),
  ('Accesorios', 'Accesorios y complementos'),
  ('Software', 'Licencias y software'),
  ('Servicios', 'Servicios técnicos y consultoría');

-- Fin del script
