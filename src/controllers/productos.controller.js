const Productos = require('../models/productos.model');
const Categorias = require('../models/categorias.model')

const bcrypt = require('bcrypt-nodejs');

const jwt = require('../services/jwt');

function crearProducto (req, res) {
    const parametros = req.body;
    const modeloProducto = new Productos();

    if( req.user.rol != 'Admin' ) res.status(500).send('Solo el administrador puede agregar productos');

    if( parametros.nombre && parametros.precio && parametros.stock && parametros.idCategoria && parametros.nombreCategoria) {
        modeloProducto.nombre = parametros.nombre;
        modeloProducto.descripcion = parametros.descripcion;
        modeloProducto.precio = parametros.precio;
        modeloProducto.stock = parametros.stock;
        modeloProducto.idCategoria = parametros.idCategoria;
        modeloProducto.nombreCategoria = parametros.nombreCategoria

       
         Productos.find({ $or: [
            {descripcion: modeloProducto.descripcion}
        ]}).exec((err, productos) => {
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de productos'})
            if(productos && productos.length >0){
                return res.status(500).send({mensaje: 'el producto ya existe'})
            }else{

                Categorias.findById(modeloProducto.idCategoria, (err, categoriaEncontrada)=>{
                    if(err) return res.status(500).send({ mensaje: 'error en la petición de categorias' })
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
            mensaje: 'Rellene todos los datos necesarios'
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

function buscarProductoCategoria(req, res) {
    const nombreCat = req.body.nombreCat;

    Productos.find({nombreCategoria: {$regex:nombreCat, $options: "i"}}, (err, productosEncontrados)=>{
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

function buscarProductoPorNombre(req,res) {

 const nombreProducto = req.body.nombreProducto;

    Productos.find(
        {nombre: {$regex: nombreProducto, $options: "i"}} , (err, productosEncontrados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })

                return res.status(200).send({productos: productosEncontrados})


    })
}

function controlStock(req, res) {
    const idProducto = req.params.idP;
    const parametros = req.body;

    Productos.findByIdAndUpdate(idProducto, { $inc: { stock: parametros.stock } }, { new: true },(err, stockActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!stockActualizado) return res.status(500).send({ mensaje: 'Error incrementar la cantidad del producto' });
            return res.status(200).send({producto: stockActualizado})
        })
}


function productosAgotados(req, res) {
    Productos.find({stock: 0}, (err, productosAgotados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if(!productosAgotados) return res.status(404).send({ mensaje: 'Error al buscar entre productos' })
        if(productosAgotados.length == 0) return res.send({ mensaje: 'No se ha agotado nada' })

        return res.status(200).send({ productos: productosAgotados })
    })
}

function productosMasVendidos(req, res) {
    Productos.find({}).sort({unidadesVendidas: -1}).exec((err, productosMasVendidos)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if(!productosMasVendidos) return res.status(404).send({ mensaje: 'Error al buscar entre productos' })
        return res.status(200).send({ productos: productosMasVendidos })
    })
}



module.exports = {
    crearProducto,
    editarProducto,
    eliminarProducto,
    buscarProductoPorNombre,
    buscarProductoCategoria,
    buscarProductos,
    controlStock,
    productosAgotados,
    productosMasVendidos
}
