const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/buy', (req, res) => {
    res.sendFile(path.join(__dirname, '../data/cart/buy.json'));
});

module.exports = router;
