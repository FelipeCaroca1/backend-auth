import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (app, PORT) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conexión a MongoDB establecida');

      
        const userRoutes = await import('../routes/userRoutes.js');
        app.use('/api/user', userRoutes.default);
        const productRoutes = await import('../routes/productRoutes.js');
        app.use('/api/product', productRoutes.default);


    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1); 
    }
};

export default connectDB;
