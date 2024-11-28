const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Ruta para obtener todos los comentarios (de todos los productos)
router.get('/', async (req, res) => {
    const commentsDir = path.join(__dirname, '../data/products_comments');

    try {
        const files = await fs.readdir(commentsDir);
        const allComments = [];

        for (const file of files) {
            const filePath = path.join(commentsDir, file);
            const data = await fs.readFile(filePath, 'utf8');
            const comments = JSON.parse(data);
            allComments.push(...comments);
        }

        res.status(200).json(allComments);
    } catch (err) {
        console.error('Error al leer los archivos de comentarios:', err);
        res.status(500).json({ message: 'Error al leer los archivos de comentarios' });
    }
});

// Ruta para obtener comentarios de un producto específico por ID
router.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    const commentsFilePath = path.join(__dirname, `../data/products_comments/${productId}.json`);

    try {
        const data = await fs.readFile(commentsFilePath, 'utf8');
        const comments = JSON.parse(data);
        res.status(200).json(comments);

    } catch (err) {
        console.error(`Error al leer el archivo de comentarios para el producto ${productId}:`, err);
        res.status(404).json({ message: `No se encontraron comentarios para el producto con ID ${productId}` });
    }
});

module.exports = router;
