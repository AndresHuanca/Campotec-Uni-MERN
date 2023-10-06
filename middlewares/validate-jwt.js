const jwt = require('jsonwebtoken');
//validación  para la DB
const { User } = require('../models');



const validateJWT = async( req, res, next ) => {
    // leer de los headers
    const token = req.header('x-token');
    
    //si no envian token validacion
    if( !token ) {
        return res.status( 401 ).json({ 
            msg:'There is no token in the request'
        });
    }

    try {
        // verifica el jwt
        const { uid } = jwt.verify( token, process.env.PRIVATESECRETKEY );

        // leer usuario que corresponde al uid 
        const user = await User.findById( uid );

        // colocar en la req
        req.user = user; 

        // para extraer uid y regrabar en la req
        // req.uid = uid;

        // Validar que el usuario exista en la DB
        if ( !user ) {
            return res.status( 401 ).json({
                msg: 'Invalid token - User does not exists in the database'
            });
        }

        // Verficar si el uid tiene estado true
        if ( !user.state ) {
            return res.status( 401 ).json({
                msg: 'Invalid token - User with a false status'
            });
        }

        // para que continue con lo que sigue
        next();
        
    } catch ( error ) {

        console.log(error);
        res.status( 401 ).json({ 
            msg:'Invalid token'
        });
        
    }   
    
};

module.exports = {
    validateJWT
};