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

    res.json({
        ok: true,
        msg: 'actualizar comentario'
    });
}

const borrarComentarios = async (req, res = response) => {

    res.json({
        ok: true,
        msg: 'borrar comentario'
    });
}

module.exports = {
    getComentarios,
    crearComentarios,
    actualizarComentarios,
    borrarComentarios
}