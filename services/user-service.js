const { postUser, deleteUser } = require("../controllers/users");
const { createCart, deleteCart, createCartService, deleteCartService } = require('./cart-service');

// Servicio para crear un usuario y crear un carrito
const createUserService = async( req, res=response ) => {

    // Creo el usuario
    const user = await postUser( req );
    // Si se crea se crea su carrito
    if( user ){
        // Crea carrito de compras y retorna carrito
        const shoppingCart = await  createCartService( user );

        return res.json( {
            user,
            shoppingCart
        });
    }

};


const deleteUserService = async( userId, res= response ) => {
    // eliminar un usuario
    const user = await deleteUser( userId );
    // Si se eliminar el usuario
    if( user ){
        // Eliminar carrito y retornar carrito eliminado
        const shoppingCart = await deleteCartService( user );
        
        return res.json( {
            user,
            shoppingCart
        });
    }

};

module.exports = { 
    createUserService, 
    deleteUserService, 
};

