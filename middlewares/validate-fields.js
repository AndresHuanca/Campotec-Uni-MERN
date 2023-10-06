//importando validator de correo model
const { validationResult } = require('express-validator');


const validateFields = ( req, res, next ) => {
    //isEmpty(si esta vacio)
    //validacion si vienen errores de routes
    const errors = validationResult( req );
    if( !errors.isEmpty() ) {
        return res.status( 400 ).json( errors );
    }

    next();

};


module.exports = {
    validateFields,
};