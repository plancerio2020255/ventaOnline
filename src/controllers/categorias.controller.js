const Usuario = require('../models/usuario.model');
const Producto = require('../models/productos.model');

const Categoria = require('../models/categorias.model');

function crearCategoria (req, res) {
    const categoriaModelo = new Categoria();
    const parametros = req.body;

    if(parametros.nombre) {
        categoriaModelo.nombre = parametros.nombre

        Categoria.findOne({nombre: parametros.nombre}, (err, categoriaEncontrada) =>{
            if(err) res.status(500).send({mensaje: 'Error en la peticion'})
            if(categoriaEncontrada) {

            }
        })
    }

}
