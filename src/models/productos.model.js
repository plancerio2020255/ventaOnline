const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = Schema ({
    nombre: String,
    precio: String,
    stock: Number,
    idCategoria : {type: Schema.ObjectId, ref: 'Categoria'}
})

module.exports = mongoose.model('Productos', productoSchema);