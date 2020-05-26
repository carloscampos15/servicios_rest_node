'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var moment = require("moment");

var userSchema = schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    role: { type : String, default: "USER" },
    received_messages: [],
    sended_messages: [],
    created_at: { type : String, default: moment().format("YYYY-MM-DD") },
});

module.exports = mongoose.model('User', userSchema);