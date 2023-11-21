//debe tener el mismo nombre de la coleccion pero sin la "s"

const { Schema, model } = require('mongoose');

const ShoppingCartSchema = Schema({ 

    products:[{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
        },
        quantity: {            
            type: Number,
        } ,
        subTotal: {
            type: Number,
        }
    }],
    quantity:{
        type: Number,
    },
    total: { 
        type: Number,
    },
    state:{
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }    
}, { timestamps: true } );

//sobreescribir funcion toJSON para no enviar el password y el _vv y el _id en el postman
ShoppingCartSchema.methods.toJSON = function() {

    const {__v, estado, _id, ...data } = this.toObject();
    // Establece en usuario: el Id
    data.user = data.user._id;
    // renombrar el _id publicacion a id
    data.id = _id;
    delete data.user._id;
    return data;

};
// tercer argumento para modificar nombre en base de datos sin s
module.exports = model( 'ShoppingCart', ShoppingCartSchema, 'shoppingcart');