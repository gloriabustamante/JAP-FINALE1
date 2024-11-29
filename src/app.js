const express = require('express');
const cors = require('cors');  // Importamos el paquete cors
const app = express();
const port = 3000;

// Import the routes
const productsRoutes = require('./routes/products'); // Ruta de productos
const catProductRoutes = require('./routes/cats_products'); // Ruta de productos
const categoryRoutes = require('./routes/cats'); // Ruta de categorías
const commentsRoutes = require('./routes/products_comments'); // Ruta de comentarios

// Middleware
app.use(cors());  // Esto habilita CORS para todas las solicitudes
// Si quieres limitarlo a un origen específico, puedes usar: app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json());

// Use the routes
app.use('/api/products', productsRoutes); // Ruta para productos
app.use('/api/products/:id', productsRoutes); // Ruta para productos
app.use('/api/categories', categoryRoutes); // Ruta para categorías
app.use('/api/comments', commentsRoutes); // Ruta para comentarios
app.use('/api/cats_products', catProductRoutes); // Ruta para 
app.use('/api/cats_products/:id', catProductRoutes); // Ruta para 

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
