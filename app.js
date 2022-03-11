const express = require('express'); 
const cors = require('cors');

var app = express();

//IMPORTACIONE DE RUTAS
const usuarioRoutes = require('./src/routes/usuario.routes')
const productosRoutes = require('./src/routes/productos.routes')
//MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
// CABECERAS
app.use(cors());

// Carga de rutas
app.use('/api', usuarioRoutes, productosRoutes)
module.exports = app;
