'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mirar User: de esta manera hacemos referencia 
//  para que cargue el objeto entero en la variable
//  user a traves del populate
var PublicationSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    latitude: String,
    longitude: String,
    title: String,
    description: String,
    photo: String,
    created_at: String,
    range: Number,
    time_to_expire: Number,
});

module.exports = mongoose.model('Publication', PublicationSchema);