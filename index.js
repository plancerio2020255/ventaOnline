const mongoose = require('mongoose');
const app = require('./app')

const usuarioController = require('./src/controllers/usurio.controller')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ventaOnline', {useNewUrlParser: true, useUnifiedTopology:true}).then(() => {
    console.log('Se ha conectado a la base de datos');

    usuarioController.crearAdmin();

    app.listen(300, function () {
        console.log('ventaOnline esta corriendo en el puerto 3000');
    })

}).catch(error => console.log(error));