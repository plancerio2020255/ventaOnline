const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');

const jwt = require('../services/jwt');



function crearAdmin (req,res ) {
    const admin = new Usuario();

    Usuario.findOne({usuario : 'Admin' }, (err, crearAdmin) => {
        if(err) {
            console.log('Error en la peticion');
        } else if(crearAdmin) {
            console.log('El usuario Admin ya ha sido creado');
        } else{
            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                if(err) {
                    res.status(500).send({mensaje: 'Error en la peticion'})
                } else if(passwordEncriptada) {
                    admin.nombre = 'Admin'
                    admin.usuario ='Admin'
                    admin.email = 'Admin'
                    admin.password = passwordEncriptada
                    admin.rol = 'Admin'
                    admin.save((err, usuarioGuardado) => {
                        if(err) res.status(404).send({mensaje: 'Error al crear el usuario'});
                        if(usuarioGuardado) res.status(200).send({mensaje: 'Admin creado exitosamente'})
                    })
                }

            })
        }
    })
}

module.exports = {
    crearAdmin
}