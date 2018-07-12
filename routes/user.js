'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var multipart = require('connect-multiparty');

var api = express.Router();

//middleware de autenticación
var md_auth = require('../middlewares/autenticated');
//para la subida de archivos
var md_upload = multipart({uploadDir: './uploads/users'});


api.get('/test', md_auth.ensureAuth , UserController.test);

//param get obligatorio + ? = param opcional
api.get('/user/:id', md_auth.ensureAuth , UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth , UserController.getUsers);
api.get('/user-image/:imageFile', UserController.getImageFile);
api.put('/user/:id', md_auth.ensureAuth , UserController.updateUser);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/user-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

module.exports = api;