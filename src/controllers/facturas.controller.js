const Factura = require('../models/factura.model');
const Producto = require('../models/productos.model')
const Categoria = require('../models/categorias.model')
const Usuario = require('../models/usuario.model')


function agregarProductosAFactura(datos, res) {
    Usuario.findById(datos.usuario, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if(!usuarioEncontrado) return res.status(404).send({ mensaje: 'Error al buscar entre los usuarios' })

        for(let x=0; x<usuarioEncontrado.carritoDeCompras.length; x++){
        const compras = usuarioEncontrado.carritoDeCompras[x]
        const cantidadRestar = compras.cantidad 

            Producto.updateOne({_id: compras.idProducto}, {$inc:{stock: -cantidadRestar}}).exec();
            Producto.updateOne({_id: compras.idProducto}, {$inc:{unidadesVendidas: cantidadRestar}}).exec();
            
                Factura.findByIdAndUpdate(datos._id, {$push:{compra: compras}}, (err, facturaActualizada)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                    if(!facturaActualizada) return res.status(404).send({ mensaje: 'Error al actualizar' })
                })
        }

        Factura.findById(datos._id, (err, facturaEncontrada)=>{
            eliminarCarrito(datos.usuario, res);
            return res.status(200).send({ factura: facturaEncontrada })
        })
    })
}


function FacturaCreada(req, res){
    const factura = new Factura();
    
    const hoy = new Date();
    const dd = String(hoy.getDate()).padStart(2, '0');
    const mm = String(hoy.getMonth() + 1).padStart(2, '0'); 
    const yyyy = hoy.getFullYear();
    
        factura.empresa = "Dolar city 🤑"
        factura.fecha = mm + '/' + dd + '/' + yyyy
        const serie = 1
 
                    Usuario.findById(req.user.sub, (err, usuarioEncontrado)=>{
                        if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
                        if(!usuarioEncontrado) return res.status(404).send({ mensaje: 'error al listar los usuarios' })
                        if(usuarioEncontrado.rol != 'Cliente') return res.send({ mensaje: 'NO puedes añadir una administrador a la factura' })
                        if(usuarioEncontrado.carritoDeCompras.length == 0) return res.send({ mensaje: 'No tienes productos en el carrito' })
                        Factura.countDocuments({}, (err, cantidadFacturas)=>{
                            serie = serie + cantidadFacturas
                        factura.NoSerie = serie
                        factura.usuario = usuarioEncontrado._id;
                        factura.save((err, facturaCreada) => {
                            if(err) return res.status(500).send({mensaje: 'error al crear el empleado'})
                            if(!facturaCreada) return res.status(404).send({ mensaje: 'no se ha podido crear la factura' })
                            agregarProductosAFactura(facturaCreada, res);
                        })
                    })
                    })
   
}



function eliminarCarrito(datosUsuario, res) {
    Usuario.findByIdAndUpdate(datosUsuario, {carritoDeCompras: []}).exec()
}


function facturasUsuario(req, res) {
    const usuarioId = req.body.usuarioId;

    Factura.find({usuario: usuarioId}, (err, facturasEncontradas)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición' })
        if(!facturasEncontradas) return res.status(404).send({ mensaje: 'Error al buscar entre facturas' })
        if(facturasEncontradas.length == 0) return res.send({ mensaje: 'Este usuario no tiene facturas' })

        return res.status(200).send({ facturas: facturasEncontradas })
    })

}

module.exports = {
    FacturaCreada,
    facturasUsuario
}