const { Schema, model } = require('mongoose');

const PostSquema = Schema({
    titulo: {
        type: String,
        required: true,
    },
    cuerpo: {
        type: String,
        required: true,
    },
    img: {
        type: String
    },
    nComentarios: {
        type: Number,
        default: 0
    },
    nLikes: {
        type: Number,
        default: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    fechaCrea: {
        type: Date,
        default: new Date()
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'posts'});

PostSquema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;
    return object;
});

module.exports = model( 'Post', PostSquema );