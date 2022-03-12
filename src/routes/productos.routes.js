const express = require('express')
const productosControlador = require('../controllers/productos.controller');

const md_auth = require('../middlewares/autenticacion') 
const md_rol = require('../middlewares/roles')
const api = express.Router();    
api.post('/agregarProducto', [md_auth.Auth, md_rol.verAdmin], productosControlador.crearProducto)
api.put('/editarProducto/:idProducto', [md_auth.Auth, md_rol.verAdmin], productosControlador.editarProducto)
api.delete('/eliminarProducto/:idProducto', [md_auth.Auth, md_rol.verAdmin], productosControlador.eliminarProducto)
api.get('/buscarProductoNombre', productosControlador.buscarProductoNombre)
api.get('/buscarProductoCategoria', productosControlador.buscarProductoCategoria)
api.get('/buscarProductos', productosControlador.buscarProductos)
module.exports = api; 
