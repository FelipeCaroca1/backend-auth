const express = require('express');
const verifyToken = require('../middleware/authMiddleware'); // Middleware para verificar token
const Product = require('../models/Product');

const router = express.Router();

// 🟢 Crear un producto (solo usuarios autenticados)
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      userId: req.user.id, // Asociar el producto al usuario autenticado
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
});

// 🔵 Leer todos los productos
router.get('/readall', async (req, res) => {
  try {
    const products = await Product.find().populate('userId', 'name email'); // Obtener productos con info del usuario
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
});

// 🟣 Leer un producto específico por ID
router.get('/readone/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('userId', 'name email');
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
});

// 🟠 Actualizar un producto (solo el creador)
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // Verificar si el usuario autenticado es el creador del producto
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar este producto' });
    }

    // Actualizar los campos permitidos
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    await product.save();
    res.json({ message: 'Producto actualizado exitosamente', product });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
});

// 🔴 Eliminar un producto (solo el creador)
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // Verificar si el usuario autenticado es el creador del producto
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
    }

    await product.deleteOne();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
});

module.exports = router;
