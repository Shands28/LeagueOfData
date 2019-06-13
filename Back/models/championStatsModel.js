'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var championStatsSchema = Schema({
    ban_rate: {
        type: Number
    },
    goldTotal: {
        type: Number
    },
    matchesTotal: {
        type: Number
    },
    championId: {
        type: Number
    },
    pick_rate: {
        type: Number
    },
    win_rate: {
        type: Number
    },
    kda: {
        type: Number
    },
    minionsKilledTotal: {
        type: Number
    }

}, {versionKey: false});

module.exports = mongoose.model('ChampionStats', championStatsSchema);
