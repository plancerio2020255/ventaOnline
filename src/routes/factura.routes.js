const express = require('express')
const facturaController = require('../controllers/facturas.controller')
const md_auth = require('../middlewares/autenticacion') 
const md_rol = require('../middlewares/roles')

const api = express.Router();
api.put('/comprar', [md_auth.Auth, md_rol.verCliente], facturaController.FacturaCreada)
module.exports = api;