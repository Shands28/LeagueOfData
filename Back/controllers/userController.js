'use strict'
var User = require('../models/userModel');
var Summoner = require('../models/summonerModel');
var request = require('request');
var bcrypt = require('bcrypt');
var apiKey = require('../api_calls/data_api');
var uuidv4 = require('uuid/v4');
var jwt = require('jsonwebtoken');


////////       R R G I S T R O       /////////

function registerUser(req, res) {
    var step = req.body.step;
    var uniqueString = '';
    var summonerName;
    var region;
    var summonerId;
    var profileIconId;
    switch (step) {
        case '1':
            console.log('STEP: 1');
            var username = req.body.username;
            var email = req.body.email;
            var password = req.body.password;

            User.findOne({username: username}, (err, userObject) => {
                if (err) {
                    throw err
                }
                if (userObject) {
                    res.status(401).send({message: 'Username already in use'});
                } else {
                    res.status(200).send({message: "Pasar a paso 2"});
                }
            });
            break;
        case '2':
            console.log('STEP: 2');
            summonerName = req.body.summonerName;
            region = req.body.region;

            Summoner.findOne({
                summonerName: {$regex: summonerName, $options: 'i'},
                region: region
            }, (err, summonerObject) => {
                if (err) {
                    throw err
                }
                if (summonerObject) {
                    //Comprobar si esta linkeado
                    console.log('SUMMONER ENCONTRADO EN BBDD');
                    summonerId = summonerObject.id;
                    profileIconId = summonerObject.profileIconId;
                    User.findOne({
                        linkedAccounts: {$regex: summonerName, $options: 'i'},
                        region: region
                    }, (err, item) => {
                        if (err) {
                            throw err
                        }
                        if (item) {
                            res.status(403).send({message: 'Summoner linked to another account'});
                        } else {
                            uniqueString = uuidv4();
                            res.status(200).send({
                                userIdentifier: uniqueString,
                                summonerId: summonerId,
                                region: region,
                                userIconId: profileIconId
                            });
                        }
                    });
                } else {
                    var summonerUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;
                    request(summonerUrl, (error, response, body) => {
                        console.log('CONSULTANDO API');
                        if (error) {
                            res.status(404).send({message: 'Error al consultar API - Ruta summonerName'})
                        } else if (response.statusCode === 200) {

                            User.findOne({
                                linkedAccounts: {
                                    $regex: JSON.parse(body).name,
                                    $options: 'i'
                                }
                            }, (err, item) => {
                                if (err) {
                                    throw err
                                }
                                if (item) {
                                    res.status(403).send({message: 'Summoner linked to another account'});
                                } else {
                                    uniqueString = uuidv4();
                                    summonerId = JSON.parse(body).id;
                                    profileIconId = JSON.parse(body).profileIconId;
                                    res.status(200).send({
                                        userIdentifier: uniqueString,
                                        summonerId: summonerId,
                                        region: region,
                                        userIconId: profileIconId
                                    });
                                }
                            });
                        } else {
                            res.status(402).send({message: 'Summoner not found'})
                        }
                    });
                }
            });
            break;
        case '3':
            console.log('STEP: 3');
            var myUser = new User();
            var username = req.body.username;
            var email = req.body.email;
            var password = req.body.password;
            var userIdentifier = req.body.userIdentifier; //ec2b1f33-e897-4ca7-98c0-913cb163659e
            var summonerName = req.body.summonerName;
            var region = req.body.region;
            var summonerId = req.body.summonerId;
            var profileIconId = req.body.profileIconId;
            var verificationCode;
            console.log(req.body);
            //LLAMAR API LOL PARA OBTENER ESTA VARIABLE
            var verificationUrl = `https://${region}.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${summonerId}?api_key=${apiKey}`;
            request(verificationUrl, (error, response, body) => {
                if (error) {
                    throw error
                } else if (response.statusCode === 200) {
                    verificationCode = JSON.parse(body);
                    console.log(verificationCode);
                    console.log(userIdentifier);
                    if (userIdentifier !== verificationCode) {
                        res.status(401).send({message: 'ERROR: Verfication code does not match the code given'});
                    } else {

                        //Insertar en la BBDD y enviar token
                        myUser.username = username;
                        myUser.email = email;
                        myUser.userIconId = profileIconId;
                        myUser.linkedAccounts.push({
                            summonerName: summonerName,
                            region: region,
                            profileIconId: profileIconId
                        });
                        myUser.savedAccounts = [];
                        myUser.creationDate = Date.now();

                        if (password) {
                            bcrypt.hash(password, 12, (err, hashedPassword) => {
                                if (err) {
                                    throw err;
                                }
                                myUser.password = hashedPassword;

                                console.log('MYUSER');
                                console.log(myUser);
                                myUser.save()
                                    .then(myUser => {
                                        console.log('USER SAVED');
                                        console.log(myUser.password);
                                        res.status(200).send(myUser);
                                    })
                                    .catch(err => {
                                        res.status(400).send(err);
                                    });
                            });
                        }
                    }

                } else if (response.statusCode === 404) {
                    res.status(404).send({message: 'Verfication code does not match the code given'})
                } else if (response.statusCode === 500) {
                    res.status(500).send({message: 'Connection error'});
                }
            });
            break;
    }
}

