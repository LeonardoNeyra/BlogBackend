const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarArchivo } = require('../helpers/actulizar-archivo');

const fileUpload = async (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['usuarios', 'posts', 'comentarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo no es el correcto'
        });
    }

    // Validar que exita un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Procesar el archivo
    const file = req.files.archivos;
    const nombreDividido = file.name.split('.');
    const extensionArchivo = nombreDividido[nombreDividido.length - 1];

    const extensionValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión válida'
        });
    }

    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Poner el archivo en un directorio
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                msg: 'Error al guardar el archivo'
            });
        }

        // Actualizar BD
        actualizarArchivo(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
    
}

const getFile = (req, res = response) => {
    const tipo = req.params.tipo;
    const archivo = req.params.archivo;

    const pathFile = path.join(__dirname, `../uploads/${ tipo }/${ archivo }`);

    if (fs.existsSync(pathFile)) {
        res.sendFile(pathFile);
    }
    else {
        const pathFile = path.join(__dirname, `../uploads/noimage.jpg`);
        res.sendFile(pathFile);s
    }

}


module.exports = {
    fileUpload,
    getFile
}