const { postShoppingCart, deleteShoppingCart } = require('../controllers/shopping-cart');
// Servicio para crear carrito 
const createCartService = async( user ) => {
    // Crea carrito
    const shoppingCart = await postShoppingCart( user );
    // retorna carrito
    return shoppingCart;
};
// Servicio para eeliminar carrito
const deleteCartService = async( user ) => {
    // Eliminar carrito
    const shoppingCart = await deleteShoppingCart( user );
    // retorna carrito
    return shoppingCart;
};

module.exports = { 
    createCartService,
    deleteCartService,
};
