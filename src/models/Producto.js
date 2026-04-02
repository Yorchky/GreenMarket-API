const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombreProducto: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    categoria: {
       type: String,
       required: true,
       lowercase: true,
      trim: true
    },
    
    productor: {
        type: String,
        required: true
    },
    negocioId:{
        type: String,
        required: true
    },
    alerta:{
        type: String
    },
    ubicacion: {
        type: String,
        required: true
    },
    nivelStock: {
    type: String,
    enum: ['bajo', 'medio', 'alto']
    },
    estado: { 
    type: String,
    enum: ['disponible', 'agotado'],
    default: 'disponible'

    }
});

module.exports = mongoose.model('Producto', productoSchema);