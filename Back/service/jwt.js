'use-strict'
var jwt = require('jasonwebtoken');
var moment = require('moment');
var secretKey = 'secretKey';


exports.createToken = function(user){
    var payload ={ //Datos que se van a codificar
        sub: user._id,
        username = user.username,
        email = user.email,
        password = user.password,
        initDate: moment.unix(), //Fecha creacion d eToken
        expDate: moment().add(15, 'days').unix //Fecha expiracion token
    }; 
    return jwt.sign(payload, secretKey);
}