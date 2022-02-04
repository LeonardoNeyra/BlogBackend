const { Schema, model } = require('mongoose');

const ComentarioSquema = Schema({
    post: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    descripcion: {
        type: String,
        required: true,
    },
    activo: {
        type: Boolean,
        default: true
    },
    comentarioPadre: {
        type: Schema.Types.ObjectId,
        ref: 'Comentario'
    },
    respuestas: [{
        required: true,
        default: [],
        type: Schema.Types.ObjectId,
        ref: 'Comentario'
    }],
    fechaCrea: {
        type: Date,
        default: new Date()
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'comentarios' });

ComentarioSquema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;
    return object;
});

module.exports = model( 'Comentario', ComentarioSquema );