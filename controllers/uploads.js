// Import path and fs
const  path = require('path');
const  fs  = require('fs');

// import clodinary
const cloudinary = require('cloudinary').v2;
// backen autenticado con cloudinary
cloudinary.config( process.env.CLOUDINARY_URL);

const { response } = require('express');
const { uploadFile } = require('../helpers');
// Import Models
const { Post, AboutUs, Products } = require('../models');


const uploadFiles = async( req, res = response ) => {
    
    // para ver el archivo subido en postman}
    // console.log( req.files );

    try {
        // para subir archivos type txt, md
        // const nombre = await uploadFile( req.files, [ 'txt', 'md' ], 'textos' );
        
        // para subir archivos imagens y crea una carpeta posts
        const name = await uploadFile( req.files, undefined, 'posts' );
        res.json({ image: name });
        
    } catch ( msg ) {
        res.status( 400 ).json({ msg });
    }
    
};

const uploadFilesCloudinary = async (req, res) => {
    const { collection } = req.params;


    try {

        // Extract data from req.files.archive
        const { tempFilePath } = req.files.archive;

        // Upload the new image to Cloudinary
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: `RestServer NodeJs/${collection}` });

        res.json({ urlImage: secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};



const updateImage = async (req, res) => {
    const { collection, id } = req.params;

    let model;

    // Validar si existe el ID y el nombre de la colección
    switch (collection) {
        case 'posts':
            model = await Post.findById(id);
            if (!model) {
                return res.status(400).json({ 
                    msg: `No post found with that id${id}`
                });
            }

            break;
        case 'aboutus':
                model = await AboutUs.findById(id);
                if (!model) {
                    return res.status(400).json({ 
                        msg: `No post found with that id${id}`
                    });
                }
    
                break;

        default:
            return res.status(500).json({ msg: 'I forgot to validate this type of post' });
    }
    // Clean image previas
    if ( model.imageId ) {
        // path of image
        const pathImage = path.join( __dirname, '../uploads', collection, model.imageId );
        // delete image server
        if( fs.existsSync( pathImage) ){
            fs.unlinkSync( pathImage );
        }
    }
    // Subir y crear archivo según seu coleccion automatica
    const nameImageId = await uploadFile( req.files, undefined, collection );
    model.imageId = nameImageId;

    // guardar en DB
    await model.save();

    res.json( { imageId: nameImageId} ); 
}


// actualizar con cloudinary 
const updateImageCloudinary = async (req, res) => {
    const { collection, id, fieldName } = req.params;

    let model;

    // Validar si existe un ID y el nombre de la colección
    switch (collection) {
        case 'publications':
            model = await Post.findById( id );
            if (!model) {
                return res.status(400).json({
                    msg: `No post found with that ID: ${ id }`
                });
            }
            break;

        case 'products':
                model = await Products.findById( id );
                if (!model) {
                    return res.status(400).json({
                        msg: `No post found with that ID: ${ id }`
                    });
                }
                break;

        case 'aboutus':
            model = await AboutUs.findById( id );
            if (!model) {
                return res.status(400).json({
                    msg: `No post found with that ID: ${ id }`
                });
            }
            break;

        default:
            return res.status(500).json({ msg: 'I forgot to validate this type of post in Cloudinary' });
    }

    // Eliminar la imagen anterior en el campo fieldName (si existe)
    if (model[fieldName]) {
        // Extraer el public_id de la imagen anterior
        const nameArr = model[fieldName].split('/');
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split('.');

        // Eliminar la imagen anterior de Cloudinary
        await cloudinary.uploader.destroy(public_id);
    }

    // extraer de req.files.archivo sus datos
    const { tempFilePath } = req.files.archive;
    // Dentro de tempFilePath existe secure_url
    // const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); clase
    
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath,{ folder: `RestServer NodeJs/${ collection }`} );

    // Asigna la nueva URL de imagen al campo específico en el modelo
    model[fieldName] = secure_url;

    await model.save();

    res.json({
        secure_url
    });
};


// GET - Display image
const showImage = async ( req, res ) => {
    // dessustructurar date of params
    const { collection, id } = req.params;

    let model;

    switch ( collection ) {
        case 'posts': 
            model = await Post.findById( id );

            if( !model ) {
                return res.status( 400 ).json({ 
                    msg: `No post found with that id: ${ id }`
                });
            }
            
            break;
            
            // case 'productos': 
            //     modelo = await Producto.findById( id );
        //     if( !modelo ) {
            //         return res.status( 400 ).json({ 
                //             msg: `No se encontro Producto con ese Id ${ id }`
                //         });
                //     }
                
                //     break;
                
        default:
            return res.status( 500 ).json({ msg: 'I forgot to validate this type of post'} );
    }
                
    if( model.imageId ) {
        // path of image
        const pathImage = path.join( __dirname, '../uploads', collection, model.imageId );

        // delete image server
        if( fs.existsSync( pathImage ) ){
            // retunr image
            return res.sendFile( pathImage );
        }
    }

   //Cuando un producto or users no tienen imagenes retunr notImage 
    const pathFaltaImage = path.join( __dirname, '../assets/no-image.jpg' );
    return res.sendFile( pathFaltaImage );

    // Cuando no existe image
    // res.json({ msg: 'falta place holder'})
};




module.exports = {
    showImage,
    updateImage,
    updateImageCloudinary,
    uploadFiles,
    uploadFilesCloudinary
};