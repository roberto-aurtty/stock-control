import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import productRoutes from './routes/ProductRoutes.js';
import { initDb } from './database/connection.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(loggerMiddleware);

// Initialize Database
initDb();

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Management API',
      version: '1.0.0',
      description: 'API for CRUD operations on products with SKU generation and pagination',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/products', productRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Product API',
    documentation: '/api-docs'
  });
});

export default app;
