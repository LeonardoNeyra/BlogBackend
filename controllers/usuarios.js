const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email rol img')
            .skip(desde)
            .limit(5)
        , Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        uid: req.uid,
        usuarios,
        total
    });
}

const crearUsuarios = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email, activo: true });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);
        // Generar token JWT
        const token = await generarJWT(usuario.id);

        // Guardar usuario
        await usuario.save();

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
    
}

const actualizarUsuario = async (req, res = response) => {

    const  uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        const { password, email, ...campos} = req.body;
        
        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email: email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        // Elimina directamente el registro
        // await Usuario.findByIdAndDelete(uid);

        // Desactiva el campo de 'activo'
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, { activo: 0 } , { new: true });

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}