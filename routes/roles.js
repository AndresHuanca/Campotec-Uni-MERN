const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const { 
        validarJWT, 
        validateJWT,
        validateFields,
        isAdministratorRole,
} = require('../middlewares');

// import controllers
const { 
        obtenerRol,  
        postRole,
        getRoles,
        updateRole,
        deleteRole,
        getRole
} = require('../controllers/roles');

const {  
        rolNameExists,
        roleExistsById
} = require('../helpers');


const router = Router();


// Crear un rol - privado - cualquier persona with a token validate y user admin
router.post( '/', [ 
    validateJWT,
    isAdministratorRole,
    check( 'role', 'The role is mandatory').not().isEmpty(),
    check( 'role' ).custom( rolNameExists ),
    validateFields,
    
], postRole );

// GET all roles
router.get( '/', [
    validateJWT,
    isAdministratorRole,
    validateFields,

], getRoles );

// Get a role by id 
router.get( '/:id', [
    validateJWT,
    check( 'id', 'It is not a valid id' ).isMongoId(),
    check( 'id' ).custom( roleExistsById ),
    validateFields,

], getRole );

// UPDATE - privado - cualquier persona with a token validate
router.put( '/:id', [
    validateJWT,
    check( 'role', 'The role is mandatory').not().isEmpty(),
    check( 'id', 'It is not a valid id' ).isMongoId(),
    check( 'id' ).custom( roleExistsById ),
    isAdministratorRole,
    validateFields,

], updateRole );

// DELETE an rol - Admin
router.delete( '/:id', [
    validateJWT,
    check( 'id', 'It is not a valid id').isMongoId(),
    check( 'id' ).custom( roleExistsById ),
    isAdministratorRole,
    validateFields,
    
], deleteRole );


module.exports = router;