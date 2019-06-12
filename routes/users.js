var express = require('express');
var router = express.Router();
const nodeMailer = require('nodemailer');
const session = require('express-session');
const helper = require('./helperFunctions');
const bcrypt = require('bcrypt-nodejs');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');


const User = require('../models/users');
const Keys = require('../models/keys');


router.use(session({
     secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 100000000 }
 }));
 
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next) {
  User.find({"email": req.body.email})
    .then(users => {
            // console.log('users');
            // console.log(users);
            // console.log(users.length);
            if (users.length > 0){
              // console.log('users.verified');
              // console.log(users[0].verified);
              if (users[0].verified === 0) {
                res.json({dataCount : 1, data : {status : 208}});
              } else
                res.json({dataCount : 1, data : {status : 204}});
            }
            else if (users.length === 0)
            {
              let user = req.body;

              user.date = String( new Date());
              User.create( user, function(err, doc) {
                console.log(doc);
                  if (err){
                    res.json({dataCount : 1, data : {status : 300}});
                  }
                  else if (doc){
                    Keys.deleteMany({email : user.email}).then(doc => {var docs = doc});
                    // create a key and store it in the keys model and send an email with the key to the users for verification
                    // create a msg and pass it to the send_mail function
                    let key = helper.md5hash(user.email + String(new Date()));

                      var keyModel = new Keys({
                        userId: doc._id,
                        key: key,
                        email: user.email
                      });
                      keyModel.save(function (err) {
                      if (err) console.log(err);
                      });


                    let msg = `<h1 style='text-align:center;'>Welcome to matcha</h1>
                              <p style='text-align:center;'>A place to find love. if you signed up for Matcha please click the activation button below else ignore.</p>
                              <a href="http://localhost:3000/verify?email=${user.email}&key=${key}">
                                <button style="
                                      color: #fff;
                                      background-color: #343a40;
                                      border-color: #343a40;
                                      display: inline-block;
                                      font-weight: 400;
                                      text-align: center;
                                      vertical-align: middle;
                                      -webkit-user-select: none;
                                      -moz-user-select: none;
                                      -ms-user-select: none;
                                      user-select: none;
                                      padding: .375rem .75rem;
                                      font-size: 1rem;
                                      line-height: 1.5;
                                      border-radius: .25rem;

                                ">Activate account</button>
                              </a>`;
                    helper.send_mail(user.email, msg);
                    res.json({dataCount : 1, data : {status : 200}});
                  }
              });
            }
        })
        .catch(error => { res.json({dataCount : 1, data : {status : 300}}); })
});

router.post('/signin', function(req, res, next) {
  // console.log('signin hit');
    User.findOne({ email: req.body.email }, function(err, users) {
          if (err)
          {
            res.json({dataCount : 1, data : {status : 300}});
          } else {
            // console.log('users');
            // console.log(users);
            if (!users)
              res.json({dataCount : 1, data : {status : 204}});
            else {
              let user = req.body;
              users.comparePassword(user.password, function(err, isMatch) {
                if (err){
                    console.log(err);
                }
                if (isMatch){
                  // console.log('users');
                  // console.log(users.verified);
                  if (users.active == 0)
                    res.json({dataCount : 1, data : {status : 220}});
                  else if (users.verified == 0)
                    res.json({dataCount : 1, data : {status : 216}});
                  else if (users.completeProfile == 0){
                    console.log('setting session');
                    
                    req.session.user = user.email;
                    console.log(req.session.user);
                     jwt.sign({users}, process.env.SESSION_SECRET, { expiresIn: '30000s' }, (err, token) => {
                      res.json({dataCount : 2, data : {status : 212, token : token}});
                    });
                  } else {
                    //set session
                    req.session.user = user.email;
                    jwt.sign({users}, process.env.SESSION_SECRET, { expiresIn: '30000s' }, (err, token) => {
                      res.json({dataCount : 2, data : {status : 200, token : token}});
                    });
                  }
                }
                else{
                  res.json({dataCount : 1, data : {status : 208}});
                }
              });
              
            }
          }
        })
        .catch(error => { res.json({dataCount : 1, data : {status : 300}}); })

  // 200 - redirect to dashboard (dataCount = 2, status, token)
  // 204 - no user with that email (dataCount = 1, status)
  // 208 - incorrect password (dataCount = 1, status)
  // 212 - incomplete profile (dataCount = 1, status)
  // 216 - unverified acc (dataCount = 1, status)
  // 220 - disabled acc (dataCount = 1, status)

  // res.json({dataCount : 1, data : {status : 212}});
});

