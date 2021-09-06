const fs = require('fs');
const Usuario = require('../models/usuarios');
const Post = require('../models/post');
const Comentario = require('../models/comentario');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // Borrar imagen anterior
        fs.unlinkSync(path);
    }
}

const actualizarArchivo = async (tipo, id, nombreArchivo) => {
    let pathAntiguo = '';

    switch (tipo) {
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No hay un usuario con ese id');
                return false;
            }

            pathAntiguo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathAntiguo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            
            break;
    
        case 'posts':
            const post = await Pöst.findById(id);
            if (!post) {
                console.log('No hay un post con ese id');
                return false;
            }

            pathAntiguo = `./uploads/posts/${ post.img }`;
            borrarImagen(pathAntiguo);

            post.img = nombreArchivo;
            await post.save();
            return true;
            break;

        case 'comentarios':
            
            break;
        
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La coleccion tiene que ser usuarios, posts o comentarios.'
            });
    }
}

module.exports = {
    actualizarArchivo
}