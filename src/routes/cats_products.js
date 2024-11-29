const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Ruta para obtener una categoría específica por ID
router.get('/:id', async (req, res) => {
    const catID = req.params.id;
    const productFile = `${catID}.json`;
    const filePath = path.join(__dirname, '../data/cats_products', productFile);
  
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const category = JSON.parse(data); // Suponiendo que el archivo contiene un solo objeto

        if (category) {
            res.status(200).json(category); // Devuelve la categoría si existe
        } else {
            res.status(404).json({ message: `Categoría con ID ${catID} no encontrada` });
        }
    } catch (err) {
        console.error('Error al leer o procesar el archivo JSON:', err);
        res.status(500).json({ message: 'Error al procesar los datos del archivo' });
    }
});

module.exports = router;
