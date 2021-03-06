'use strict'

var express = require('express');
var messageController = require('./../controllers/MessageController');

var router = express.Router();
var md_auth = require('./../middlewares/Authenticated')

router.post('/create', md_auth.authenticated, messageController.create);
router.get('/inbox', md_auth.authenticated, messageController.inbox);
router.get('/outbox', md_auth.authenticated, messageController.outbox);
router.get('/showReceive/:message_id', md_auth.authenticated, messageController.showReceive);
router.get('/showSend/:message_id', md_auth.authenticated, messageController.showSend);
router.delete('/deleteInbox/:message_id', md_auth.authenticated, messageController.deleteInbox);

module.exports = router;