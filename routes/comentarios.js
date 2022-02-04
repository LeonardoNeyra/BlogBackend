const { Router } = require('express');
const { check } = require('express-validator');
const { getComentarios, getComentariosByPostId, crearComentarios, actualizarComentarios, borrarComentarios, crearRespuestas } = require('../controllers/comentarios');
const { validarJWT } = require('../middlewares/valida-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

/*
* Ruta: /api/comentarios
*/
const router = Router();

router.get('/', getComentarios);

router.get('/:id', getComentariosByPostId);

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
    [
        validarJWT,
        check('descripcion', 'La descripción es necesaria').not().isEmpty(),
        validarCampos
    ],
    actualizarComentarios
);

router.delete('/:id', validarJWT, borrarComentarios);

router.post(
    '/respuesta',
    [
        validarJWT,
        check('descripcion', 'La descripción es necesaria').not().isEmpty(),
        check('post', 'El post id debe ser válido').isMongoId(),
        validarCampos
    ],
    crearRespuestas
);

module.exports = router;