const { Router } = require('express');

const { check } = require('express-validator');

const {  
    uploadFiles,
    updateImage,
    showImage,
    updateImageCloudinary,
    uploadImageByPost
} = require('../controllers/uploads');

const { allowedCollection } = require('../helpers');
const { validateUploadFile, validateFields, validateJWT } = require('../middlewares');

const router = Router();

//POST - carga de archivos
router.post( '/', [
    validateJWT,
    validateUploadFile,

], uploadFiles );

//POST - carga de imagenes por publicacion
router.post( '/:collection/:id', [
    validateJWT,
    validateUploadFile,

], uploadImageByPost );
// TODO:FALTA ARREGLAR ENDPOIND PARA QUE SEA PURO INGLES

// PUT - actualizar Archivo
router.put( '/:collection/:id', [
    validateJWT,
    check( 'id', 'It is not validate id' ).isMongoId(),
    check( 'collection').custom( c => allowedCollection( c, [ 'posts', 'products' ]) ),
    validateUploadFile,
    validateFields,

], updateImage );
// ], updateImageCloudinary );
// TODO:updateImage HAY 2, EN CONTROLLER POST AND UPLOAD

// GET - Display Image
router.get( '/:collection/:id', [
    check( 'id', 'It is not validate id' ).isMongoId(),
    check( 'collection').custom( c => allowedCollection( c, [ 'posts', 'products' ]) ),
    validateFields,

], showImage );


module.exports = router;