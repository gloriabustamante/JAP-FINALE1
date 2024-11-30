const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const SECRET_KEY = "tu_clave_secreta";

const productsRoutes = require('./routes/products');
const catProductRoutes = require('./routes/cats_products');
const categoryRoutes = require('./routes/cats');
const commentsRoutes = require('./routes/products_comments');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ username }, SECRET_KEY);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Usuario y/o contraseña incorrecto" });
  }
});

// Middleware que autoriza a realizar peticiones

const authenticateToken = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).json({ message: "Usuario no autorizado" });
  }
};

// Rutas protegidas
app.use('/api/products', authenticateToken, productsRoutes);
app.use('/api/products/:id', authenticateToken, productsRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/comments', authenticateToken, commentsRoutes);
app.use('/api/comments/:id', authenticateToken, commentsRoutes);
app.use('/api/cats_products', authenticateToken, catProductRoutes);
app.use('/api/cats_products/:id', authenticateToken, catProductRoutes);

app.get("/protected", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Acceso permitido", user: req.user });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
