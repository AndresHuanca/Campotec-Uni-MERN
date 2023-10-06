const { response } = require('express');
// para validar la contraseña 
const bcryptjs = require('bcryptjs'); 

const { User } = require('../models');
const { googleVerify, generateJWT } = require('../helpers');

// Controller Login
const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe 
        const user = await User.findOne({ email });
        if( !user ) {
            return res.status(400).json({ 
                msg: 'Invalid email',
            });
        }

        //verificar si el usuario esta activo
        if( !user.state ) {
            return res.status(400).json({ 
                msg: 'Email in false state',
            });
        }
        
        // Verificar si contraseña es correcta
        const validPassword = bcryptjs.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'The password is not correct',
            });
        }
        
        // Generar JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            msg: 'Talk to the administrador - Login'
        });
    }


};

// Controller Login Google Sign-in
const googleSignIn = async( req, res = response  ) => {

    const { id_token } = req.body;

    try {

        const googleUser = await googleVerify( id_token );
        const { email, name, image } = await googleVerify( id_token );
 
        console.log(googleUser);

        let user = await Usuario.findOne({ email });
        
        // correo no existe validacion
        if ( !user ) {
            // Tengo que crearlo
            const data = { 
                name,
                email,
                role: 'USER_ROLE', //Asigna un rol por default 
                password: ':p',
                image,
                google: true
            };
     
            user = new User( data );
            await user.save();

        }

        // Si el usuario su estado en DB en estado de false
        if( !user.estado ) {
            return res.status( 401 ).json({
                msg: 'Talk to the administrator, user in false state'
            });
        }
        
        // Generar JWT 
        let token = await generateJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            ok: false,
            msg: 'The token could not be verified - GoogleSignIn  '
        });
        
    }

};

// Renueva el token para el fronten una vez iniciado sesión
const renewToken = async( req, res = response) => {

    const { user } = req;
     // Generar el JWT
    const token = await generateJWT( user.id);

    res.json({
        user,
        token
    });
}

module.exports = {
    googleSignIn,
    login,
    renewToken,
};