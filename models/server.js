const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('express-async-errors');
const path = require('path');


const { dbConnection } = require('../database/config');

class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            // buscar:         '/api/buscar',
            auth:           '/auth',
            aboutus:        '/aboutus',
            postcategories: '/postcategories',
            posts:          '/posts',
            roles:          '/roles',
            uploads:        '/uploads',
            users:          '/users',
        };

        // Conectar a base de datos
        this.conectarDB();   
        //Middlewares
        this.middlewares();
        //Rutas
        this.routes();

        this.app.get('*', ( req, res ) => {
            res.sendFile(path.join(__dirname,'..', 'public', 'index.html'));
        });
        
    };

    // DB
    async conectarDB() {
        await dbConnection();
    };

    // MIddlewares es una funcion que se ejecuta antes de llamar un controlador o un modelo
    middlewares() {
        //cors
        this.app.use( cors() );

        //lectura y parseo del body recibir de json
        this.app.use( express.json() );

        // directorio publico
        this.app.use( express.static('public') );

        //FileUpload - carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //crea las carpetas donde guardar archivos automaticamente
        })); 

    };
    
    //siguiente ruta(get- put- post- delete)
    routes() {
        
        this.app.use(  this.paths.auth,           require('../routes/auth') );
        this.app.use(  this.paths.aboutus,           require('../routes/aboutus') );
        // this.app.use(  this.paths.buscar, require('../routes/buscar') );
        this.app.use(  this.paths.roles,          require('../routes/roles') );
        this.app.use(  this.paths.postcategories, require('../routes/postcategories') );
        this.app.use(  this.paths.users,          require('../routes/users') );
        this.app.use(  this.paths.posts,          require('../routes/posts') );
        this.app.use(  this.paths.uploads,        require('../routes/uploads') );
        // Ruta de manejo de errores 404 (al final de todas las rutas existentes)
        // this.app.get('*', ( req, res ) => {
        //     res.sendFile(__dirname + '/public/index.html');
        // });
        
        this.app.use((err, req, res, next) => {
            console.error(err);
            next(err);
        });
    };

    
    listen() {
        
        this.app.listen( this.port, () => {
        console.log('Rest-server Campotec Uni Online', this.port );
        });
    }

}

module.exports = Server;