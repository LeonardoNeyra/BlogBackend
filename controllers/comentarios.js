const { response } = require('express');
const { ObjectId } = require('mongodb');

const Comentario = require('../models/comentario');
const { generarJWT } = require('../helpers/jwt');
const Post = require('../models/post');

const getComentarios = async (req, res) => {

    const comentario = await Comentario.find()
                                        .populate('usuario', 'nombre alias img')
                                        // .populate('comentario', 'descripcion')
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

const getComentariosByPostId = async (req, res) => {

    const id = req.params.id;
    
    try {
        const comentario = await Comentario.find({ post: id, activo: true })
                                            .where('comentarioPadre').exists(false)
                                            .populate('usuario', 'nombre alias img')
                                            // .populate('post', 'titulo')
                                            .populate({
                                                path: 'respuestas',
                                                match: { activo: true },
                                                populate: { 
                                                    path: 'usuario',
                                                    select: 'nombre alias img'
                                                },
                                                select: 'descripcion fechaCrea activo',
                                                // model: 'usuario',
                                            });
                                            // .exec(function(err, comentario) {
                                            //     comentario = comentario.filter(function(comment) {
                                            //         return 
                                            //     })
                                            // })
        
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

        const post = await Post.findById(comentario.post);
        const postActualizado = await Post.findByIdAndUpdate(comentario.post, { nComentarios: post.nComentarios + 1 }, { new: true});

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
    let prueba = 'a';

    try {
        
        const comentarioDB = await Comentario.findById(id);

        if (!comentarioDB) {
            return res.status(500).json({
                ok: false,
                msg: 'Comentario no encontrado'
            });
        }

        const comentarioPadre = await Comentario.findById(id)
                                            .where('comentarioPadre').exists(false)
                                            .populate({
                                                path: 'respuestas',
                                                match: { activo: true },
                                                populate: { 
                                                    path: 'usuario',
                                                    select: 'nombre alias img'
                                                },
                                                select: 'descripcion fechaCrea activo',
                                            });

        await Comentario.findByIdAndUpdate(id, { activo: 0 }); // or: await Post.findByIdAndDelete(id);

        if (comentarioPadre) {

            if (comentarioPadre.respuestas.length == 0) {
                // Actualizar post (-1)
                let post = await Post.findById(comentarioDB.post);
                await Post.findByIdAndUpdate(comentarioDB.post, { nComentarios: post.nComentarios - 1 }, { new: true});
            }
            else {
                // Actualizar post (-n-1)
                let post = await Post.findById(comentarioDB.post);
                await Post.findByIdAndUpdate(comentarioDB.post, { nComentarios: post.nComentarios - comentarioPadre.respuestas.length - 1 }, { new: true});
            }
            
        }
        else {
            // Actualizar post (-1)
            let post = await Post.findById(comentarioDB.post);
            await Post.findByIdAndUpdate(comentarioDB.post, { nComentarios: post.nComentarios - 1 }, { new: true});
        }


        res.json({
            ok: true,
            msg: 'Comentario borrado',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const crearRespuestas = async (req, res = response) => {
    
    const comentario = new Comentario({
        usuario: req.uid,
        ...req.body
    });

    try {

        const comentarioDB = await comentario.save();
        const comentarioPadreDB = await Comentario.findById(comentario.comentarioPadre);

        let arrayRespuestas = comentarioPadreDB.respuestas;
        arrayRespuestas.push(ObjectId(comentarioDB.id));

        const comentarioPadreActualizado = await Comentario.findByIdAndUpdate(comentarioPadreDB.id, { respuestas: arrayRespuestas });

        const post = await Post.findById(comentario.post);
        const postActualizado = await Post.findByIdAndUpdate(comentario.post, { nComentarios: post.nComentarios + 1 }, { new: true});

        res.json({
            ok: true,
            comentarioPadreActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getComentarios,
    getComentariosByPostId,
    crearComentarios,
    actualizarComentarios,
    borrarComentarios,
    crearRespuestas
}