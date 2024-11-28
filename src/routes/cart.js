const express = require('express');
const path = require('path');
const router = express.Router();

// Ruta para servir el archivo buy.json
router.get('/buy', (req, res) => {
    res.sendFile(path.join(__dirname, '../data/cart/buy.json')); // Ajusta la ruta según tu estructura
});

module.exports = router;
