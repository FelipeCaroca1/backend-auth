require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Puerto desde variables de entorno o por defecto 5000
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB establecida');

    // Importar rutas **después** de conectar a la base de datos
    const userRoutes = require('./routes/userRoutes');
    app.use('/api/user', userRoutes);
  })
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando correctamente!');
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
