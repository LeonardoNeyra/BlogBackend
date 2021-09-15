const { Router } = require('express');
const { check } = require('express-validator');
const { getPosts, crearPost, actualizarPost, borrarPost } = require('../controllers/posts');
const { validarJWT } = require('../middlewares/valida-jwt');
const { validarCampos } = require('../middlewares/validar-campos');

/*
* Ruta: /api/posts
*/
const router = Router();

router.get('/', getPosts);

router.post(
    '/',
    [
        validarJWT,
        check('titulo', 'El título es necesario').not().isEmpty(),
        check('cuerpo', 'La descripción es necesaria').not().isEmpty(),
        validarCampos
    ],
    crearPost
);

router.put(
    '/:id',
    [
        validarJWT,
        check('titulo', 'El título es necesario').not().isEmpty(),
        check('cuerpo', 'La descripción es necesaria').not().isEmpty(),
        validarCampos
    ],
    actualizarPost
);

router.delete('/:id', validarJWT, borrarPost);

module.exports = router;