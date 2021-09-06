const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');


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
        res.status(500).json({
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

module.exports = {
    login
}