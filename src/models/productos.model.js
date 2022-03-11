const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = Schema ({
    nombre: String,
    descripcion: String,
    precio: String,
    stock: Number,
    idCategoria : {type: Schema.ObjectId, ref: 'Categoria'},
    unidadesVendidas: Number
})

module.exports = mongoose.model('Productos', productoSchema);
