'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SummonerSchema = Schema({
    priority: {
        type: Number,
        max: [3, 'Priority maximum']
    },
    summonerName: {
        type: String
    },
    region: {
        type: String
    }
}, {versionKey: false});

module.exports = mongoose.model('Queue', SummonerSchema);
