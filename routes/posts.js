const { Router } = require('express');

//importando para la validacion
const { check } = require('express-validator');

//importando db-validators
const {
        isValidCategory,
        postExistsdById
} = require('../helpers');

//Middlewares 
const { 
        validateJWT,
        validateFields
} = require('../middlewares');

// Import controllers
const {
        getPosts,
        postPost,
        getPost,
        getPostByCategory,
        putPost,
        updateImage,
        deletePost
} = require('../controllers/posts');

const router = Router();


// Crear  - privado - cualquier persona with a token validate
router.post( '/', [
    validateJWT,
    check( 'title', 'The title is mandatory' ).not().isEmpty(),
    check( 'description', 'The description is mandatory' ).not().isEmpty(),
    check( 'category', 'The category es mandatory' ).not().isEmpty(),
    check( 'category' ).custom( isValidCategory ),
    validateFields,

], postPost );
// TODO:FALTA VALIDAR QUIEN PUEDE CREAR

// GET all posts - paginado
router.get( '/',[
    validateJWT,
    validateFields,
    
], getPosts );


// GETpublicaciones por id
router.get( '/:id', [
    validateJWT,
    check( 'id', 'It is not valid id' ).isMongoId(),
    validateFields,

], getPost );


// GET publicaciones por categoria
router.get( '/category/:category', [
    validateJWT,
    check( 'category', 'The category is mandatory' ).not().isEmpty(),
    check('category').custom( isValidCategory ),
    validateFields,

], getPostByCategory );


// PUT
router.put( '/:id', [
    validateJWT,
    check( 'id', 'It is not a valid id' ).isMongoId(),
    check( 'id' ).custom( postExistsdById ),
    check( 'category', 'The category is mandatory' ).not().isEmpty(),
    check( 'category' ).custom( isValidCategory ),
    validateFields,

], putPost );
// TODO:¿QUIEN PUEDE PUT-PATCH-DELETE LAS PUBLICACIONES?(MODELO DE NEGOCIO)


// PATCH
router.patch('/:id', [
    validateJWT,
    check( 'id', 'It is not valid id' ).isMongoId(),
    validateFields,

], updateImage );


// DELETE
router.delete( '/:id', [
    validateJWT,
    check( 'id', 'It is not valid id' ).isMongoId(),
    check( 'id' ).custom( postExistsdById ),
    validateFields,

], deletePost );

module.exports = router;