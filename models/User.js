import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Para evitar emails duplicados
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Agrega automáticamente createdAt y updatedAt

const User = mongoose.model('User', userSchema);

export default User; // Cambiamos module.exports por export default
