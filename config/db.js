import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (app, PORT) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conexión a MongoDB establecida');

        // Importar rutas después de conectar a la base de datos
        const userRoutes = await import('../routes/userRoutes.js');
        app.use('/api/user', userRoutes.default);
        const productRoutes = await import('../routes/productRoutes.js');
        app.use('/api/product', productRoutes.default);

        // Iniciar servidor solo si la BD está conectada
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1); // Termina el proceso si falla la conexión
    }
};

export default connectDB;
