var express = require('express');
var router = express.Router();
const nodeMailer = require('nodemailer');
const session = require('express-session');
const helper = require('./helperFunctions');


const User = require('../models/users');


router.use(session({
     secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true
 }));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  User.find({"email": { "$regex": req.body.email, "$options": "i"}})
    .then(users => {
            console.log('users');
            console.log(users);
            console.log(users.length);
            if (users.length > 0)
              res.json({dataCount : 1, data : {status : 204}});
            else if (users.length === 0)
            {
              let user = req.body;

              user.date = String( new Date());
              User.create( user, function(err, doc) {
                  if (err){
                    res.json({dataCount : 1, data : {status : 204}});
                  }
                  else if (doc){
                    helper.send_mail(user.email, "<h1 style='color: tomato;'>Message here ... the link and key</h1><button class='btn btn-dark'>activate acc</button>");
                    res.json({dataCount : 1, data : {status : 200}});
                  }
              });
            }
        })
        .catch(error => { console.log(error); })
});

router.post('/signin', function(req, res, next) {
  console.log('signin hit');
    User.findOne({ email: req.body.email }, function(err, users) {
          if (err)
          {
            res.json({dataCount : 1, data : {status : 300}});
          } else {
            console.log('users');
            console.log(users);
            if (!users)
              res.json({dataCount : 1, data : {status : 204}});
            else {
              let user = req.body;
              users.comparePassword(user.password, function(err, isMatch) {
                if (err){
                    console.log(err);
                }
                if (isMatch){
                  console.log('users');
                  console.log(users.verified);
                  if (users.verified == 0)
                    res.json({dataCount : 1, data : {status : 216}});
                  else if (users.completeProfile == 0)
                    res.json({dataCount : 1, data : {status : 212}});
                  else{
                    res.json({dataCount : 2, data : {status : 200, token : 'thisisthetoken'}});
                  }
                }
                else{
                  res.json({dataCount : 1, data : {status : 208}});
                }
              });
              
            }
          }
        })
        .catch(error => { console.log(error); })

  // 200 - redirect to dashboard (dataCount = 2, status, token)
  // 204 - no user with that email (dataCount = 1, status)
  // 208 - incorrect password (dataCount = 1, status)
  // 212 - incomplete profile (dataCount = 1, status)
  // 216 - unverified acc (dataCount = 1, status)

  // res.json({dataCount : 1, data : {status : 212}});
});

module.exports = router;
