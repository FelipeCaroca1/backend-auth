const mongoose = require('mongoose');

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
module.exports = User;
