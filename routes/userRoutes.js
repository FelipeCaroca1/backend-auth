const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware'); // Importar middleware de autenticación

const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// Ruta para iniciar sesión con JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'El correo no está registrado' });
    }

    // Verificar si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // Clave secreta almacenada en .env
      { expiresIn: '1h' } // Expira en 1 hora
    );

    res.json({ message: 'Inicio de sesión exitoso', token });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

router.get('/verifytoken', verifyToken, (req, res) => {
    res.json({ message: 'Token válido', user: req.user });
  });

module.exports = router;
