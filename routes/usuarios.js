const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario, agregarPostFavorito } = require('../controllers/usuarios');
const { validarJWT, validarAdminRol, validarAdminRol_o_mismoUsuario } = require('../middlewares/valida-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

/*
* Ruta: /api/usuarios
*/
const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post(
    '/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('alias', 'El alias es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],
    crearUsuarios
);

router.put(
    '/:id',
    [
        validarJWT,
        validarAdminRol_o_mismoUsuario,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('alias', 'El alias es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarUsuario
);

router.delete('/:id', [ validarJWT, validarAdminRol ], borrarUsuario);

router.put('/favoritos/:id',validarJWT, agregarPostFavorito);

module.exports = router;