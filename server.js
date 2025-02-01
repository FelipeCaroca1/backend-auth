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

// Puerto desde variables de entorno o por defecto 5000
const PORT = process.env.PORT || 5000;

// Configuración de Swagger con Autenticación JWT
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
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Servidor Local"
            }
        ],
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

// Conectar a MongoDB y arrancar el servidor
connectDB(app, PORT);
