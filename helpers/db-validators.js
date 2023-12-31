//importando modelo usuario //importando modelo categoria
const { Role, User, Post, PostCategory, AboutUs, ProductCategories, Products, ShoppingCart } = require('../models');

//--------------------------------------USERS------------------------------------- 
//verificar si el usuario existe
const userExistsById = async ( id = '' ) => {  
    let userExists = await User.findById( id );
    if( !userExists ) {
        throw new Error( `The user's id: ${ id } does not exist in the database` );
    }

};

//verificar si el correo existe
const emailExists = async ( email = '' ) => {  
    let emailExists = await User.findOne( { email } );
    if( emailExists ) {
        throw new Error( `The email: ${ email } already exists in the database` );
    }

};

//--------------------------------------ROLES------------------------------------ 
//validar role que esta en la base de datos
const isValidRole = async( role = '' ) => {

    let isValidRole = await Role.findOne( { role } );
    if ( !isValidRole ) {
        throw new Error( `The role: ${ role } sent is not fount in the database` );
    }
};

// Validación de Nombre unico por nombre
const rolNameExists = async ( role = '' ) => {
    // Convirtiendo a toUpperCase porque asi esta en la DB
    role = role.toUpperCase();  
    //verificar si el correo existe
    let rolExists = await Role.findOne( { role } );
    if( rolExists ) {
        throw new Error( `The role: ${ role } already exists` );
    }

};

// Validación de Nombre unico por ID
const roleExistsById = async ( id = '' ) => { 
    // verifficar si el id existe
    let roleExists = await Role.findById( id );
    if( !roleExists ) {
        throw new Error( `The id: ${ id } does not exist`)
        
    }
};

// ----------------------CATEGORIAPUBLICACION-----------------------------
// Validaciones de BD de CATEGORIAS
const categoryExistsById = async ( id = '' ) => { 
    // verifficar si el id existe
    let categoryExistsById = await PostCategory.findById( id );
    if( !categoryExistsById ) {
        throw new Error( `The id: ${ id } not found`)
        
    }
};

// Validación de Nombre de  Categoria valida
const isValidCategory = async( category = '' ) => {
    
    category = category.toUpperCase();  

    let isValidCategory = await PostCategory.findOne( { category } );
    if ( !isValidCategory ) {
            throw new Error( `The category: ${ category } send not fount in the database` );
    }
};

// Validación de Nombre unico de Categorias
const categoryNameExists = async ( category = '' ) => {
    // Convirtiendo a toUpperCase porque asi esta en la DB
    category = category.toUpperCase();  
    //verificar si el correo existe
    let categoryExists = await PostCategory.findOne( { category } );
    
    if( categoryExists ) {
        throw new Error( `The category: ${ category } already exists` );
    }

};
// ----------------------POST-----------------------------

const postExistsdById = async ( id = '' ) => { 
    // verifficar si el id existe
    let postExists = await Post.findById( id );
    if( !postExists ) {
        throw new Error( `The id: ${ id } not found`)
        
    }
};


//-----------------------PUBLICACION----------------------------------- 
// Validación de Nombre unico de Productos
const nombreProductoExiste = async ( nombre = '' ) => {  
    // Convirtiendo a toUpperCase porque asi esta en la DB
    nombre = nombre.toUpperCase();
    //verificar si el correo existe
    let existeNombre = await Producto.findOne( { nombre } );
    if( existeNombre ) {
        throw new Error( `El nombre ${ nombre } ya existe` );
    }

};


// Validaciones de Carga de Archivos
const allowedCollection =  ( collection = '', collections = [] ) => {

    const included = collections.includes( collection );

    if( !included ) {
        throw new Error( `The collection: ${ collection } not found, Allowed: ${ collections }`);
    }

    return true;
};

//------------------------------ABOUTUS----------------------

const aboutUsExistsdById = async ( id = '' ) => { 
    // verifficar si el id existe
    let aboutUsExists = await AboutUs.findById( id );
    if( !aboutUsExists ) {
        throw new Error( `The id: ${ id } not found`)
        
    }
};

//-------------------------------CATEGORIAPRODUCTO-----------------------------
// Validación de Nombre unico de Categorias
const productCategoryNameExists = async ( category = '' ) => {
    // Convirtiendo a toUpperCase porque asi esta en la DB
    category = category.toUpperCase();  
    //verificar si el correo existe
    let categoryExists = await ProductCategories.findOne( { category } );
    
    if( categoryExists ) {
        throw new Error( `The category: ${ category } already exists` );
    }

};

// Validaciones de BD de CATEGORIAS
const productCategoryExistsById = async ( id = '' ) => { 
    // verifficar si el id existe
    let categoryExistsById = await ProductCategories.findById( id );
    if( !categoryExistsById ) {
        throw new Error( `The id: ${ id } not found`)
        
    }
};

// -----------------------------PRODUCTOS----------------------------------------------------------------
//verificar si el producto existe
const productExistsById = async ( id = '' ) => {  
    let productExists = await Products.findById( id );
    if( !productExists ) {
        throw new Error( `The product's id: ${ id } does not exist in the database` );
    }

};

// ----------------------------SHOPPINGCART------------------------------------------------------------
//verificar si el CARRITO existe por suId
const shoppingCartExistsById = async ( id = '' ) => {  
    let shoppingCartExists = await ShoppingCart.findById( id );
    if( !shoppingCartExists ) {
        throw new Error( `The shoppingCart id: ${ id } does not exist in the database` );
    }

};

//verificar si el CARRITO existe por Id de User
const shoppingCartExistsByIdUser = async ( id = '' ) => {  
    let shoppingCartExists = await ShoppingCart.findOne({ user: id });
    if( !shoppingCartExists ) {
        throw new Error( `The shoppingCart id: ${ id } does not exist in the database` );
    }

};






module.exports = {
    allowedCollection,
    emailExists,
    isValidCategory,
    isValidRole,
    categoryExistsById,
    aboutUsExistsdById,
    roleExistsById,
    userExistsById,
    categoryNameExists,
    nombreProductoExiste,
    rolNameExists,
    postExistsdById,
    productCategoryNameExists,
    productCategoryExistsById,
    productExistsById,
    shoppingCartExistsById,
    shoppingCartExistsByIdUser
};