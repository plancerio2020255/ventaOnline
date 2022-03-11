const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs')

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
    
module.exports = {
    crearAdmin,
    registrarCliente,
    login
}
