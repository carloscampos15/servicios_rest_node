'use strict'

var express = require('express');
var userController = require('./../controllers/UserController');

var router = express.Router();
var md_auth = require('./../middlewares/Authenticated')

router.post('/updateProfile', md_auth.authenticated, userController.updateProfile);
router.post('/search', md_auth.authenticated, userController.search);
router.get('/', md_auth.authenticated, userController.index);
router.get('/:user_id', md_auth.authenticated, userController.show);

module.exports = router;