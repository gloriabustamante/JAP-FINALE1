const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Ruta para obtener todas las categorías
router.get('/', async (req, res) => {
  const filePath = path.join(__dirname, '../data/cats/cat.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const categories = JSON.parse(data); // Parse the entire JSON array
    res.status(200).json(categories); // Return all categories
  } catch (err) {
    console.error('Error al leer el archivo JSON:', err);
    res.status(500).json({ message: 'Error al leer el archivo JSON' });
  }
});

// Ruta para obtener una categoría específica por ID
router.get('/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const filePath = path.join(__dirname, '../data/cats/cat.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const categories = JSON.parse(data);
    const category = categories.find(cat => cat.id === categoryId);

    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: `Categoría con ID ${categoryId} no encontrada` });
    }
  } catch (err) {
    console.error('Error al leer o parsear el archivo JSON:', err);
    res.status(500).json({ message: 'Error al procesar los datos del archivo' });
  }
});

module.exports = router;
