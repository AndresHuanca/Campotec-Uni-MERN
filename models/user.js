const { Schema, model } = require('mongoose');

//Modelo de Uusuario
const UserSchema = Schema ({ 
    name: { 
        type: String, 
        required: [ true, 'The name is mandatory' ], 
    },
    lastName: { 
        type: String, 
        required: [ true, 'The name is mandatory' ], 
    },
    email: { 
        type: String, 
        required: [ true, 'The email is mandatory'],
        unique: true, //correo unico
    },
    password: {  
        type: String, 
        required: [ true, 'The password is mandatory'],
    },
    image: { 
        type: String, 
    },
    role: { 
        type: String, 
        required: [ true, 'The role is mandatory'],
        enum: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    },
    state: { 
        type: Boolean,  
        default: true
    },
    google: { 
        type: Boolean,  
        default: false
    },
}, { timestamps: true } );

//sobreescribir funcion toJSON para no enviar el password y el _vv y el _id
UserSchema.methods.toJSON = function() {

    const {__v, password, _id, ...user } = this.toObject();
    // cambia nombre de _id a uid
    user.uid = _id;
    return user;

};

module.exports = model( 'User', UserSchema, 'users' );