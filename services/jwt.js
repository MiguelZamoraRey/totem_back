'use strict'

//este js sera servicio para la creación de tokens
var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'clave_secreta_prov';

//al ser solo un metodo exportamos directamente
exports.createToken = function(user){
    //el sub es el dentificador, el iat es la fecha de creacion, y el exp la de expiracion
    var payload = {
        sub: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    //encriptamos payload pasandole un kay secreto que solo se descodifica con la misma palabra
    return jwt.encode(payload, secret);
}
