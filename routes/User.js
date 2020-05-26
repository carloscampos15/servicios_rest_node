'use strict'

var express = require('express');
var userController = require('./../controllers/UserController');

var router = express.Router();
var md_auth = require('./../middlewares/Authenticated')

router.post('/updateProfile', md_auth.authenticated, userController.updateProfile);
router.post('/searchUsers', md_auth.authenticated, userController.searchUsers);

module.exports = router;