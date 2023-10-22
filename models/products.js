//debe tener el mismo nombre de la coleccion pero sin la "s"

const { Schema, model } = require('mongoose');

const ProductSchema = Schema({ 

    name:{
        type: String,
        required: [ true, 'The name is mandatory'],
    },
    description:{
        type: String,
        required: [ true, 'The description is mandatory'],
        default: true, 
    },
    price: { 
        type: Number, 
    },
    image: { 
        type: String, 
    },
    imageId: { 
        type: String, 
    },
    availability: { 
        type: String, 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'ProductCategories',
        required: true
    },    
}, { timestamps: true } );

//sobreescribir funcion toJSON para no enviar el password y el _vv y el _id en el postman
ProductSchema.methods.toJSON = function() {

    const {__v, estado, _id, ...data } = this.toObject();
    // Establece en usuario: el Id
    data.user = data.user._id;
    // renombrar el _id publicacion a id
    data.id = _id;
    delete data.user._id;
    return data;

};
// tercer argumento para modificar nombre en base de datos sin s
module.exports = model( 'Product', ProductSchema, 'product');