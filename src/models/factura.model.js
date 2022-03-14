const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const FacturaSchema = Schema({
    NoSerie: Number,
    empresa: String,
    fecha: Date,
    compra: [{
        nombre: String,
        cantidad: Number,
        precio: Number,
        idProducto: { type: Schema.ObjectId, ref: 'Productos' },
        total: Number
    }],
    usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    pagina: String
})

module.exports = mongoose.model('factura', FacturaSchema)