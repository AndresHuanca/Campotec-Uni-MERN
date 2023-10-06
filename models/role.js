//debe tener el mismo nombre de la coleccion pero sin la "s"

const { Schema, model } = require('mongoose');

const RoleSchema = Schema({ 

    role:{
        type: String,
        required: [ true, 'The role is mandatory'],
        unique: true, //correo rol
    },
    state:{
        type: Boolean,
        default: true, 
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, { timestamps: true } );

//sobreescribir funcion toJSON para no enviar el password y el _vv y el _id en el postman
RoleSchema.methods.toJSON = function() {

    const {__v, estado, _id, ...data } = this.toObject();
    // Establece en usuario: el Id
    data.user = data.user._id;
    // renombrar el _id publicacion a id
    data.id = _id;    delete data.user._id;
    return data;

};

module.exports = model( 'Role', RoleSchema, 'roles' );