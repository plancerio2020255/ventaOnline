const express = require('express')
const usuarioController = require('../controllers/usuario.controller')
const md_auth = require('../middlewares/autenticacion') 
const md_rol = require('../middlewares/roles')

//RUTAS
const api = express.Router();
api.post('/registrar', usuarioController.registrarCliente)
api.post('/login', usuarioController.login)

api.put('/editarCliente/:idCliente', [md_auth.Auth, md_rol.verCliente], usuarioController.editarCliente);
api.delete('/eliminarCliente/:idCliente', [md_auth.Auth, md_rol.verCliente], usuarioController.eliminarCliente)

api.put('/editarUsuario/:idCliente', [md_auth.Auth, md_rol.verAdmin], usuarioController.editarUsuario)
api.delete('/eliminarUsuario/:idCliente', [md_auth.Auth, md_rol.verAdmin], usuarioController.eliminarUsuario)
/*
api.put('/editarClientes/:id', md_auth.ensureAuth, UserController.editarClientes)
api.delete('/eliminarClientes/:id', md_auth.ensureAuth, UserController.eliminarClientes)
api.put('/agregar_a_Carrito', md_auth.ensureAuth, UserController.añadirCarrito)
api.put('/comprar', md_auth.ensureAuth, UserController.comprar)
api.get('/facturasXcliente', md_auth.ensureAuth, UserController.facturasUsuario)
api.get('/productosXfactura', md_auth.ensureAuth, UserController.productoXFactura)
api.post('/crearPDF', UserController.createPDF)
*/ 
module.exports = api;
