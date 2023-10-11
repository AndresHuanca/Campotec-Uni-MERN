//debe tener el mismo nombre de la coleccion pero sin la "s"

const { Schema, model } = require('mongoose');

const AboutUsSchema = Schema({ 

    title:{
        type: String,
        required: [ true, 'The title is mandatory'],
    },
    imageDescription:{
        type: String,
        required: [ true, 'The imageOfDescription is mandatory'],
    },
    description:{
        type: String,
        required: [ true, 'The description is mandatory'],
    },
    mission:{
        type: String,
        required: [ true, 'The mission is mandatory'],
    },
    vision:{
        type: String,
        required: [ true, 'The vision is mandatory'],
    },
    imageValues:{
        type: String,
        required: [ true, 'The imageOfValues is mandatory'],
    },
    address:{
        type: String,
        required: [ true, 'The address is mandatory'],
    },
    email:{
        type: String,
        required: [ true, 'The email is mandatory'],
    },
    phone:{
        type: String,
        required: [ true, 'The phone is mandatory'],
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
AboutUsSchema.methods.toJSON = function() {

    const {__v, estado, _id, ...data } = this.toObject();
    // Establece en usuario: el Id
    data.user = data.user._id;
    // renombrar el _id publicacion a id
    data.id = _id;    delete data.user._id;
    return data;

};

module.exports = model( 'AboutUs', AboutUsSchema, 'aboutus' );