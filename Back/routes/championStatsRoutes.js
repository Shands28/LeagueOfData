'use stric'
var express = require('express');
var ChampionStatsController = require('../controllers/championStatsController');

var api = express.Router();
//-Generar Rutas:
//api.tipoReq('ruta', funcion que queramos ejecutar en la ruta dada);

//ESTADISTICAS
api.get('/stats', ChampionStatsController.getChampionStats);
api.get('/stats/win-rate', ChampionStatsController.getWinRateStat);


module.exports = api;
