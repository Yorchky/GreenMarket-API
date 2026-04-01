//Modelo de usuarios
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required:true

    },
    rol: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
    
    },
    nombreNegocio: {
        type: String,
        default: ""
    
    },
    descripcion: {
        type: String,
        default: ""    
  
    },
    umbralStockBajo: {
        type: Number,
        default: 10
  
    },

    umbralStockMedio: {
        type: Number,
        default: 50
    
    }

});

module.exports = mongoose.model('Usuario',userSchema);