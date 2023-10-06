const { Router } = require('express');

const { check } = require('express-validator');

//importando db-validators
const { 
        categoryNameExists,
        categoryExistsById
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
} = require('../controllers/postcategories');


const router = Router();


// POST
router.post( '/', [ 
    validateJWT,
    check( 'category', 'The category is mandatory').not().isEmpty(),
    check( 'category' ).custom( categoryNameExists ),
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
    check( 'id' ).custom( categoryExistsById ),
    validateFields,

], getCategory );


// UPDATE
router.put( '/:id', [
    validateJWT,
    check( 'category', 'The category is mandatory').not().isEmpty(),
    check( 'id', 'It is not valid id' ).isMongoId(),
    check( 'id' ).custom( categoryExistsById ),
    validateFields,

], updateCategory );

// DEELETE
router.delete( '/:id', [
    validateJWT,
    isAdministratorRole,
    check( 'id', 'It is not valid id ').isMongoId(),
    check( 'id' ).custom( categoryExistsById ),
    validateFields,
], deleteCategory );


module.exports = router;