router.post('/resendVerification', function(req, res, next) {
    Keys.deleteMany({email : req.body.email}).then(doc => {var docs = doc});
    User.findOne({"email": req.body.email})
    .then(user => {
      if (user)
      {
        let key = helper.md5hash(user.email + String(new Date()));

          var keyModel = new Keys({
            userId: user._id,
            key: key,
            email: user.email
          });
          keyModel.save(function (err) {
          if (err) console.log(err);
          });


        let msg = `<h1 style='text-align:center;'>Welcome to matcha</h1>
                  <p style='text-align:center;'>A place to find love. if you signed up for Matcha please click the activation button below else ignore.</p>
                  <a href="http://localhost:3000/verify?email=${user.email}&key=${key}">
                    <button style="
                          color: #fff;
                          background-color: #343a40;
                          border-color: #343a40;
                          display: inline-block;
                          font-weight: 400;
                          text-align: center;
                          vertical-align: middle;
                          -webkit-user-select: none;
                          -moz-user-select: none;
                          -ms-user-select: none;
                          user-select: none;
                          padding: .375rem .75rem;
                          font-size: 1rem;
                          line-height: 1.5;
                          border-radius: .25rem;

                    ">Activate account</button>
                  </a>`;
        helper.send_mail(user.email, msg);
        res.json({dataCount : 1, data : {status : 200}});
                  
      }
      else
        res.json({dataCount : 1, data : {status : 300}});
      //change and update the key
      //send new verification to the user
    })
    .catch(err => { res.json({dataCount : 1, data : {status : 300}}); })
});

router.post('/renewPassword', function(req, res, next) {
  // console.log(req.body.email);
    User.findOne({"email": req.body.email})
    .then(results => {

              // console.log('users.verified');
              // console.log(users[0].verified);
            if (results)
            {
              //delete a key if it exists on the database
              Keys.deleteMany({email : req.body.email}).then(doc => {var docs = doc});
                    // create a key and store it in the keys model and send an email with the key to the users for verification
                    // create a msg and pass it to the send_mail function
                    let key = helper.md5hash(req.body.email + String(new Date()));

                      var keyModel = new Keys({
                        userId: results._id,
                        key: key,
                        email: req.body.email
                      });
                      keyModel.save(function (err) {
                      if (err) console.log(err);
                      });


                    let msg = `<h1 style='text-align:center;'>Hola from Matcha!</h1>
                              <p style='text-align:center;'>You requested to reset your password. if this was you, please click the Reset Password button below else ignore.</p>
                              <a href="http://localhost:3000/reset?email=${req.body.email}&key=${key}">
                                <button style="
                                      color: #fff;
                                      background-color: #343a40;
                                      border-color: #343a40;
                                      display: inline-block;
                                      font-weight: 400;
                                      text-align: center;
                                      vertical-align: middle;
                                      -webkit-user-select: none;
                                      -moz-user-select: none;
                                      -ms-user-select: none;
                                      user-select: none;
                                      padding: .375rem .75rem;
                                      font-size: 1rem;
                                      line-height: 1.5;
                                      border-radius: .25rem;

                                ">Reset Password</button>
                              </a>`;
                    helper.send_mail(req.body.email, msg);
                    res.json({dataCount : 1, data : {status : 200}});
                
      } else
        res.json({dataCount : 1, data : {status : 204}});
    })
    .catch(err => { res.json({dataCount : 1, data : {status : 300, err : err}}); })
});

router.post('/resetPassword', function(req, res, next) {
  // console.log(req.body.email);
  console.log(req.body);
    Keys.findOne({"key": req.body.key})
    .then(results => {
      if (results)
      {

        User.findOne({"email": req.body.email})
        .then(results => {
          
          if (results){
            bcrypt.genSalt(process.env.SALT_BCRYPT, function(err, salt) {
                if (err) return next(err);

                bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                    if (err)
                        res.json({dataCount : 1, data : {status : 208, err : err}});
                        //status 208 failed to update password
                    else{
                      User.updateOne({_id: results._id}, {
                          password : hash
                      })
                      .then(users => {
                        res.json({dataCount : 1, data : {status : 200, err : err}});
                        //status 200 success
                      })
                      .catch(error => { console.log(error); })
                    }
                });
            });
          }
          else
            res.json({dataCount : 1, data : {status : 204, err : err}});
        })
        .catch(err => { res.json({dataCount : 1, data : {status : 204, err : err}}); })
      } else
        res.json({dataCount : 1, data : {status : 204, err : err}});
    })
    .catch(err => { res.json({dataCount : 1, data : {status : 204, err : err}}); })
    //status 204 failed to locate the user
});

router.get('/logout', function(req, res, next) {
  console.log('hitting logout route');
   req.session.user = null;
   res.render('index');
});

module.exports = router;
