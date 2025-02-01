import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia al usuario que creó el producto
    required: true,
  },
}, { timestamps: true }); // Agrega automáticamente createdAt y updatedAt

const Product = mongoose.model('Product', productSchema);

export default Product; // Cambiamos module.exports por export default
