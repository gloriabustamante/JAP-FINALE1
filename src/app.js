const express = require('express');
const app = express();
const port = 3000;

// Import the routes
const productsRoutes = require('./routes/products'); // Ruta de productos
const categoryRoutes = require('./routes/cats'); // Ruta de categorías
const commentsRoutes = require('./routes/products_comments'); // Ruta de categorías


// Middleware
app.use(express.json());

// Use the routes
app.use('/api/products', productsRoutes); // Ruta para productos
app.use('/api/categories', categoryRoutes); // Ruta para categorías
app.use('/api/comments', commentsRoutes); // Ruta para categorías


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
