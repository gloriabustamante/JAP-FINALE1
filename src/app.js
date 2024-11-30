const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3000;

const productsRoutes = require('./routes/products'); 
const catProductRoutes = require('./routes/cats_products'); 
const categoryRoutes = require('./routes/cats'); 
const commentsRoutes = require('./routes/products_comments'); 

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoutes);
app.use('/api/products/:id', productsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/comments/:id', commentsRoutes);
app.use('/api/cats_products', catProductRoutes);
app.use('/api/cats_products/:id', catProductRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
