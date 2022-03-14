const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs')
const Producto = require('../models/productos.model')
const jwt = require('../services/jwt');



function crearAdmin (req,res ) {
       const administrador = new Usuario();

    Usuario.findOne({ usuario: 'Admin' }, (err, crearAdmin) => {
        if (err) {
            console.log('Error al crear usuario Admin');
        } else if (crearAdmin) {
            console.log('El usuario administrador ya ha sido creado');
        } else {
            bcrypt.hash('123456', null, null, (err, contraseñaEncriptada) => {
                if (err) {
                    res.status(500).send({ mensaje: 'Error al encriptar contraseña' })
                } else if (contraseñaEncriptada) {
                    administrador.nombre = 'Admin'
                    administrador.usuario = 'Admin'
                    administrador.email = 'Admin'
                    administrador.password = contraseñaEncriptada
                    administrador.rol = 'Admin'
                    administrador.save((err, usuarioGuardado) => {
                        if (err) {
                            console.log('Error al crear usuario');
                        } else if (usuarioGuardado) {
                            console.log('Usuario administrador creado');
                        } else {
                            console.log('Usuario administrador no creado');
                        }
                    })
                }
            })
        }
    })

}

function registrarCliente (req,res) {
    var usuario = new Usuario();
    var parametros = req.body

    if(parametros.nombre && parametros.password && parametros.email){
        usuario.nombre = parametros.nombre
        usuario.usuario = parametros.usuario
        usuario.email = parametros.email
        usuario.rol = 'Cliente';
    
            Usuario.find({ email : parametros.email }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuario.password = passwordEncriptada;

                        usuario.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                                
                            return res.status(200).send({ usuario: usuarioGuardado });
                            });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })

       }
}

function login (req,res) {
    var parametros = req.body;
    Usuario.findOne({ usuario : parametros.usuario }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }

                        
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}

function editarUsuario(req,res) {
    const clienteId = req.params.idCliente;
    const parametros = req.body;
     
    Usuario.findById(clienteId, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!usuarioEncontrado) return res.status(404).send({mensaje: 'Error al editar'})
        if(usuarioEncontrado.rol != 'Cliente') return res.status(500).send({mensaje: 'Solo puede editar usuarios con rol Cliente'})
        Usuario.findByIdAndUpdate(clienteId, parametros, {new: true},(err, usuarioActualizado) =>{
            return res.status(200).send({usuarioActualizado})
        })
    })

}

function eliminarUsuario(req,res) {
    const clienteId = req.params.idCliente;
    
    Usuario.findById(clienteId, (err, clienteEncontrado) => {
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!clienteEncontrado) return res.status(404).send({mensaje: 'Error al eliminar usuario'})
        if(clienteEncontrado.rol !== 'Cliente') return res.send({mensaje: 'Solo puede eliminar usuarios con rol Cliente'})
        Usuario.findByIdAndDelete(clienteId, (err, clienteEliminado) => {
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
            if(!clienteEliminado) return res.status(404).send({mensaje: 'Erro al eliminar usuario'})
            return res.status(200).send({mensaje: 'Usuario eliminado exitosamente', clienteEliminado})
        })
    })
}
/*--------------------------CLIENTE-----------------------------*/
function editarCliente(req, res) {
    var clienteId = req.params.idCliente;
    var parametros = req.body;

    if(req.user.sub != clienteId) return res.status(500).send({mensaje: 'No puede editar otros clientes'})

    Usuario.findById(clienteId, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if(!usuarioEncontrado) return res.status(404).send({ mensaje: 'Error al editar el cliente' })
        if(usuarioEncontrado.rol == 'Admin') return res.send({ mensaje: 'Solo puede editar usuarios con rol Cliente' })
        if(parametros.rol) return res.send({mensaje: 'Solo un administrador puede cambiar el rol'})
        Usuario.findByIdAndUpdate(clienteId, parametros, {new: true},(err, usuarioActualizado)=>{
            return res.status(200).send({ usuarioActualizado })
        })
    })
    
}

function eliminarCliente(req,res) {
    var clienteId = req.params.idCliente;

    if(req.user.sub != clienteId) return res.status(500).send({mensaje: 'Solo puede eliminar su propia cuenta'})

    Usuario.findById(clienteId, (err, clienteEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })    
        if(!clienteEncontrado) return res.status(404).send({ mensaje: 'Error al encontrar el cliente' })
        if(clienteEncontrado.rol == 'Admin') return res.send({ mensaje: 'Solo puede editar usuarios con rol Cliente' })

        Usuario.findByIdAndDelete(clienteId, (err, clienteEliminado) =>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if(!clienteEliminado) return res.status(404).send({ mensaje: 'Error al eliminar cliente' })
            return res.status(200).send({ mensaje: 'Usuario eliminado', clienteEliminado })
        })

    })

}

/*-----------------------------CARRITO---------------------------------*/
function añadirCarrito(req, res) {
    var idProductos = req.body.idProducto
    var cantidad = req.body.cantidad
    
    Producto.findById(idProductos, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if(!productoEncontrado) return res.status(404).send({ mensaje: 'Error al buscar entre productos' })
        
        Usuario.countDocuments({_id: req.user.sub, "carritoDeCompras.idProducto": idProductos}, (err, productoRegistrado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if(productoRegistrado == 0){
                if(productoEncontrado.stock < cantidad) return res.send({ mensaje: 'No hay suficiente stock' })
                Usuario.findByIdAndUpdate(req.user.sub, { $push: { carritoDeCompras: { nombre: productoEncontrado.nombre, cantidad: cantidad, 
                    precio: productoEncontrado.precio, idProducto: productoEncontrado._id, subTotal: productoEncontrado.precio * cantidad } } },
                     {new: true}, (err, carritoActualizado) =>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                    if(!carritoActualizado) return res.status(404).send({ mensaje: 'Error al agregar producto' })
                    return res.status(200).send({ carritoActualizado })
                })
            }else{
                Usuario.findOne({_id: req.user.sub, "carritoDeCompras.idProducto": idProductos}, {"carritoDeCompras.$.cantidad": 1, _id: 0}, 
                    (err, cantidadProductoEncontrado)=>{
                    const cantidadTotal = cantidadProductoEncontrado.carritoDeCompras[0].cantidad + Number(cantidad)
                    const precioAnterior =  cantidadProductoEncontrado.carritoDeCompras[0].precio * cantidad
                    
                if(cantidadTotal > productoEncontrado.stock) return res.send({ mensaje:'No hay suficiente stock' })



                  Usuario.updateOne({_id: req.user.sub, carritoDeCompras: {$elemMatch: {idProducto: idProductos}}}, 
                  {$inc:{"carritoDeCompras.$.cantidad": cantidad ,
                  "carritoDeCompras.$.subTotal": precioAnterior}}, (err, cantidadIncrementada)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion de usuario' })
                    if(!cantidadIncrementada) return res.status(404).send({ mensaje: 'error al actualizar el producto' })
                    Usuario.findById(req.user.sub, (err, usuarioEncontrado)=>{
                        return res.status(200).send({ usuarioEncontrado })
                    })
                })
                })
                
            }
        })
    })
}
   
module.exports = {
    crearAdmin,
    registrarCliente,
    login,
    editarCliente,
    eliminarCliente,
    editarUsuario,
    eliminarUsuario,
    añadirCarrito
}
