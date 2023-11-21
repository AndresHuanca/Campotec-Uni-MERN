const { response } = require('express');

const { Post, PostCategory, ProductCategories, Products } = require('../models');

//POST 
const postProduct = async( req, res = response ) => {

    const { imageId, user, category, ...body } = req.body;

    // Busco el id de la categoria
    let { id } = await ProductCategories.findById( req.body.category );

    // TODO:FALTA EL REVIEW
    const data = {
        ...body,
        category: id,
        name: body.name.toUpperCase(),
        review: null,
        user: req.user._id
    };

    // Crear Publicacion
    const product = new Products( data );

    // Guardar en DB
    await product.save();

    // msg
    res.status(201).json( product );

};

// GET Display All
const getProducts = async ( req, res ) => {

    const { limit = 5, from = 0 } = req.query;
    
    const products = await Products.find()
                    .skip(Number( from ))
                    .limit(Number( limit ))
                    .sort( { createdAt: -1 } );

    res.json({
        products
    });
};


//GET Display by Id 
const getProduct = async ( req, res ) => {

    const { id } = req.params;

    const product = await Products.findById( id );

    res.json({
        product
    });

};


//PUT - Update post 
const putProduct = async( req, res ) =>{

    const { id } = req.params;

    // desustructurar
    const { user, ...rest } = req.body;

    rest.name = rest.name.toUpperCase();

    // Busco el id del producto
    let { _id } = await Products.findById( id );

    // Establezco el id de la categoria
    rest.category = _id;

    //Set User que hizo el ultimo Update
    rest.user = req.user._id;

    const product = await Products.findByIdAndUpdate( id, rest, { new: true });

    res.status( 200 ).json({
        product
    });

};

// DELETE 
const deleteProduct = async ( req, res ) => {

    const { id } = req.params;

    // borrar fisicamente
    const product =  await Products.findByIdAndDelete( id );

    res.json({
        product
    });

};

module.exports = {
    deleteProduct,
    getProduct,
    getProducts,
    postProduct,
    putProduct,
};