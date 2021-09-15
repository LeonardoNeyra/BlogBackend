const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Comentario = require('../models/comentario');
const { generarJWT } = require('../helpers/jwt');

const getComentarios = async (req, res) => {

    const comentario = await Comentario.find()
                                        .populate('usuario', 'nombre alias img')
                                        .populate('post', 'titulo');

    try {
        res.json({
            ok: true,
            comentarios: comentario
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        });
    }
}

const crearComentarios = async (req, res = response) => {
    
    const comentario = new Comentario({
        usuario: req.uid,
        ...req.body
    });

    try {

        const comentarioDB = await comentario.save();

        res.json({
            ok: true,
            comentario: comentarioDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarComentarios = async (req, res = response) => {

    try {
        const id = req.params.id;

        const comentarioDB = await Comentario.findById(id);

        if (!comentarioDB) {
            res.status(500).json({
                ok: false,
                msg: 'Comentario no encontrado'
            });
        }

        comentarioDB.descripcion = req.body.descripcion;

        const comentarioActualizado = await Comentario.findByIdAndUpdate(id, comentarioDB, { new: true });

        res.json({
            ok: true,
            comentario: comentarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const borrarComentarios = async (req, res = response) => {

    const id = req.params.id;

    try {
        
        const comentarioDB = await Comentario.findById(id);

        if (!comentarioDB) {
            res.status(500).json({
                ok: false,
                msg: 'Comentario no encontrado'
            });
        }

        // await Post.findByIdAndDelete(id);
        const comentarioActualizado = await Comentario.findByIdAndUpdate(id, { activo: 0 });

        res.json({
            ok: true,
            msg: 'Comentario borrado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    getComentarios,
    crearComentarios,
    actualizarComentarios,
    borrarComentarios
}