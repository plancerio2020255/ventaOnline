const Usuario = require('../models/usuario.model');
const Producto = require('../models/productos.model');

const Categoria = require('../models/categorias.model');

function crearCategoria (req, res) {
    const categoriaModelo = new Categoria();
    const parametros = req.body;
    crearCategoriaDefault();
    
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
    const categoria = new Categoria();
    categoria.nombre = "defaultCategory"

    Categoria.countDocuments({nombre: 'defaultCategory'}, 
        (err, categoriaDefault)=>{
     if(categoriaDefault == 0){
        categoria.save()
     }
    })
}

function editarCategoria(req,res) {
    const categoriaId = req.params.idCategoria;
    const parametros = req.body;
    
      
 Categoria.findByIdAndUpdate(categoriaId, parametros, { new : true } ,(err, categoriaEditada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!categoriaEditada) return res.status(404)
            .send({ mensaje: 'Error al Editar el Producto' });

     return res.status(200).send({ categoria: categoriaEditada});
    })
   
}

function eliminarCategoria(req,res) {
    const categoriaId = req.params.idCategoria;
    
    Categoria.findByIdAndDelete(categoriaId, {new:true}, (err, categoriaEliminada) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!categoriaEliminada) return res.status(404).send({mensaje: 'Error al eliminar categoria'});

        return res.status(200).send({categoria: categoriaEliminada});
    })
}

function obtenerCategorias(req,res) {
    Categoria.find({}, (err, categoriasEncontradas) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!categoriasEncontradas) return res.status(500).send({mensaje: 'Error al listar categorias'})
        return res.status(200).send({categorias: categoriasEncontradas})
    })
}

module.exports = {
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
    obtenerCategorias
}
