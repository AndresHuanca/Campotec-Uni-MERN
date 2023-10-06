// const { response } = require("express");

// // Import para la validacion de id de mongoose
// const { ObjectId } = require('mongoose').Types;

// // Import models
// const { Usuario, Categoria, Producto } = require('../models');

// const coleccionesPermitidas = [
//     'categorias',
//     'productos',
//     'usuarios',
//     'roles'

// ];

// // Validacion by Id de Usuarios
// const buscarUsuarios = async ( termino = '', res = response ) => {
//     // validacion de id valido con mongoose
//     const esMongoId = ObjectId.isValid( termino ); // en caso de que sea id valido TRUE

//     if( esMongoId ) {
//         const usuario = await Usuario.findById( termino );
//         return res.json({
//             results: ( usuario ) ? [ usuario ] : []
//         });
//     }

//     // For hacer mas sensibles las busquedas
//     const regex = new RegExp( termino, 'i');
//     // con el count en reemplazo de find da la cantidad
//     const usuarios =  await Usuario.find({ 
//         $or: [{ nombre: regex }, { correo: regex }],
//         $and: [{ estado: true}]
//     });

//     res.json({
//         results: usuarios
//     });


// };

// // Validacion by Id de Productos
// const buscarProductos = async ( termino = '', res = response ) => {
//     // validacion de id valido con mongoose
//     const esMongoId = ObjectId.isValid( termino ); // en caso de que sea id valido TRUE

//     if( esMongoId ) {
//         const producto = await Producto.findById( termino )
//                                 .populate( 'categoria', 'nombre' );
//         return res.json({
//             results: ( producto ) ? [ producto ] : []
//         });
//     }

//     // For hacer mas sensibles las busquedas
//     const regex = new RegExp( termino, 'i');
//     // con el count en reemplazo de find da la cantidad
//     const productos =  await Producto.find({ nombre:regex , estado: true })
//                         .populate( 'categoria', 'nombre' );

//     res.json({
//         results: productos
//     });


// };

// // Validacion by Id de Categorias
// const buscarCategorias = async ( termino = '', res = response ) => {
//      // validacion de id valido con mongoose
//      const esMongoId = ObjectId.isValid( termino ); // en caso de que sea id valido TRUE

//     if( esMongoId ) {
//         const categoria = await Categoria.findById( termino );
//         return res.json({
//             results: ( categoria ) ? [ categoria ] : []
//         });
//     }
//     // For hacer mas sensibles las busquedas
//     const regex = new RegExp( termino, 'i');
//     // con el count en reemplazo de find da la cantidad
//     const categorias =  await Categoria.find({ nombre:regex , estado: true });

//     res.json({
//         results: categorias
//     });


// };


// const buscar = async( req, res = response ) => {

//     const { coleccion, termino } = req.params;

//     // Validar si existe coleccion
//     if( !coleccionesPermitidas.includes( coleccion ) ) {
//         return res.status( 400 ).json({ 
//             msg: `La coleccion ${ coleccion } no existe`, 
//             msm: `Colecciones permitidas ${ coleccionesPermitidas } `
//         });
//     }
//     // 
//     switch ( coleccion ) {
//         case 'usuarios':
//             buscarUsuarios( termino, res );
//         break;
//         case 'categorias':
//             buscarCategorias( termino, res );
//         break;
//         case 'productos':
//             buscarProductos( termino, res );
            
//         break;    
//         default:
//             res.status( 500 ).json({
//                 msg: `se le olvido Hacer esta busqueda`
//             });
//     }

// };

// module.exports = {
//     buscar
// };