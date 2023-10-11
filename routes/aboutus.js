const { Router } = require('express');

//importando para la validacion
const { check } = require('express-validator');

//importando db-validators
const {
        aboutUsExistsdById
} = require('../helpers');

//Middlewares 
const { 
        validateJWT,
        validateFields,
        isAdministratorRole
} = require('../middlewares');

// Import controllers
const { 
        getAboutUs, 
        getAboutU, 
        putAboutUs, 
        deleteAboutUs, 
        postAboutUs
} = require('../controllers/aboutus');

const router = Router();


// Crear  - privado - cualquier persona with a token validate
router.post( '/', [
    validateJWT,
    isAdministratorRole,
    check( 'title', 'The title is mandatory' ).not().isEmpty(),
    check( 'imageDescription', 'The imageOfDescription is mandatory' ).not().isEmpty(),
    check( 'description', 'The description is mandatory' ).not().isEmpty(),
    check( 'mission', 'The mission is mandatory' ).not().isEmpty(),
    check( 'vision', 'The title is mandatory' ).not().isEmpty(),
    check( 'imageValues', 'The imageOfValues is mandatory' ).not().isEmpty(),
    check( 'address', 'The address is mandatory' ).not().isEmpty(),
    check( 'email', 'The email is mandatory' ).not().isEmpty(),
    check( 'phone', 'The phone is mandatory' ).not().isEmpty(),
    validateFields,

], postAboutUs );
// TODO:FALTA VALIDAR QUIEN PUEDE CREAR

// GET all aboutus - paginate
router.get( '/',[
    validateFields,
    
], getAboutUs );


// GET aboutus by id
router.get( '/:id', [
    check( 'id', 'It is not valid id' ).isMongoId(),
    check( 'id' ).custom( aboutUsExistsdById ),
    validateFields,

], getAboutU );


// PUT
router.put( '/:id', [
    validateJWT,
    isAdministratorRole,
    check( 'id', 'It is not a valid id' ).isMongoId(),
    check( 'id' ).custom( aboutUsExistsdById ),
    validateFields,

], putAboutUs );
// TODO:¿QUIEN PUEDE PUT-PATCH-DELETE ABOUTUS?(MODELO DE NEGOCIO)
// TODO:PUEDE ACTUALIZAR CUALQUIER CAMPO


// DELETE
router.delete( '/:id', [
    validateJWT,
    isAdministratorRole,
    check( 'id', 'It is not valid id' ).isMongoId(),
    check( 'id' ).custom( aboutUsExistsdById ),
    validateFields,

], deleteAboutUs );

module.exports = router;