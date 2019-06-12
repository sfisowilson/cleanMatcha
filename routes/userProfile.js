var express = require('express');
var router = express.Router();
const session = require('express-session');
const dotenv = require('dotenv').config();

const User = require('../models/users');

router.use(session({
     secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 100000000 }
 }));


/* GET home page. */
router.get('/', checkSession, function(req, res, next) {
  // pass all user info but the password              progress...
  // pass all his pictures
  // if allowed pass his location
  // pass list of likes, views, connections
  console.log('userId');
  console.log(req.query.user);
  
  User.findOne({"_id": req.query.user})
  .then(user => {
    console.log('userProfile');
    // console.log(user);
    res.render('userProfile', {
      userDetailes : user
    });

  })
  .catch(err => {console.log(err);})
});  

function checkSession(req, res, next){
  if (req.session.user)
    next()
  else
    res.render('index', {error: 'please sign in first!'});
}

module.exports = router;