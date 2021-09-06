const mongoose = require('mongoose');

const dbConnection = async() => {
    
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('Connected...');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión, ver logs.');
    }

}

module.exports = {
    dbConnection
}