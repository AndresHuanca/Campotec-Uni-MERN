const { response, request } = require('express');

// Para eliminar debe ser ADMIN_ROLE
const isAdministratorRole = ( req = request, res = response, next ) => {

    // error 500 es mio del backen
    // validar que el req.usuario ete viniendo
    if ( !req.user ) {
        return res.status( 500 ).json({
            msg: 'Role verification is required without validating the token first'
        });
    }
    // esta info ya esta en el validar-jwt y usuarios.delete
    const { role, name } = req.user;

    if( role!== 'ADMIN_ROLE' ) {
        return res.status( 401 ).json({
            msg: `The user: ${ name } does not have persmission this operation`
        }); 
    }

    next(); 
};

// Para eliminar desde un rol o varios roles Variables
const hasRole = ( ...roles ) => {

    return ( req, res, next ) => {

        if ( !req.user ) {
            return res.status( 500 ).json({
                msg: 'Role verificarion is required without validating the token first '
            });
        }
        
        // Validar rol que exista en las routes
        if( !roles.includes( req.user.role )) {
            return res.status( 401 ).json({
                msg: `The service required one of these roles ${ roles }`
            });
        }
    
        next();
    };
};

module.exports = {
    hasRole,
    isAdministratorRole,
};