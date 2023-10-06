const { Router } = require('express');

//importando para la validacion
const { check } = require('express-validator');

//importando db-validators
const { 
        emailExists, 
        userExistsById,
        isValidRole,
} = require('../helpers');


//importando middleware
const { 
        hasRole,
        isAdministratorRole,
        validateFields,
        validateJWT,
} = require('../middlewares');

const {  
        deleteUser,
        getUsers,
        updateUser,
        postUser,
} = require('../controllers/users');


const router = Router();

// POST  - middleware segundo argumento , crear errores
router.post('/', [
        //validaciones de los argumentos enviados en post
        check( 'name', 'The name is not valid' ).not().isEmpty(), //isEmpty(¿es vacio?)(no().isEmpty 'no es correo')
        check( 'lastName', 'The last name is not valid' ).not().isEmpty(), 
        check( 'password', 'The password must be more than 6 letters' ).isLength( { min: 6 } ), //tamaño mino de 6
        check( 'email', 'The email is not valid' ).isEmail(), //validacion que sea email
        check( 'email' ).custom( emailExists ),
        // check( 'role', 'It is not a valid category' ).isIn( [ 'ADMIN_ROLE', 'USER_ROLE ' ] ), //definiendo los roles aceptados
        check( 'role' ).custom( isValidRole ),
        validateFields,

], postUser );
// Tener en cuenta para crear un usuario administrador con JWT (escalable)

// GET
router.get('/', [
        validateJWT,
        validateFields,
], getUsers );

// PUT
router.put('/:id',[
        validateJWT,
        check( 'id', 'It is not a valid id' ).isMongoId(),
        check( 'id' ).custom( userExistsById ),
        check( 'role' ).custom( isValidRole ),
        check( 'email' ).custom( emailExists ),
        validateFields,

], updateUser );
// UserExistsById
// existeUsuarioPorId

// DELETE
router.delete('/:id', [
        validateJWT,
        isAdministratorRole,
        hasRole( 'ADMIN_ROLE', 'VENTAS_ROLE', 'USER_ROLE'),
        check( 'id', 'No es un Id  Valido' ).isMongoId(),
        check( 'id' ).custom( userExistsById ),
        validateFields,

], deleteUser );
// TODO:hasRole is a example for futures proyects

module.exports = router;