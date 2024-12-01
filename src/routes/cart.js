const express = require('express');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "ecommerce",
  connectionLimit: 5,
  port : 3306
});

const router = express.Router();

// Endpoint para agregar productos al carrito
router.post("/", async (req, res) => {
  console.log(req.body);
  
  const { usuarioId, nombreproducto, cantidad } = req.body;

  if (!usuarioId || !nombreproducto || !cantidad) {
    return res.status(400).send('Faltan parámetros');
  }
  
  let connection;
  try {
    connection = await pool.getConnection();

    // Verificar si el usuario ya tiene un carrito
    const result = await connection.query('SELECT * FROM Carritos WHERE IdUsuario = ? AND nombreproducto = ?', [usuarioId, nombreproducto]);

    if (result.length > 0) {
      // Si el producto ya está en el carrito, actualizamos la cantidad
      const carritoId = result[0].Id;
      const nuevaCantidad = result[0].cantidad + cantidad; // Sumar la cantidad existente

      await connection.query('UPDATE Carritos SET cantidad = ? WHERE Id = ?', [nuevaCantidad, carritoId]);
      res.status(200).json({ mensaje: 'Cantidad actualizada en el carrito con éxito' });
    } else {
      // Si el usuario no tiene el producto en su carrito, lo agregamos
      const insertResult = await connection.query('INSERT INTO Carritos (IdUsuario, nombreproducto, cantidad) VALUES (?, ?, ?)',
        [usuarioId, nombreproducto, cantidad]);

      res.status(200).json({ mensaje: 'Producto agregado al carrito con éxito' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al agregar producto al carrito', error: err });
  } finally {
    if (connection) connection.end();
  }
});

module.exports = router;
