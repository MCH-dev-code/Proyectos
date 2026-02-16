const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario_id = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

const generarToken = (usuarioId) => {
  return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = { verificarToken, generarToken };
