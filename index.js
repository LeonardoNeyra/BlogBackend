require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();
app.use(cors());
app.use(express.json()); // parse del body
dbConnection();

// Credenciales
// gunter_user 
// urMief50gCobiEcC

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comentarios', require('./routes/comentarios'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

app.listen( process.env.PORT, () => {
    console.log('Server run on ' + process.env.PORT + ' port');
});

