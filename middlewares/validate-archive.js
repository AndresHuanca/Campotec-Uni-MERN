

validateUploadFile = ( req, res, next ) => {

    // Validacion para verificar si hay archivos en la carga
    if ( !req.files || Object.keys( req.files ).length === 0 || !req.files.archive ) {
        res.status( 400 ).json({ msg: 'There are no files to upload'});
        return;
    }

    next();
};

module.exports = {
    validateUploadFile,
};