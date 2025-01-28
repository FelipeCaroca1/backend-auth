const express = require('express');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
const User = require('../models/User');

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

module.exports = router;
