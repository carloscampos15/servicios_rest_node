'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var moment = require("moment");

var messageSchema = schema({
    sender_id: String,
    sender_email: String,
    receptors: [],
    subject: String,
    body: String,
    created_at: { type : String, default: moment().format("YYYY-MM-DD") },
    estate: String
});

module.exports = mongoose.model('Message', messageSchema);