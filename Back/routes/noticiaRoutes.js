'use stric'
var express = require('express');
var NoticiaController = require('../controllers/noticiaController');

var api = express.Router();
api.get('/news', NoticiaController.getNoticias);
api.get('/news/:id', NoticiaController.getNewsById);

module.exports = api;