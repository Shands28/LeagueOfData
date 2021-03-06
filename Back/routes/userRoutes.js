'use stric'
var express = require('express');
var UserController = require('../controllers/userController');

var api = express.Router();
//-Generar Rutas:
//api.tipoReq('ruta', funcion que queramos ejecutar en la ruta dada);

//MODELADO DE DATOS
api.post('/registro/steps', UserController.registerUser);
api.post('/login', UserController.loginUser);
api.get('/user/:t', UserController.getTokenData);
api.post('/user/save-account', UserController.saveAccount);
api.post('/user/drop-account', UserController.dropAccount);
//ESTADISTICAS

module.exports = api;
