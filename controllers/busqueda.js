const { response } = require('express');
const Usuario = require('../models/usuarios');
const Post = require('../models/post');
const Comentario = require('../models/comentario');

const getBusqueda = async (req, res = response) => {

    const parametro = req.params.busqueda;
    const regexp = new RegExp(parametro, 'i');

    const [ usuarios, posts, comentarios ] = await Promise.all([
        Usuario.find({ nombre: regexp }),
        Post.find({ titulo: regexp }),
        Comentario.find({ descripcion: regexp })
    ]);

    res.json({
        ok: true,
        usuarios,
        posts,
        comentarios,
        parametro
    });
}

const getBusquedaPorColeccion = async (req, res = response) => {

    const coleccion = req.params.tabla;
    const parametro = req.params.busqueda;
    const regexp = new RegExp(parametro, 'i');

    let datos = [];

    switch (coleccion) {
        case 'usuarios':
            datos = await Usuario.find({ nombre: regexp } && { alias: regexp });
            
            break;
    
        case 'posts':
            datos = await Post.find({ titulo: regexp });
            break;

        case 'comentarios':
            datos = await Comentario
                            .find({ descripcion: regexp })
                            .populate('usuario', 'nombre alias');
            break;
        
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La coleccion tiene que ser usuarios, posts o comentarios.'
            });
    }

    res.json({
        ok: true,
        resultados: datos
    });
}

module.exports = {
    getBusqueda,
    getBusquedaPorColeccion
}