const { response, request } = require('express');

//importando para la encriptacion
const bcryptjs = require('bcryptjs');

// Importando modelo usuario
const { User } = require('../models');
const eventEmitt = require('../events/event-handling');


// POST
const postUser = async( req , res = response ) => {

    // una forma de enviar todo {google, ...resto
    const { name, lastName, email, password, role } = req.body;

    // Validación de que no se puede crear  Asuario administrador(OJO)
    if( role === 'ADMIN_ROLE' ) {
        return res.status(400).json({
            msg: 'The request could not be completed due to forbidden data',
        });
        
    }
    // TODO:SOLO SE PUEDE CREAR USUARIOS ADMINS MEDIANTE BACKEND

    const roleUppercase = role.toUpperCase();
    
    //creando instancia de usuario
    let user = new User( { name, lastName, email, password, role: roleUppercase } );

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );
    
    //guardar en DB
    await user.save();

    return user;
    // return res.json({
        
    //     user
    // });

};

// GET
const getUsers = async( req, res = request ) => {

    // tarea hacer una validacion si envian una letra
    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    // UNO---------------------
    // const usuarios = await Usuario.find( query )
    // .skip( Number( desde ))
    // .limit( Number( limite ));

    // saber el total DOS---------------
    // const total = await Usuario.count( query );


    //colecion de las 2 promesas dessutructradas
    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip( Number( from ))
            .limit( Number( limit ))

    ]);


    res.json({
        total,
        users
    });

};

// PUT
const updateUser = async( req, res ) => {
    //para dinamico
    const { id } = req.params;

    //desustructurar, para no poder cambiar
    const { _id, google, state, role, password, ...rest } = req.body;

    if ( password ) {
         //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );

    }

    const user = await User.findByIdAndUpdate( id, rest, { new: true } );

    res.status(200).json({
        user
    });
};


// DELETE
const deleteUser = async( req, res ) => {

    const { id } = req.params;

    // extraer uid
    // const uid = req.uid;

    // borrar fisicamente
    const user =  await User.findByIdAndDelete( id );
    
    // Borrar con estado en false la cuenta
    // const usuario =  await Usuario.findByIdAndUpdate( id, { estado:false } );

    // muestra usuario autenticado
    // const usuarioAuntenticado = req.usuario;

    return user;
    // res.json({
    //     user
    //     // usuarioAuntenticado,
    //     // uid
    // });

};


module.exports = {
    deleteUser,
    getUsers,
    postUser,
    updateUser,
};