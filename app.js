const express = require('express'); 
const cors = require('cors');

var app = express();

//IMPORTACIONE DE RUTAS

//MIDDLEWARES

// CABECERAS
app.use(cors());

// Carga de rutas

module.exports = app;
