// para utilizar path 
const path = require('path');
// Importando uuid para uid unicos para los archivos
const { v4: uuidv4 } = require('uuid');


const uploadFile = ( files, validExtensions = [ 'png', 'jpg', 'jpeg', 'gif' ], folder = '' ) => {

    return new Promise( ( resolve, reject ) => {
        
        // desustructurar 
        const { archive } = files;
        const shortenedName = archive.name.split('.'); //separa desdeel punto al tipo de archivo
        const extension = shortenedName[ shortenedName.length - 1 ];
    
        // Validar la Extension
        if( !validExtensions.includes( extension ) ) {
            return reject( `The extension: ${ extension } is not valid`,
                            `Valid extensions: ${ validExtensions }`);
    
        }
    
        // Concatenar el nuevo id unique with la extension
        const temporaryName = uuidv4() + '.' + extension;
    
        // path para colocar el archivo
        // con archivo.name in the path asigna nombre original path.join( __dirname, '../uploads/', archivo.name )
        const uploadPath = path.join( __dirname, '../uploads/', folder, temporaryName );
    
        archive.mv( uploadPath, (err) => {
            if ( err ) {
                reject(err);
            }
    
            resolve( temporaryName );
    
        });

    });
    

};

module.exports = {
    uploadFile
};