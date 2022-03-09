const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const usuarioSchema = Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    rol:String,
    carritoDeCompras: [{
        nombreProducto: String,
        cantidad: Number,
        precio: Number,
        idProductos: {type: Schema.ObjectId, ref: 'Productos'},
        total: Number
    }]
})

module.exports = mongoose.model('Usuario', usuarioSchema);