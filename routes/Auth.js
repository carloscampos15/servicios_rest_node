'use strict'

var express = require('express');
var registerController = require('./../controllers/auth/RegisterController');
var loginController = require('./../controllers/auth/LoginController');

var router = express.Router();

router.post('/register', registerController.register);
router.post('/login', loginController.login);

module.exports = router;