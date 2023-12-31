
const dbValidators = require('./db-validators');
const generarJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...uploadFile,
};