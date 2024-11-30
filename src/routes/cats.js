const express = require('express');
const cors = require('cors');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Ruta para obtener todas las categorías
router.get('/', async (req, res) => {
  const filePath = path.join(__dirname, '../data/cats/cat.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const categories = JSON.parse(data);
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error al leer el archivo JSON:', err);
    res.status(500).json({ message: 'Error al leer el archivo JSON' });
  }
});


module.exports = router;
