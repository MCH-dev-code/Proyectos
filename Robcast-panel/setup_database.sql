-- Crear base de datos
CREATE DATABASE IF NOT EXISTS robcast_db;
USE robcast_db;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  stock INT DEFAULT 0,
  precio DECIMAL(10, 2) DEFAULT 0,
  imagen LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de detalles de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, stock, precio) VALUES
('Laptop Dell XPS', 5, 45000),
('Mouse Logitech', 20, 1500),
('Teclado Mecánico RGB', 15, 3500),
('Monitor LG 27"', 8, 18000),
('Cable USB-C', 50, 350);

INSERT INTO clientes (nombre, email, telefono) VALUES
('Rosa Marte', 'rosa@example.com', '809-123-4567'),
('Luis Peña', 'luis@example.com', '809-234-5678'),
('María García', 'maria@example.com', '809-345-6789'),
('Juan Rodríguez', 'juan@example.com', '809-456-7890');
