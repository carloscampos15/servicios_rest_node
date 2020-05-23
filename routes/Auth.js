'use strict'

var express = require('express');
var registerController = require('./../controllers/auth/RegisterController');

var router = express.Router();

router.post('/register', registerController.register);

module.exports = router;