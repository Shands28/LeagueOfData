'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3000;

mongoose.connect('mongodb://localhost:27017/LeagueOfData', {useNewUrlParser: true, useFindAndModify: true}, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('BBDD corriendo correctamente.....');
        app.listen(port, function () {
            console.log('Server escuchando en http://localhost:' + port + '.....');
        });
    }
});