function loginUser(req, res) {
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    var getHash = req.body.getHash;

    User.findOne({'$or': [{'email': email}, {'username': email}]}, (err, userObject) => {
        console.log(email);
        console.log(password);
        if (err) {
            res.status(500).send({message: 'Connection error'});
        } else {
            if (userObject) {
                //Check password
                bcrypt.compare(password, userObject.password, (err, isMatch) => {
                    if (err) {
                        throw err
                    }
                    if (isMatch) {
                        console.log('text');
                        if (getHash) {
                            console.log('text2');
                            //Devolver Token
                            var token = jwt.sign({
                                username: userObject.username,
                                email: userObject.email,
                                userIconId: userObject.userIconId,
                                linkedAccounts: userObject.linkedAccounts,
                                savedAccounts: userObject.savedAccounts,
                                creationDate: userObject.creationDate
                            }, 'secret', {expiresIn: '24h'});
                            res.status(200).send({token: token});
                        }
                    } else {
                        res.status(406).send({message: 'Password is incorrect. Please try loggin in again'});
                    }
                });
            } else {
                res.status(401).send({message: 'Username is incorrect. Please try loggin in again'});
            }
        }
    });
}

function getTokenData(req, res) {
    var token = req.params.t;
    jwt.verify(token, 'secret', function (err, tokenData) {
        if (err) {
            res.status(404).send({message: 'Unauthorized request'});
        }
        if (tokenData) {
            res.status(200).send(tokenData);
        }
    });
}

function saveAccount(req, res) {
    var token = req.body.token;
    var summoner = req.body.summonerName;
    var region = req.body.region;
    var profileIconId = req.body.profileIconId;
    jwt.verify(token, 'secret', function (err, tokenData) {
        if (err) {
            res.status(404).send({message: 'Unauthorized request'});
        }
        if (tokenData) {
            console.log(tokenData);
            User.updateOne({username: tokenData.username}, {
                $push: {
                    savedAccounts: {
                        summonerName: summoner,
                        region: region,
                        profileIconId: profileIconId
                    }
                }
            }, (err, user) => {
                if (err) {
                    res.status(500).send('Connection error - User/Save Account');
                } else if (user) {
                    User.findOne({'username': tokenData.username}, (err, userData) => {
                        if (err) {
                            res.status(500).send({message: 'Connection Error'});
                        } else {
                            var token = jwt.sign({
                                username: userData.username,
                                email: userData.email,
                                userIconId: userData.userIconId,
                                linkedAccounts: userData.linkedAccounts,
                                savedAccounts: userData.savedAccounts,
                                creationDate: userData.creationDate
                            }, 'secret', {expiresIn: '24h'});
                            res.status(200).send({token: token});
                        }
                    });
                }
            });
        }
    });
}

function dropAccount(req, res) {
    var token = req.body.token;
    var summoner = req.body.summonerName;
    jwt.verify(token, 'secret', function (err, tokenData) {
        if (err) {
            res.status(404).send({message: 'Unauthorized request'});
        }
        if (tokenData) {
            User.updateOne({username: tokenData.username}, {$pull: {savedAccounts: {summonerName: summoner}}}, (err, user) => {
                if (err) {
                    res.status(500).send('Connection error - User/Save Account');
                } else if (user) {
                    User.findOne({'username': tokenData.username}, (err, userData) => {
                        if (err) {
                            res.status(500).send({message: 'Connection Error'});
                        } else {
                            var token = jwt.sign({
                                username: userData.username,
                                email: userData.email,
                                userIconId: userData.userIconId,
                                linkedAccounts: userData.linkedAccounts,
                                savedAccounts: userData.savedAccounts,
                                creationDate: userData.creationDate
                            }, 'secret', {expiresIn: '24h'});
                            res.status(200).send({token: token});
                        }
                    });
                }
            });
        }
    });

}


/* ************************************ T O K E N S **************************************** */
module.exports = {
    registerUser,
    loginUser,
    getTokenData,
    saveAccount,
    dropAccount
}
