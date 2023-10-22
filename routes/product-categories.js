const { Router } = require('express');

const { check } = require('express-validator');

//importando db-validators
const { 
        productCategoryNameExists,
        productCategoryExistsById
} = require('../helpers');

// Middlewares
const {   
        validateJWT,
        validateFields,
        isAdministratorRole
} = require('../middlewares');

// import controllers
const {  
        getCategories,
        postCategory,
        getCategory,
        updateCategory,
        deleteCategory
} = require('../controllers/product-categories');


const router = Router();


// POST
router.post( '/', [ 
    validateJWT,
    check( 'category', 'The category is mandatory').not().isEmpty(),
    check( 'category' ).custom( productCategoryNameExists ),
    validateFields

], postCategory );

// GET all
router.get( '/',[
    validateJWT,
    validateFields,
    
], getCategories );

// GET una categoria by id - publico
router.get( '/:id', [
    validateJWT,
    check( 'id', 'It is not valid id' ).isMongoId(),
    check( 'id' ).custom( productCategoryExistsById ),
    validateFields,

], getCategory );


// UPDATE
router.put( '/:id', [
    validateJWT,
    check( 'category', 'The category is mandatory').not().isEmpty(),
    check( 'id', 'It is not valid id' ).isMongoId(),
    check( 'id' ).custom( productCategoryExistsById ),
    validateFields,

], updateCategory );

// DEELETE
router.delete( '/:id', [
    validateJWT,
    isAdministratorRole,
    check( 'id', 'It is not valid id ').isMongoId(),
    check( 'id' ).custom( productCategoryExistsById ),
    validateFields,
], deleteCategory );


module.exports = router;