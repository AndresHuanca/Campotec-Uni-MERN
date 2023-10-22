//debe tener el mismo nombre de la coleccion pero sin la "s"
const { Schema, model } = require('mongoose');

const ProductCategoriesSchema = Schema({ 

    category:{
        type: String,
        required: [ true, 'The category is mandatory'],
        unique: true
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

});

//sobreescribir funcion toJSON para no enviar el password y el _vv y el _id en el postman
ProductCategoriesSchema.methods.toJSON = function() {

    const {__v, estado, _id, ...data } = this.toObject();
    data.user.uid = data.user._id;
    data.id = _id
    // Para no mostrar en la respuesta el usuario que creo
    delete data.user;
    return data;

};

module.exports = model( 'ProductCategories', ProductCategoriesSchema, 'productcategories' );
