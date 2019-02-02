var express = require('express');
var router = express.Router();
const nodeMailer = require('nodemailer');
var helper = require('./helperFunctions');

/* GET home page. */
router.get('/', function(req, res, next) {
  helper.test();
  helper.send_mail('matcha@mailinator.com','<h1>Message ....</h1>');
  res.render('index', {error: 'you need to register first' });
});

module.exports = router;
