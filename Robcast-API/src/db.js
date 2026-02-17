const mysql = require('mysql2');

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'robcast_user',
  password: process.env.DB_PASSWORD || 'robcast_password_123',
  database: process.env.DB_NAME || 'robcast_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

// Verificar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado a MySQL exitosamente');
  connection.release();
});

module.exports = pool;
