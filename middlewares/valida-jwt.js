const jwt = require('jsonwebtoken');
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
        console.log(uid);

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


module.exports = {
    validarJWT
}