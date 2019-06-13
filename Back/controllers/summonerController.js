'use stric'
var Summoner = require('../models/summonerModel');
var Queue = require('../models/queueModel');
var Match = require('../models/matchModel.js');
var apiKey = require('../api_calls/data_api');
var request = require('request');

function register(req, res) {
    var summonerName = req.params.summonerName;
    var region = req.params.region;

    if (summonerName) {
        Summoner.findOne({summonerName: {$regex: summonerName, $options: 'i'}}, (err, summonerObject) => {
            if (err) {
                throw err
            }
            if (summonerObject) {
                console.log('SUMMONER ENCONTRADO EN BBDD');
                //Comprobar si el sum tiene matches asociados a su id
                Match.find({
                    'participantIdentities.player.summonerName': summonerObject.summonerName,
                    platformId: {$regex: region, $options: 'i'}
                }, (err, docs) => {
                    if (err) {
                        throw error
                    }
                    if (docs.length === 0) {
                        console.log('NO MATCHES FOUND');
                        summonerObject.foundMatches = [];
                        console.log(docs);
                        res.status(200).send(summonerObject);
                    } else {
                        summonerObject.foundMatches = docs;
                        console.log('MATCHES FOUND');
                        res.status(200).send(summonerObject);
                    }
                });
            } else {
                console.log('LLAMANDO API SUMM...');
                var summonerUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;
                request.get(summonerUrl, (err, response, body) => {
                    if (err) {
                        res.status(404).send(err);
                    }
                    if (response.statusCode === 200) {
                        var mySummoner = new Summoner();
                        mySummoner.profileIconId = JSON.parse(body).profileIconId;
                        mySummoner.summonerName = JSON.parse(body).name;
                        mySummoner.summonerLevel = JSON.parse(body).summonerLevel;
                        mySummoner.accountId = JSON.parse(body).accountId;
                        mySummoner.id = JSON.parse(body).id;
                        mySummoner.ranks = [];
                        mySummoner.region = region;

                        var rankUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${mySummoner.id}?api_key=${apiKey}`;
                        request.get(rankUrl, (err, response, body) => {
                            if (err) {
                                res.status(404).send(err);
                            }
                            if (response.statusCode === 200) {
                                mySummoner.ranks = JSON.parse(body);
                                Match.find({
                                    'participantIdentities.player.summonerName': mySummoner.summonerName,
                                    platformId: {$regex: region, $options: 'i'}
                                }, (err, docs) => {
                                    if (err) {
                                        throw err
                                    }
                                    mySummoner.foundMatches = docs;
                                    mySummoner.save()
                                        .then(mySummoner => {
                                            console.log('ITEM SAVED: ');
                                            console.log(mySummoner);
                                            res.send(mySummoner);
                                        })
                                        .catch(err => {
                                            res.status(400).send('ERROR 400 AL GUARDAR EN BBDD');
                                        });
                                })
                                //Comprobar si el summoner tiene matches asociados a su ID
                            } else if (response.statusCode === 404) {
                                console.log('ERROR-RANK-CALL-404');
                            } else if (response.statusCode === 500) {
                                console.log('ERROR-RANK-CALL-500');
                            } else if (response.statusCode === 400) {
                                console.log('ERROR-RANK-CALL-400');
                            }
                        });
                    } else if (response.statusCode === 404) {
                        console.log('ERROR-SUMDATA-CALL-404');
                    } else if (response.statusCode === 500) {
                        console.log('ERROR-SUMDATA-CALL-500');
                    } else if (response.statusCode === 400) {
                        console.log('ERROR-SUMDATA-CALL-400');
                    }
                });
            }
        });
    } else {
        console.log('NOMBRE SUMM INCORRECTO');
    }
}


function updateSummoner(req, res) {
    var summoner = Queue();
    var summonerName = req.params.summonerName;
    var region = req.params.region;

    Queue.find({summonerName: summonerName, region: region}, (err, item) => {
        if (err) {
            console.log('Low Item not found');
            throw err;
        } else if (item.length > 0) {
            console.log(item);
            summoner = item.pop();
            if (summoner.priority === 3) {
                res.status(200).send({message: 'Summoner added to Queue'});
            } else {
                summoner.priority++;
                summoner.save()
                    .then(summoner => {
                        console.log('ITEM SAVED: El summoner buscado tenia priority = 2, ahora 3');
                        res.status(200).send({message: 'Summoner added to Queue'});
                    })
                    .catch(err => {
                        res.status(400).send('Error');
                    });
            }
        } else {
            summoner.summonerName = summonerName;
            summoner.region = region;
            summoner.priority = 1;
            summoner.save()
                .then(summoner => {
                    console.log('ITEM SAVED: El summoner buscado tenia priority = 2, ahora 3');
                    res.status(200).send({message: 'Summoner added to Queue'});
                })
                .catch(err => {
                    res.status(400).send('Error');
                });
        }
    });
}


/*let summonerUri = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';//{summonerName}
let matchListUri = 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'; //{AccId}
let matcIdhUri = 'https://euw1.api.riotgames.com/lol/match/v4/matches/'; //{matchId}*/
module.exports = {
    register,
    updateSummoner
};
