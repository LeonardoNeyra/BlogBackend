const { Router } = require('express');
const { check } = require('express-validator');
const { getComentarios, crearComentarios, actualizarComentarios, borrarComentarios } = require('../controllers/comentarios');
const { validarJWT } = require('../middlewares/valida-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

/*
* Ruta: /api/medico
*/
const router = Router();

router.get('/', getComentarios);

router.post(
    '/',
    [
        validarJWT,
        check('descripcion', 'La descripción es necesaria').not().isEmpty(),
        check('post', 'El post id debe ser válido').isMongoId(),
        validarCampos
    ],
    crearComentarios
);

router.put(
    '/:id',
    [],
    actualizarComentarios
);

router.delete('/:id', borrarComentarios);

module.exports = router;