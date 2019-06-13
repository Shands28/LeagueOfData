'use stric'
var express = require('express');
var SummonerController = require('../controllers/summonerController');

var api = express.Router();
//-Generar Rutas:
    //api.tipoReq('ruta', funcion que queramos ejecutar en la ruta dada);

    //MODELADO DE DATOS
api.get('/register/:summonerName/:region', SummonerController.register);
api.get('/update/:region/:summonerName', SummonerController.updateSummoner);
    //ESTADISTICAS

module.exports = api;
//UTILIZAR ESTE ARCHIVO EN app.j (SERVER) para cargar rutas

