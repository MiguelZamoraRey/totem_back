'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    email: String,
    password: String,
    latitude: String,
    longitude: String,
    avatar: String
});

module.exports = mongoose.model('User', UserSchema);