'use strict'
var User = require('../models/userModel');
var Summoner = require('../models/summonerModel')
var request = require('request');
var bcrypt = require('bcrypt');
var apiKey = require('../api_calls/data_api');
var uuidv4 = require('uuid/v4');
var jwt = require('jsonwebtoken');


////////       R R G I S T R O       /////////

function registerUser(req, res){
    var step = req.body.step;
    var uniqueString = '';
    var summonerName;
    var region;
    var summonerId;
     
    switch (step){
        case '1':
        console.log('STEP: 1');
            var username = req.body.username;
            var email = req.body.email;
            var password = req.body.password;

            User.findOne({username: username}, (err, userObject) =>{
                if(err){throw err}
                if(userObject){
                    res.status(401).send({message: 'El nombre de usuario ya existe en la BBDD'});
                }else{
                    res.status(200).send({message: "Pasar a paso 2"});
                }
            });
        break;
        case '2':
            console.log('STEP: 2');
            summonerName = req.body.summonerName;
            region = req.body.region;
            

            Summoner.findOne({summonerName: {$regex: summonerName, $options: 'i'}}, (err, summonerObject) => {
                if(err){throw err}
                if(summonerObject){
                    //Comprobar si esta linkeado
                    console.log('SUMMONER ENCONTRADO EN BBDD');
                    summonerId = summonerObject.summonerId;
                    User.findOne({savedAccounts: {$regex: summonerName, $options: 'i'}}, (err, item) => {
                        if(err){throw err}
                        if(item){
                            res.status(403).send({message: 'El usuario introducido ya pertenece a un Usuario'});
                        }else{
                            uniqueString = uuidv4();
                            res.status(200).send({userIdentifier: uniqueString, summonerId: summonerId, region: region, summonerObject:profileIconId});
                        }
                    }).limit(1);
                }else{
                    var summonerUrl = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;
                    request(summonerUrl, (error, response, body) => {
                        console.log('CONSULTANDO API');
                        if(error){
                            res.status(404).send({message: 'Error al consultar API - Ruta summonerName'})
                        }
                        else if(response.statusCode == 200){
                            
                            User.findOne({savedAccounts: {$regex: JSON.parse(body).name, $options: 'i'}}, (err, item) => {
                                if(err){throw err}
                                if(item){
                                    res.status(403).send({message: 'El usuario introducido ya pertenece a un Usuario'});
                                }else{
                                    uniqueString = uuidv4();
                                    summonerId = JSON.parse(body).id;
                                    res.status(200).send({userIdentifier: uniqueString, summonerId: summonerId, region: region, profileIconId: body.profileIconId});
                                }
                            });
                        }else{
                            res.status(402).send({message: 'sumonerName no se encuentra en la API'})
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


            //LLAMAR API LOL PARA OBTENER ESTA VARIABLE
            var verificationUrl = `https://${region}.api.riotgames.com/lol/platform/v4/third-party-code/by-summoner/${summonerId}?api_key=${apiKey}`;
            request(verificationUrl, (error, response, body) => {
                if(error){
                    throw error
                }else if(response.statusCode == 200){
                    verificationCode = JSON.parse(body);
                    console.log(verificationCode);

                    if(userIdentifier != verificationCode){
                        res.status(401).send({message: 'ERROR: La clave proporcionada no coincide con la clave del usuario'});
                    }else{
        
                        //Insertar en la BBDD y enviar token
                        myUser.username = username;
                        myUser.email = email;
                        myUser.userIconId = profileIconId;
                        myUser.linkedAccounts.push({summonerName: summonerName, region: region});
                        myUser.savedAccounts = [{}];
                        myUser.creationDate = Date.now();
        
                        if(password){
                            bcrypt.hash(password, 12, (err, hashedPassword) => {
                                if(err){
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
                                .catch(err =>{
                                    res.status(400).send(err);
                                });
                            });
                        }
                    }

                }else if(response.statusCode == 404){
                    res.status(404).send({message: 'No se ha encontrado el código de verificación para el Summoner solicitado'})
                }else if(response.statusCode == 500){
                    res.status(500).send({message: 'Error del servidor'});
                }
                
            }); 
        break;
    }
}

function loginUser(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var getHash = req.body.getHash;

    User.findOne({email: {$regex: email, $options: 'i'}}, (err, userObject) => {
        console.log(email);
        console.log(password);
        if(err){
            res.status(500).send({message: 'Error en la petición - Buscar User'});
        }else{
            if(userObject){
                //Check password
                bcrypt.compare(password, userObject.password, (err, isMatch)=> {
                    if(err){throw err}
                    if(isMatch){
                        if(getHash){
                            //Devolver Token
                            var token = jwt.sign({username : userObject.username, email: userObject.email,
                                userIconId: userObject.userIconId, linkedAccounts: userObject.linkedAccounts, savedAccounts: userObject.savedAccounts}, 'secret', {expiresIn: '24h'});
                            res.status(200).send(token);
                        }else{
                            res.status(406).send({message: 'Invalid Credentials'});   
                        } 
                    }
                });
            }else{
                res.status(401).send({message: 'El usuario introducido no existe'});
            }
        }
    });
}
function getTokenData(req, res){
    var token = req.params.t;
    jwt.verify(token, 'secret', function(err, tokenData){
        if(err){
            return res.status(400).send({message: 'Unathorized request'});
        }
        if(tokenData){
            var decodedToken = tokenData;
            console.log('DECODED TOKEN');
            console.log(decodedToken);
            res.status(200).send(decodedToken);
        }
    });
}



/* ************************************ T O K E N S **************************************** */
module.exports = {
    registerUser,
    loginUser,
    getTokenData
}