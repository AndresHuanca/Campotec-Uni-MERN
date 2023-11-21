const { response } = require('express');

const { Products, ShoppingCart } = require('../models');

//POST 
const postShoppingCart = async( req, res = response ) => {
    let data={};
    console.log(req.id)

    // Logica para manejo con rutas y servicios
    if( req.user && req.user._id ) {
        // Crea carrito por ruta
        data.user = req.user._id;
        
    }else{
        // Crea carrito mediante servicio
        data.user = req.id;
    }

    // Crear Publicacion
    const shoppingCart = new ShoppingCart( data );

    // Guardar en DB
    await shoppingCart.save();

    return shoppingCart;
    // msg
    // res.json({
    //     shoppingCart
    // } );

};

// GET Display All
const getProducts = async ( req, res ) => {

    const { limit = 5, from = 0 } = req.query;
    
    const products = await Products.find()
                    .skip(Number( from ))
                    .limit(Number( limit ))
                    .sort( { createdAt: -1 } );

    res.json({
        products
    });
};


//GET Display by Id shopping cart
const getShoppingCart = async ( req, res ) => {

    const { id } = req.params;

    const shoppingCart = await ShoppingCart.findById( id );

    res.json({
        shoppingCart
    });

};

// Get display by Id user
const getShoppingCartByUser = async (req, res) => {
    const { id } = req.params;

    try {
        const shoppingCart = await ShoppingCart.findOne({ user: id });

        if (!shoppingCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Obtener detalles completos de cada producto y transformar la respuesta
        const productsWithDetails = await Promise.all(
            shoppingCart.products.map(async (productInCart) => {
                // Obtener detalles del producto
                const productDetails = await Products.findById(productInCart.product);
                
                if (!productDetails) {
                    return null; // O manejar productos no encontrados de alguna manera
                }

                return {
                    ...productDetails.toObject(),
                    quantity: productInCart.quantity,
                    subTotal: productInCart.subTotal,
                    // _id: productInCart._id,
                    id: productInCart.product,                    
                };
            })
        );

        res.json({
            shoppingCart: {
                products: productsWithDetails.filter(Boolean), // Filtrar productos nulos
                quantity: shoppingCart.quantity,
                total: shoppingCart.total,
            },
        });
    } catch (error) {
        console.error('Error al obtener el carrito de compras:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};




//PUT - Update ShoppinCart 
const putAddShoppingCart = async( req, res ) =>{

    try {
        
        // TODO:ID NO SE UTILIZA-FALTA
        const { id } = req.params;
    
        // desustructurar
        const { subTotal, total, quantity, state, products } = req.body;
    
        // Busco el carrito del usuario
        const  shoppingCart  = await ShoppingCart.findOne({ user: req.user._id })
        // Validación
        if( !shoppingCart ) {
            return res.status(404).json({ error: 'Cart not found'});
        }
    
        // Busco el precio del producto
        const { price } = await Products.findById( products.product )
        // Validación
        if( !price ) {
            return res.status(404).json({ error: 'Product not found'});
        }
    
        // Validar que price y products.quantity sean números válidos
        if (typeof price !== 'number' || typeof products.quantity !== 'number') {
            return res.status(400).json({ error: 'Invalid price or quantity' });
        }

        // Calcular el subTotal del producto
        let subTotalProduct = price * products.quantity;
    
        // Nuevo Producto
        const newProduct = {
            product: products.product,
            quantity: products.quantity,
            subTotal: subTotalProduct,
        };

        // Busca si el producto ya existe en el carrito
        const existingProductIndex = shoppingCart.products
            .findIndex( product => product.product.toString() === products.product );
        
    
        if ( existingProductIndex !== -1 ) {
            // Si el producto ya existe, actualiza sus propiedades
            shoppingCart.products[existingProductIndex].quantity = products.quantity;
            shoppingCart.products[existingProductIndex].subTotal = subTotalProduct;
        } else {
            // Si el producto no existe, agrégalo al array
            shoppingCart.products.push( newProduct );
        }
    
        // Actualiza otras propiedades del carrito (total, quantity, etc.)
        // Calcula el total sumando los subtotales de todos los productos
        shoppingCart.total = shoppingCart.products.reduce((total, product) => total + product.subTotal, 0);
        // Calcula la cantidad total sumando las cantidades de todos los productos
        shoppingCart.quantity = shoppingCart.products.reduce((quantity, product) => quantity + product.quantity, 0);

        // Guarda el carrito actualizado
        await shoppingCart.save();
    
        return res.status( 200 ).json( shoppingCart );

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error updating the cart' });
    }

};

// PATCH
const patchDeleteShoppingCart = async (req, res) => {
    try {
        const { id } = req.params;
        const shoppingCart = await ShoppingCart.findOne({ user: req.user._id });

        if (!shoppingCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Busca el índice del producto en el carrito
        const productIndex = shoppingCart.products.findIndex(product => product.product.toString() === id );

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in the cart' });
        }

        // Elimina el producto del array
        shoppingCart.products.splice(productIndex, 1);

        // Actualiza el total y la cantidad del carrito según los productos restantes
        shoppingCart.total = shoppingCart.products.reduce((total, product) => total + product.subTotal, 0);
        shoppingCart.quantity = shoppingCart.products.reduce((quantity, product) => quantity + product.quantity, 0);

        // Guarda el carrito actualizado
        await shoppingCart.save();

        return res.status(200).json( shoppingCart );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error deleting the product from the cart' });
    }
};


// DELETE 
const deleteShoppingCart = async ( req= request, res=response ) => {

    let idDelete = null;
    // Logica para manejo con rutas y servicios
    if( req && req.params ){
        idDelete = req.params;
    }else{
        idDelete = req.id;
        // Search carrito a eliminar
        const idCart = await ShoppingCart.findOne( { user: idDelete } );
        // Id de carrito a liminar
        idDelete = idCart.id;
    }

    // borrar fisicamente
    const shoppingCart =  await ShoppingCart.findByIdAndDelete( idDelete );
    
    return shoppingCart;

    // res.json({
    //     shoppingCart
    // });

};

module.exports = {
    deleteShoppingCart,
    getShoppingCart,
    getShoppingCartByUser,
    getProducts,
    postShoppingCart,
    putAddShoppingCart,
    patchDeleteShoppingCart
};