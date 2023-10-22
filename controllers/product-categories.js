const { response } = require('express');

const { PostCategory, ProductCategories } = require('../models');

// obtenerCategorias -paginado- total - populate(ulti usuario) moongose
const getCategories = async( req, res = response ) => {

   // Obtener los parámetros de la consulta
    const { limit, from } = req.query;

    // Crear la consulta para obtener las categorías
    const query = { state: true };

    // Obtener las categorías
    const categories = await ProductCategories.find( query )
        .populate( 'user', 'category' )
        .skip( from )
        .limit( limit );

    // Obtener el número total de categorías
    const total = await ProductCategories.countDocuments( query );

    // Enviar la respuesta
    res.json({
        total,
        categories
    });

};

// obtenerCategoria (objeto) populate
const getCategory = async( req, res = response ) => {

    const { id } = req.params;

    // console.log(id)
    const category = await ProductCategories.findById( id ).populate('user', 'category');	
    
    res.json({
        category,
    });

};

const postCategory = async( req, res= response)  => {

    const category = req.body.category.toUpperCase();

    // Generar la data a guardar 
    const data = {
        category,
        user: req.user._id
    };

    // crear categoria
    const categorySave = new ProductCategories( data );
    
    // Guardar en DB
    await categorySave.save();

    // msg
    res.status(201).json( categorySave );

};

// actualizarCategoria nombre
const updateCategory = async( req, res ) => {

    const { id } = req.params;

    // desustructurar
    const { state, user, ...rest } = req.body;
    // para colocar en mayusculas
    rest.category = rest.category.toUpperCase();
    //establecer usuario que hizo ultima modificacion
    rest.user = req.user._id;

    const category = await ProductCategories.findByIdAndUpdate( id, rest, { new: true });

    res.status( 500 ).json({
        category
    });

};

// borrarCategoria - estado:false<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const deleteCategory = async( req, res ) => {

    const { id } = req.params;

    // borrar fisicamente
    const category =  await ProductCategories.findByIdAndDelete( id );

    // const categoria = await CategoriaPublicacion.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json({
        category
    });

};


module.exports = {
    deleteCategory,
    getCategories,
    getCategory,
    postCategory,
    updateCategory,
};