const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Post = require('../models/post');
const { generarJWT } = require('../helpers/jwt');

const getPosts = async (req, res) => {

    const post = await Post.find().populate('usuario', 'nombre img');

    try {
        res.json({
            ok: true,
            posts: post
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        });
    }    
}

const crearPost = async (req, res = response) => {
    
    const post = new Post({
        usuario: req.uid,
        ...req.body
    });

    try {

        const postDB = await post.save();

        res.json({
            ok: true,
            post: postDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarPost = async (req, res = response) => {

    res.json({
        ok: true,
        msg: 'actualizar post'
    });
}

const borrarPost = async (req, res = response) => {

    res.json({
        ok: true,
        msg: 'borrar post'
    });
}

module.exports = {
    getPosts,
    crearPost,
    actualizarPost,
    borrarPost
}