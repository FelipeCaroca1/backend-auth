import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    let token = req.header('Authorization'); 

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado, token requerido' });
    }

    
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export default verifyToken; 
