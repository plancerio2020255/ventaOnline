const express = require('express')
const productosControlador = require('../controllers/productos.controller');

const md_auth = require('../middlewares/autenticacion') 
const md_rol = require('../middlewares/roles')
const api = express.Router();    
api.post('/agregarProducto', [md_auth.Auth, md_rol.verAdmin], productosControlador.crearProducto)
api.put('/editarProducto/:idProducto', [md_auth.Auth, md_rol.verAdmin], productosControlador.editarProducto)
api.delete('/eliminarProducto/:idProducto', [md_auth.Auth, md_rol.verAdmin], productosControlador.eliminarProducto)
api.get('/buscarProductoNombre', productosControlador.buscarProductoPorNombre)
api.get('/catalogoPorCategoria', productosControlador.buscarProductoCategoria)
api.get('/catalogo', productosControlador.buscarProductos)
api.put('/controlStock/:idP', productosControlador.controlStock);
api.get('/productosAgotados', [md_auth.Auth, md_rol.verAdmin], productosControlador.productosAgotados)
api.get('/productosMasVendidos', [md_auth.Auth, md_rol.verAdmin], productosControlador.productosMasVendidos)
module.exports = api; 
