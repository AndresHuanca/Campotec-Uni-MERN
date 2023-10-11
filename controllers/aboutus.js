const { response } = require('express');

const { AboutUs } = require('../models');

//POST 
const postAboutUs = async( req, res = response ) => {

    const { state, user, ...body } = req.body;
    // convert to uppercase
    body.title= body.title.toUpperCase();
    
    // Generar la data a guardar 
    const data = {
        ...body,
        user: req.user._id
    };

    // Crear 
    const aboutUs = new AboutUs( data );

    // Guardar en DB
    await aboutUs.save();
    // msg
    res.status(201).json( aboutUs );

};

// GET Display All
const getAboutUs = async ( req, res ) => {

    const { limit = 5, from = 0 } = req.query;

    try {
            
        const aboutUs = await AboutUs.find()
                    .skip(Number( from ))
                    .limit(Number( limit ))
                    .sort( { createdAt: -1 } );

        res.json({
            aboutUs
        });
    
    } catch (error) {
        if (error.code === 11000) {
            // Este es un error de clave duplicada
            res.status(400).json({
              error: "Clave duplicada: El título ya existe en la base de datos.",
            });
          } else {
            // Otro tipo de error, puedes manejarlo de acuerdo a tus necesidades
            console.error(error); // Para registrar el error en la consola
             res.status(500).json({
              error: "Error interno del servidor",
            });
          }
        
    }
    
};


//GET Display by Id 
const getAboutU = async ( req, res ) => {

    const { id } = req.params;

    const aboutUs = await AboutUs.findById( id )
                    .populate( 'user', 'name' )

    res.json({
        aboutUs
    });

};


//PUT - Update aboutUs 
const putAboutUs = async( req, res ) =>{

    const { id } = req.params;

    // desustructurar
    const { state, user, ...rest } = req.body;

    rest.title = rest.title.toUpperCase();

    //Set User que hizo el ultimo Update
    rest.user = req.user._id;

    const aboutUs = await AboutUs.findByIdAndUpdate( id, rest, { new: true })
                            .populate('user', 'name');

    res.status( 200 ).json({
        aboutUs
    });

};


// DELETE - Admin Role
const deleteAboutUs = async ( req, res ) => {

    const { id } = req.params;

    // borrar fisicamente
    const aboutUs =  await AboutUs.findByIdAndDelete( id );

    res.json({
        aboutUs
    });

};

module.exports = {
    deleteAboutUs,
    getAboutU,
    getAboutUs,
    postAboutUs,
    putAboutUs,
};