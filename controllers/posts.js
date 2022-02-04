const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Post = require('../models/post');
const { generarJWT } = require('../helpers/jwt');

const getPosts = async (req, res) => {

    const post = await Post.find({ activo: true }).populate('usuario', 'nombre img');
    // const post = await Post.find().populate('usuario', 'nombre img');

    try {
        res.json({
            ok: true,
            posts: post
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }    
}

const getPostById = async (req, res) => {

    const id = req.params.id;
    const post = await Post.findById(id).populate('usuario', 'nombre img');
    // const post = await Post.find().populate('usuario', 'nombre img');

    try {
        res.json({
            ok: true,
            post
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
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
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarPost = async (req, res = response) => {

    try {
        const id = req.params.id;
        const uid = req.uid;

        const postDB = await Post.findById(id);

        if (!postDB) {
            res.status(500).json({
                ok: false,
                msg: 'Post no encontrado'
            });
        }

        const postNuevo = {
            ...req.body
        }
        
        const postActualizado = await Post.findByIdAndUpdate(id, postNuevo, { new: true});

        res.json({
            ok: true,
            post: postActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarPost = async (req, res = response) => {

    const id = req.params.id;

    try {
        const postDB = await Post.findById(id);

        if (!postDB) {
            res.status(500).json({
                ok: false,
                msg: 'Post no encontrado'
            });
        }

        // await Post.findByIdAndDelete(id);
        const postActualizado = await Post.findByIdAndUpdate(id, { activo: 0 });

        res.json({
            ok: true,
            msg: 'Post eliminado'
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
    getPosts,
    getPostById,
    crearPost,
    actualizarPost,
    borrarPost
}