const { Router } = require('express');

const { check } = require('express-validator');

const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarJWT, validateFields, validateJWT } = require('../middlewares');

const router = Router();

// POST - Login
router.post('/login',[
    check('email', 'The email is mandatory').isEmail(),
    check('password', 'The password is mandatory').not().isEmpty(),
    validateFields,

], login );

// POST - google
router.post('/google',[
    check('id_token', 'Google id_token is required').not().isEmpty(),
    validateFields

], googleSignIn );

// GET - renew token al ingresar al Login con JWT
router.get('/', validateJWT, renewToken );

module.exports = router;