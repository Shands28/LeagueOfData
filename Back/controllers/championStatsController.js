'use strict'

var ChampionStats = require('../models/championStatsModel');

function getChampionStats(req, res){
    ChampionStats.find({}, (err, found) => {
        if(err){
            res.status(400).send({message: err.message})
        }else if(found){
            res.status(200).send(found);
        }
    });
}
function getWinRateStat(req, res){
    ChampionStats.find({}, {win_rate: 1, championId: 1}, (err, found) => {
        if(err){
            res.status(400).send({message: err.message})
        }else if(found){
            console.log(found);
            res.status(200).send(found);
        }
    });
}

module.exports = {
    getChampionStats,
    getWinRateStat
}
