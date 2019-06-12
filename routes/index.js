var express = require('express');
var router = express.Router();
const nodeMailer = require('nodemailer');
var helper = require('./helperFunctions');

const User = require('../models/users');
const Keys = require('../models/keys');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user)
    res.render('dashboard');
  else
    res.render('index');
});

router.get('/verify', function(req, res, next) {
  const email = req.query.email;
  const key = req.query.key;
  Keys.findOne({ email: { "$regex": email, "$options": "i" }})
  .then(results => {
    console.log(results);
    if (!results)
      res.render('index', {error: 'Account Verification Failed - link expired!' });
    else if (results.key === key)
    {
      // delete the key entry / confirm password / notify the user
      Keys.deleteOne( { email : email } )
        .catch(err => console.log(err));
      User.update({ email: email }, { $set: { verified: '1' }})
      .then(() => {
        res.render('index', {error: 'Account Verification Successful!' });
      });
    } else {
      Keys.deleteOne( { email : email } )
        .catch(err => console.log(err));
        res.render('index', {error: 'Account Verification Failed!' });

      // delete the user entry/ notify the user
    }
  })
  .catch(err => console.log(err));
  
});

router.get('/reset', function(req, res, next) {
  if (!req.query.email || !req.query.key)
    res.render('index', {error : "Something went wrong, could not renew password!"});
  else{
    Keys.findOne({ email: req.query.email})
    .then(results => {
      console.log(results.key);
      console.log(req.query.key);
      if (results && (req.query.key === results.key))
      {
        res.render('reset', {email : req.query.email, key : req.query.key});
      }
      else
        res.render('index', {error : "Something went wrong, could not renew password!"});
    })
    .catch(err => {res.render('index', {error : "Something went wrong, could not renew password!"});});
  }
});


module.exports = router;
