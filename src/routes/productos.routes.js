const express = require('express')
const productosControlador = require('../controllers/productos.controller');

const md_auth = require('../middlewares/autenticacion') 
const md_rol = require('../middlewares/roles')
const api = express.Router();    
api.post('/agregarProducto', [md_auth.Auth, md_rol.verAdmin], productosControlador.crearProducto)

module.exports = api; 
