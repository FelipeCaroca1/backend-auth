import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
const PROD_URL = "https://backend-auth-p5go.onrender.com";
const DEV_URL = `http://localhost:${PORT}`

const SERVER_INFO = process.env.NODE_ENV === 'dev' ? {
    url: DEV_URL, 
    description: 'Servidor local'
} : {url: PROD_URL, description: 'Auth backend'};


const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Autenticación y Productos",
            version: "1.0.0",
            description: "Documentación de la API de autenticación de usuarios y gestión de productos",
            contact: {
                name: "Felipe Caroca",
                email: "felipecaroca24@gmail.com"
            }
        },
        servers: [SERVER_INFO],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ BearerAuth: [] }]
    },
    apis: ["./routes/*.js", "./controllers/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en ${SERVER_INFO.url}`);
});


connectDB(app, PORT);
