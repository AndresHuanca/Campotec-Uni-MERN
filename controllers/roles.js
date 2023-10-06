const { response } = require('express');
const { Role } = require('../models');


// POST
const postRole = async( req, res= response)  => {

    const role = req.body.role.toUpperCase();

    // Validacion si esta en la DB
    const rolDB = await Role.findOne({ role });
    // Para no crear otra igual 
    if( rolDB ) {
        return res.status( 400 ).json({
            msg: `The role: ${ rolDB.rol } exists in DB`
        });
    }

    // Generar la data a guardar 
    const data = {
        role,
        user: req.user._id
    };

    // Create rol category
    const roleSave = new Role( data );
    
    // Save to the database
    await roleSave.save();

    // msg
    res.status(201).json( roleSave );

};

// GET -paginado- total - populate(ulti usuario) moongose
const getRoles = async( req, res= response ) => {

    const { limit = 5, from = 0 } = req.query;
    // para mostrar los que no estan eliminados 
    const query = { state: true };


    const [ total, roles ] = await Promise.all([
        Role.countDocuments( query),
        Role.find( query )
            .populate('user', 'role')
            .skip( Number( from ))
            .limit( Number( limit ))

    ]);

    res.json({
        total,
        roles
    });

};

// obtenerCategoria (objeto) populate
const getRole = async( req, res = response ) => {

    const { id } = req.params;

    const role = await Role.findById(id).populate('user', 'role');	

    res.json({
        role,
    });

};


// actualizarCategoria nombre
const updateRole = async( req, res ) => {

    const { id } = req.params;

    // desustructurar
    const { state, user, ...rest } = req.body;
    // para colocar en mayusculas
    rest.rol = rest.role.toUpperCase();
    //establecer usuario que hizo ultima modificacion
    rest.user = req.user._id;

    const roleSave = await Role.findByIdAndUpdate( id, rest, { new: true } );

    res.status( 500 ).json({
        roleSave
    });

};

// DELETE
const deleteRole = async( req, res ) => {

    const { id } = req.params;

    // Physically delete
    const role =  await Role.findByIdAndDelete( id );

    res.json({
        role
    });

};


module.exports = {
    deleteRole,
    getRoles,
    getRole,
    postRole,
    updateRole,
};