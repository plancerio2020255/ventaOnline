const Usuario = require('../models/usuario.model');
const Producto = require('../models/productos.model');

const Categoria = require('../models/categorias.model');

function crearCategoria (req, res) {
    const categoriaModelo = new Categoria();
    const parametros = req.body;
    
    if(parametros.nombre) {
        Categoria.find({nombre: parametros.nombre}, (err, categoriaEncontrada) => {
            if(categoriaEncontrada.length>0) {
                return res.status(500).send({mensaje: 'Ya existe una categoria con este nombre'})
            } else{
                categoriaModelo.nombre = parametros.nombre;

                categoriaModelo.save((err, categoriaGuardada) => {
                    if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
                    if(!categoriaGuardada) return res.status(500)
                        .send({mensaje: 'Error al guardar categoria'})
                    return res.status(200).send({categoria: categoriaEncontrada})
                })
            }
        })
    } else{
        return res.status(404).send({mensaje: 'Debe ingresar los parametros obligatorios'})
    }
    
}

function crearCategoriaDefault(req, res) {
    
}

module.exports = {
    crearCategoria
}
