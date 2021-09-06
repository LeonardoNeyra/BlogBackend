const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { fileUpload, getFile } = require('../controllers/upload');
const { validarJWT } = require('../middlewares/valida-jwt');

/*
* Ruta: /api/upload
*/

const router = Router();
router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload );
router.get('/:tipo/:archivo', getFile );

module.exports = router;