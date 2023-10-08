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
const { Post } = require('../models');


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

const uploadImageByPost = async( req, res ) => {

    const { collection, id } = req.params;
    
    try {
        // Validación de collection permitida
        switch ( collection ) {
            case 'posts': 
                // Save Image 
                const nameImage = await uploadFile( req.files, undefined, collection );
                // console.log(nameImage)

                // Extraer path de imagen guardada
                const pathImage = path.join( __dirname, '../uploads', collection, nameImage );
                // console.log(pathImage)
                
                // Guadar la ruta de la imagen en el atibuto image de la publicacion
                const { image } = await Post.findById( id );
                
                if( image ) {

                    const post = await Post.findByIdAndUpdate( id, { image: pathImage }, { new: true });
                    res.sendFile( pathImage );
    
                    if ( !post  ) {
                        // Si no se encontró la publicación, devuelve un mensaje de error
                        return res.status(404).json({ msg: 'Post not found - Upload' });
                    }
            
                }

                break;
                
            default:
                return res.status( 500 ).json({ msg: 'I forgot to validate this type of post'} );
        }
        
    } catch ( msg ) {
        res.status( 400 ).json({ msg });
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

        default:
            return res.status(500).json({ msg: 'I forgot to validate this type of post' });
    }

    // Clean image previas
    if (model.imageId) {
        // path of image
        const pathImage = model.imageId; // Utiliza la ruta completa almacenada en model.image

        // delete image server
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
            console.log('Eliminó', model.image);
        }
    } 

    // Subir y crear archivo según su colección automáticamente
    const nameImage = await uploadFile(req.files, undefined, collection);
    
    // Actualizar la propiedad 'image' del modelo con la nueva ruta completa
    model.imageId = path.join(__dirname, '../uploads', collection, nameImage); // Almacena la ruta completa
    
    // Guardar el modelo actualizado en la base de datos
    await model.save();
    
    res.json( {image: nameImage} ); // Envía la ruta completa
}


// actualizar con cloudinary 
const updateImageCloudinary = async( req, res ) => {

    const { collection, id } = req.params;

    let model;
    
    // Validar si existe id and name of colection  
    switch ( collection ) {
        case 'publications': 
            model = await Post.findById( id );
            if( !model ) {
                return res.status( 400 ).json({ 
                    msg: `No post found with that id: ${ id }`
                });
            }

            break;

        // case 'products': 
        //     model = await Products.findById( id );
        //     if( !model ) {
        //         return res.status( 400 ).json({ 
        //             msg: `No products found with that id: ${ id }`
        //         });
        //     }
            
        //     break;
    
        default:
            return res.status( 500 ).json({ msg: 'I forgot to validate this type of post-cloudinary'} );
    }
    
    //Clean image previas
    if( model.image ) {
        // desustructurar
        const nameArr = model.image.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy( public_id );
    
    } 

    // extraer de req.files.archivo sus datos
    const { tempFilePath } = req.files.archive;
    // Dentro de tempFilePath existe secure_url
    // const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); clase

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath,{ folder: `RestServer NodeJs/${ collection }`} );

    // Asignar
    model.image = secure_url;

    await model.save();

    res.json({
        model       
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
            console.log(model)
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
    uploadImageByPost,
};