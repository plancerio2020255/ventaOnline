const Productos = require('../models/productos.model');
const Categorias = require('../models/categorias.model')

const bcrypt = require('bcrypt-nodejs');

const jwt = require('../services/jwt');

function crearProducto (req, res) {
    const parametros = req.body;
    const modeloProducto = new Productos();

    if( req.user.rol != 'Admin' ) res.status(500).send('Solo el administrador puede agregar productos');

    if( parametros.nombre && parametros.precio && parametros.stock && parametros.idCategoria ) {
        modeloProducto.nombre = parametros.nombre;
        modeloProducto.descripcion = parametros.descripcion;
        modeloProducto.precio = parametros.precio;
        modeloProducto.stock = parametros.stock;
        modeloProducto.idCategoria = parametros.idCategoria;


       
         Productos.find({ $or: [
            {descripcion: modeloProducto.descripcion}
        ]}).exec((err, productos) => {
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de productos'})
            if(productos && productos.length >0){
                return res.status(500).send({mensaje: 'el producto ya existe'})
            }else{

                Categorias.findById(modeloProducto.idCategoria, (err, categoriaEncontrada)=>{
                    if(err) return res.status(500).send({ message: 'error en la petición de categorias' })
                    if(!categoriaEncontrada) return res.status(404).send({ mensaje: 'no se ha encontrado la categoria' })
                    modeloProducto.save((err, productoGuardado) => {
                        if(err) return res.status(500).send({mensaje: 'error al guardar el producto'})
                        if(productoGuardado){
                            res.status(200).send({producto: productoGuardado})
                        }else{
                            res.status(404).send({mensaje: 'no se ha podido guardar el producto'})
                        }
                        
                    })
                })
                
            }
        })
        
    }else{
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        })
    }

}

function editarProducto(req,res) {
    const productoId = req.params.idProducto;
    const parametros = req.body;

    Productos.findByIdAndUpdate(productoId, parametros, { new : true } ,(err, productoEditado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!productoEditado) return res.status(404)
            .send({ mensaje: 'Error al Editar el Producto' });

        return res.status(200).send({ producto: productoEditado });
    })
}

function eliminarProducto(req,res) {
    const productoId = req.params.idProducto;

    Productos.findByIdAndDelete(productoId,{new : true}, (err, productoEliminado) =>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!productoEliminado) return res.status(400).send({mensaje: 'Error al eliminar producto'})

        return res.status(200).send({producto: productoEliminado})
    })
}

function buscarProductoNombre(req,res) {
    const productoId = req.body.nombre;

        Productos.findById(productoId, (err, productoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if(!productoEncontrado) return res.status(404).send({ mensaje: 'Error al buscar productos' })
            return res.status(200).send(productoEncontrado)
        })
  

}

function buscarProductoCategoria(req, res) {
    const categoriaId = req.params.idCategoria
        Productos.find({categoria: categoriaId}, (err, productosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición' })
            if(!productosEncontrados) return res.status(500).send({mensaje: 'Error al buscar productos'})
            return res.status(200).send({mensaje: productosEncontrados})
            
})
}

function buscarProductos(req, res) {
    Productos.find({}, (err, productosEncontrados) =>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!productosEncontrados) return res.status(500).send({mensaje: 'Error al buscar productos'})
        return res.status(200).send({productosEncontrados})
    })
}

module.exports = {
    crearProducto,
    editarProducto,
    eliminarProducto,
    buscarProductoNombre,
    buscarProductoCategoria,
    buscarProductos
}
