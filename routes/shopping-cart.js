const { Router } = require('express');

//importando para la validacion
const { check } = require('express-validator');

//importando db-validators
const { 
        productCategoryExistsById,
        productExistsById,
        shoppingCartExistsById,
        shoppingCartExistsByIdUser,
} = require('../helpers');


//importando middleware
const { 
        validateFields,
        validateJWT,
} = require('../middlewares');


const { 
        postShoppingCart, 
        putAddShoppingCart, 
        patchDeleteShoppingCart, 
        getShoppingCart,
        getShoppingCartByUser
} = require('../controllers/shopping-cart');


const router = Router();

// POST  - middleware segundo argumento , crear errores
router.post('/', [
        validateJWT,
        validateFields,

], postShoppingCart );
// Tener en cuenta para crear un usuario administrador con JWT (escalable)

// GET All
// router.get('/', [
//         // validateJWT,
//         validateFields,
// ], getProducts );

// GET shoppingCart by Id 
// router.get( '/:id', [
//         check( 'id', 'It is not a valid id' ).isMongoId(),
//         check( 'id' ).custom( shoppingCartExistsById ),
//         validateFields,

// ], getShoppingCart );


// GET shopping by id User
router.get( '/:id', [
        check( 'id', 'It is not a valid id' ).isMongoId(),
        check( 'id' ).custom( shoppingCartExistsByIdUser ),
        validateFields,

], getShoppingCartByUser );


// PUT
router.put('/:id',[
        validateJWT,
        check( 'id', 'It is not a valid id' ).isMongoId(),
        // check( 'id' ).custom( shoppingCartExistsById ),
        check( 'products', 'It is not a valid products' ).isObject(),
        validateFields,

], putAddShoppingCart );

// PATCH
router.patch('/:id',[
        validateJWT,
        check( 'id', 'It is not a valid id' ).isMongoId(),
        validateFields,

], patchDeleteShoppingCart );


// DELETE
// router.delete('/:id', [
//         validateJWT,
//         check( 'id', 'No es un Id  Valido' ).isMongoId(),
//         check( 'id' ).custom( productExistsById ),
//         validateFields,

// ], deleteProduct );

module.exports = router;