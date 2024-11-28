const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ruta dinámica para obtener datos de una categoría por su ID
router.get('/:catID', (req, res) => {
    const { catID } = req.params; // Obtener el catID de los parámetros de la URL
    const filePath = path.join(__dirname, '../data/cats_products', `${catID}.json`); // Ruta al archivo JSON

    // Verificar si el archivo existe antes de enviarlo
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        // Leer y enviar el contenido del archivo
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al leer el archivo' });
            }

            res.json(JSON.parse(data));
        });
    });
});

module.exports = router;
