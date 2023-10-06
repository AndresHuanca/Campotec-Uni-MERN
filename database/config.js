const mongoose = require('mongoose');

// funcion para conectarme a la DB
const dbConnection = async() => {

    try {
        await mongoose.connect( process.env.MONGODB_CNN );
        console.log('MongoDB Connected');
    } catch (error) {
        console.log(error);
        throw new Error('Error when starting the database');
    }

};
// TODO:IMPLEMENTAR LOGICA DE MANEJO DE DB EN DEV AND PRODUCTION(ESCALABLE)

module.exports = {
    dbConnection
};