'use-strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//-Cargar Rutas
var summoner_routes = require('./routes/summonerRoutes');
var user_routes = require('./routes/userRoutes.js');
//-Configurar body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//-Configurar Cabeceras
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});
//-Rutas Base
app.use('/api', summoner_routes);
app.use('/api', user_routes);


module.exports = app;
