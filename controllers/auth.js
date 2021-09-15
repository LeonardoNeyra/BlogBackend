const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {
    
    const { email, password } = req.body;
    
    try {

        // Verificar emial
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Email o contraseña inválido'
            });
        }
        
        // Verificar contraseña
        const validadPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if (!validadPassword) {
            res.status(404).json({
                ok: false,
                msg: 'contraseña inválido'
            });
        }

        // Generar token JWT
        const token = await generarJWT(usuarioDB.id);

        // Todo conforme
        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

// Fuente: https://developers.google.com/identity/sign-in/web/backend-auth
const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                alias: name,
                email,
                password: 'nopwd',
                img: picture,
                google: true
            });
        }
        else {
            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = 'nopwd'; 
            // Con esta línea pierde la auth normal, solo le queda la GoogleAuth.
            // Sin esa línea, mantiene ambas auths.
        }

        // Guardar en DB
        await usuario.save();

        // Generar token JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            ok: true,
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Probable token caducado.',
            error
        });
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar token JWT
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}