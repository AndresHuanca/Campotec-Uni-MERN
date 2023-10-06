//optmizando importaciones 

const  validateRoles = require('../middlewares/validate-roles');
const  validateFields  = require('../middlewares/validate-fields');
const  validateJWT  = require('../middlewares/validate-jwt');
const  validateUploadFile  = require('../middlewares/validate-archive');

module.exports = {
    ...validateUploadFile,
    ...validateRoles,
    ...validateFields,
    ...validateJWT,
};