const { Router } = require('express');
const { validarJWT } = require('../middlewares/valida-jwt');
const { getBusqueda, getBusquedaPorColeccion } = require('../controllers/busqueda');

/*
* Ruta: /api/todo/:busqueda
*/

const router = Router();

router.get('/:busqueda', validarJWT, getBusqueda);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getBusquedaPorColeccion);

module.exports = router;