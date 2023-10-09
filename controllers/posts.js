const { response } = require('express');

const { Post, PostCategory } = require('../models');

//POST 
const postPost = async( req, res = response ) => {

    const { state, user, category, ...body } = req.body;

    const categoryUpperCase = category.toUpperCase();

    // Busco el id de la categoria
    let { id } = await PostCategory.findOne( { category: categoryUpperCase } );

    const data = {
        ...body,
        category: id,
        user: req.user._id
    };

    // Crear Publicacion
    const post = new Post( data );

    // Guardar en DB
    // Insertar al inicio del documento
    await post.save();

    // msg
    res.status(201).json( post );

};

// GET Display All
const getPosts = async ( req, res ) => {

    const { limit = 5, from = 0 } = req.query;
    
    const posts = await Post.find()
                    .skip(Number( from ))
                    .limit(Number( limit ))
                    .sort( { createdAt: -1 } );

    res.json({
        posts
    });
};


//GET Display by Id 
const getPost = async ( req, res ) => {

    const { id } = req.params;

    const post = await Post.findById( id )
                    .populate( 'user', 'title' )
                    .populate( 'category', 'category' );

    //Validacion de DB 
    // verificar si el id existe
    const postExistById = await Post.findById(  id  );

    if ( !postExistById ) {
        return res.status( 400 ).json({
            msg: `The id: ${ id } does not exist`
        });
    }


    res.json({
        post
    });

};




const getPostByCategory = async ( req, res = response ) => {

    const { category } = req.params;
    // Convertir la categoría a mayúsculas
    const categoryUpperCase = category.toUpperCase();
    
    const { id } = await PostCategory.findOne({ category: categoryUpperCase });
    // console.log(cat.id)

    if ( !category ) {
        return res.status(404).json({ error: 'Category not found' });
    }

    const post = await Post.find({ category: id });
    // console.log(publicacion)
    
    if ( !post ) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json( post );

};

//PUT - Update post 
const putPost = async( req, res ) =>{

    const { id } = req.params;

    // desustructurar
    const { state, user, ...rest } = req.body;

    const categoryUpperCase = rest.category.toUpperCase();

    // Busco el id de la categoria
    let { _id } = await PostCategory.findOne( { category: categoryUpperCase } );

    // Establezco el id de la categoria
    rest.category = _id;

    //Set User que hizo el ultimo Update
    rest.user = req.user._id;

    const post = await Post.findByIdAndUpdate( id, rest, { new: true }).populate('user', 'title');

    res.status( 200 ).json({
        post
    });

};

const updateImage = async( req, res = response ) => {

    const { id } = req.params; 
    const { image } = req.body; 

    const post = await Post.findByIdAndUpdate( id, { image }, { new: true });

    if ( !post  ) {
        // Si no se encontró la publicación, devuelve un mensaje de error
        return res.status(404).json({ msg: 'Post not found' });
    }

      // Si la actualización se realizó con éxito, devuelve la publicación actualizada
    res.json( post )
}

// DELETE - Admin Role
const deletePost = async ( req, res ) => {

    const { id } = req.params;

    // borrar fisicamente
    const post =  await Post.findByIdAndDelete( id );

    res.json({
        post
    });

};

module.exports = {
    deletePost,
    getPost,
    getPostByCategory,
    getPosts,
    postPost,
    putPost,
    updateImage,
};