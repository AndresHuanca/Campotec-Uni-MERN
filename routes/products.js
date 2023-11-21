const { Router } = require('express');

//importando para la validacion
const { check } = require('express-validator');

//importando db-validators
const { 
        productCategoryExistsById,
        productExistsById,
} = require('../helpers');


//importando middleware
const { 
        validateFields,
        validateJWT,
} = require('../middlewares');

const {  
        postProduct,
        getProducts,
        getProduct,
        putProduct,
        deleteProduct,
} = require('../controllers/products');


const router = Router();

// POST  - middleware segundo argumento , crear errores
router.post('/', [
        validateJWT,
        //validaciones de los argumentos enviados en post
        check( 'name', 'The name is not valid' ).not().isEmpty(), //isEmpty(¿es vacio?)(no().isEmpty 'no es correo')
        check( 'description', 'The description is not valid' ).not().isEmpty(), 
        check( 'price', 'The price is not valid' ).not().isEmpty(), 
        check( 'image', 'The image is not valid' ).not().isEmpty(), 
        check( 'availability', 'The availability is not valid' ).not().isEmpty(), 
        check( 'category', 'The category is not valid' ).not().isEmpty(), 
        check( 'category', 'It is not a valid id' ).isMongoId(),
        check( 'category' ).custom( productCategoryExistsById ),
        validateFields,

], postProduct );
// Tener en cuenta para crear un usuario administrador con JWT (escalable)

// GET All
router.get('/', [
        // validateJWT,
        validateFields,
], getProducts );

// GET pruct 
router.get( '/:id', [
        check( 'id', 'It is not a valid id' ).isMongoId(),
        check( 'id' ).custom( productExistsById ),
        validateFields,

], getProduct );

// PUT
router.put('/:id',[
        validateJWT,
        check( 'id', 'It is not a valid id' ).isMongoId(),
        check( 'id' ).custom( productExistsById ),
        check( 'name', 'It is not a valid name' ).not().isEmpty(),
        validateFields,

], putProduct );


// DELETE
router.delete('/:id', [
        validateJWT,
        check( 'id', 'No es un Id  Valido' ).isMongoId(),
        check( 'id' ).custom( productExistsById ),
        validateFields,

], deleteProduct );

module.exports = router;