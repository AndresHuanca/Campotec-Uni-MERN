// importat jwt
const jwt = require('jsonwebtoken');


const generateJWT = ( uid = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { uid };

        jwt.sign( payload, process.env.PRIVATESECRETKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if( err ) {
                console.error( err );
                reject( 'Could not generate the token' );
            } else {
                resolve( token );
            }

        });

    });

};

module.exports = {
    generateJWT
};