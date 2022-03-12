const express = require('express')
const categoriaController = require('../controllers/categorias.controller')
const md_auth = require('../middlewares/autenticacion')
const md_rol = require('../middlewares/roles')


//RUTAS
var api = express.Router();
api.post('/crearCategoria', [md_auth.Auth, md_rol.verAdmin], categoriaController.crearCategoria)

api.put('/editarCategoria/:idCategoria', [md_auth.Auth, md_rol.verAdmin], categoriaController.editarCategoria)

api.delete('/eliminarCategoria/:idCategoria', [md_auth.Auth, md_rol.verAdmin], categoriaController.eliminarCategoria)

api.get('/obtenerCategorias', categoriaController.obtenerCategorias)

module.exports = api;
