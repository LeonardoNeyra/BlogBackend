const { Schema, model } = require('mongoose');

const UsuarioSquema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    alias: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        // unique: true
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROL'
    },
    activo: {
        type: Boolean,
        required: true,
        default: true
    },
    fechaCrea: {
        type: Date,
        required: true,
        default: new Date()
    }
});

UsuarioSquema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();

    object.uid = _id;
    return object;
});

module.exports = model( 'Usuario', UsuarioSquema );