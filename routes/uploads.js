const { Router } = require('express');

const { check } = require('express-validator');

const {  
    uploadFiles,
    updateImage,
    showImage,
    updateImageCloudinary,
    uploadImageByPost,
    uploadFilesCloudinary
} = require('../controllers/uploads');

const { allowedCollection } = require('../helpers');
const { validateUploadFile, validateFields, validateJWT } = require('../middlewares');

const router = Router();

//POST - carga de archivos
router.post( '/', [
    validateJWT,
    validateUploadFile,

], uploadFiles );

//POST - carga de archivos cloudinary
router.post( '/:collection', [
    validateJWT,
    check( 'collection').custom( c => allowedCollection( c, [ 'posts', 'products', 'aboutus' ]) ),
    validateUploadFile,

], uploadFilesCloudinary );

// PUT - actualizar Archivo
router.put( '/:collection/:id/:fieldName', [
    // validateJWT,
    check( 'id', 'It is not validate id' ).isMongoId(),
    check( 'collection').custom( c => allowedCollection( c, [ 'posts', 'products', 'aboutus' ]) ),
    validateUploadFile,
    validateFields,

], updateImageCloudinary );
// ], updateImage );
// TODO:updateImage HAY 2, EN CONTROLLER POST AND UPLOAD

// GET - Display Image
router.get( '/:collection/:id', [
    check( 'id', 'It is not validate id' ).isMongoId(),
    check( 'collection').custom( c => allowedCollection( c, [ 'posts', 'products' ]) ),
    validateFields,

], showImage );


module.exports = router;