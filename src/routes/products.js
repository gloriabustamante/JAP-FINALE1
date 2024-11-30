const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    const productsDirectory = path.join(__dirname, '../data/products');

    try {
        const files = await fs.readdir(productsDirectory);

        let products = [];

        for (const file of files) {
            const filePath = path.join(productsDirectory, file);
            const data = await fs.readFile(filePath, 'utf8');

            try {
                const product = JSON.parse(data);
                products.push(product);
            } catch (parseError) {
                console.error(`Error al parsear el archivo ${file}:`, parseError);
            }
        }

        res.status(200).json(products);
    } catch (err) {
        console.error('Error al leer la carpeta de productos:', err);
        res.status(500).json({ message: 'Error al leer la carpeta de productos' });
    }
});

// Ruta para obtener un producto específico por ID
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    const productFile = `${productId}.json`;
    const filePath = path.join(__dirname, '../data/products', productFile);

    try {

        const data = await fs.readFile(filePath, 'utf8');

        const product = JSON.parse(data);

        res.status(200).json(product);
    } catch (err) {
        console.error(`Error al leer el archivo del producto ${productId}:`, err);
        res.status(404).json({ message: `Producto con ID ${productId} no encontrado` });
    }
});

module.exports = router;
