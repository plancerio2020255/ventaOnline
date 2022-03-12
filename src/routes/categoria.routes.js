const express = require('express')
const categoriaController = require('../controllers/categorias.controller')
const md_auth = require('../middlewares/autenticacion')
const md_rol = require('../middlewares/roles')


//RUTAS
var api = express.Router();
api.post('/crearCategoria', [md_auth.Auth, md_rol.verAdmin], categoriaController.crearCategoria)
/*
api.put('/editarCategoria/:id', md_auth.ensureAuth, CategoriaController.editarCategoria)
api.delete('/eliminarCategoria/:id', md_auth.ensureAuth, CategoriaController.eliminarCategoria)
api.get('/listarCategorias', CategoriaController.listarCategorias)
*/
module.exports = api;
