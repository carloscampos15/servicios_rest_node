'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    received_messages: [],
    sended_messages: []
});

module.exports = mongoose.model('User', userSchema);