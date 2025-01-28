const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado, token requerido' });
    }

    // Quitar "Bearer " del token
    const tokenWithoutBearer = token.split(" ")[1];

    // Verificar el token con la clave secreta
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified; 

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = verifyToken;
