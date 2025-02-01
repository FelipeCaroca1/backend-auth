import Product from '../models/Product.js';

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Rutas de gestión de productos
 */

/**
 * @swagger
 * /api/product/create:
 *   post:
 *     summary: Crear un nuevo producto (requiere autenticación)
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop Gamer
 *               description:
 *                 type: string
 *                 example: Laptop de alta gama para gaming
 *               price:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Todos los campos son obligatorios o datos inválidos
 *       500:
 *         description: Error en el servidor
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'El precio debe ser un número positivo' });
    }

    const newProduct = new Product({ name, description, price, userId: req.user.id });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error });
  }
};

/**
 * @swagger
 * /api/product/readall:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       500:
 *         description: Error en el servidor
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('userId', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error });
  }
};

/**
 * @swagger
 * /api/product/readone/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('userId', 'name email');
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
};

/**
 * @swagger
 * /api/product/update/{id}:
 *   put:
 *     summary: Actualizar un producto (solo el creador puede modificarlo)
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       403:
 *         description: No tienes permiso para editar este producto
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar este producto' });
    }

    product.name = name;
    product.description = description;
    product.price = price;

    await product.save();
    res.json({ message: 'Producto actualizado exitosamente', product });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error });
  }
};

/**
 * @swagger
 * /api/product/delete/{id}:
 *   delete:
 *     summary: Eliminar un producto (solo el creador puede eliminarlo)
 *     tags: [Productos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       403:
 *         description: No tienes permiso para eliminar este producto
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
    }

    await product.deleteOne();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
};
