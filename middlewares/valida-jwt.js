const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');
// const jwt = require('../helpers/jwt');


const validarJWT = (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        // console.log(uid);

        req.uid = uid;

        // JWT
        // jwt-1
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

    next();
}

const validarAdminRol = async(req, res, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            });
        }

        if (usuarioDB.rol !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para la accion.'
            });
        }
        
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const validarAdminRol_o_mismoUsuario = async(req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            });
        }

        if (usuarioDB.rol === 'ADMIN_ROLE' || uid === id) {
            next();
        }
        else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para la accion.'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    validarJWT,
    validarAdminRol,
    validarAdminRol_o_mismoUsuario
}