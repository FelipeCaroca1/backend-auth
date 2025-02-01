import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    let token = req.header('Authorization'); // Obtener el token del header

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado, token requerido' });
    }

    // Manejar el caso donde Swagger envía el token sin "Bearer"
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    // Verificar el token con la clave secreta
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export default verifyToken; // Cambiamos module.exports por export default
