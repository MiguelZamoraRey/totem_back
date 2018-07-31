'use-strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var secret = 'clave_secreta_prov';

//directamete exports porque solo es una funcion
exports.ensureAuth = function (req, res, next){
    //el token viene en una cabecera comprobemosla
    if(!req.headers.authorization){//no viene la cabecera
        return res.status(403).send({
            message: "The request hasn't authorization header"
        });
    }

    //viene la cabecera, le quitamos comillas para evitar problemas
    var token = req.headers.authorization.replace(/['"]+/g,'');

    try{
        //debugger;
        //decode
        var payload = jwt.decode(token, secret);
        console.log("Payload:"+payload);

        //expired?
        if(payload.exp <= moment.unix()){
            return res.status(401).send({
                message: "The token has been expired"
            });
        }
    }catch(ex){
        return res.status(405).send({
            message: "Invalid Token"
        });
    }

    //bindeamos en el request los datos del user para que esten disponibles
    req.user = payload;
    next();
}