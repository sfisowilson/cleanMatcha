var express = require('express');
var router = express.Router();
const session = require('express-session');
const helper = require('./helperFunctions');
var path = require('path');
const dotenv = require('dotenv').config();
var multer  = require('multer')
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/users');
const Images = require('../models/images');

router.use(session({
     secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 100000000 }
 }));

// multer storage
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

// init uploa
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000
  },
  fileFilter: function (req, file, cb){
    checkFileType(file, cb);
  }
}).single('picUpload');

// check image type
function checkFileType(file, cb){
  //allowed extensions
  const fileTypes = /jpeg|jpg|png|gif/;

  // check ext
  const extname = fileTypes.test( path.extname(file.originalname).toLowerCase());

  // check mime
  const mimeTypes = fileTypes.test(file.mimetype);

  if (mimeTypes && extname) {
    return cb(null, true);
  } else {
    cb.send('Error', 'Images Only!');  
  }
}


/* GET home page. */
router.get('/', checkSession, function(req, res, next) {
  // pass all user info but the password              progress...
  // pass all his pictures
  // if allowed pass his location
  // pass list of likes, views, connections
  console.log('req.session.user');
  console.log(req.session.user);
  
  User.findOne({"email": req.session.user})
  .then(user => {
     Images.find({"email": req.session.user})
     .then(pics => {
        console.log('profile');
        // console.log(user);
        res.render('profile', {
          userDetailes : user,
          pics: pics
        });

     })

  })
  .catch(err => {console.log(err);})
}); 

router.post('/refreshGallery', verifyToken, function(req, res, next) {
  User.findOne({"email": req.session.user})
  .then(user => {
     Images.find({"email": req.session.user})
     .then(pics => {
        console.log('profile');
        // console.log(user)
        res.json({dataCount : 3, data : {status : 200, userDetailes : user, pics : pics}});

     })

  })
  .catch(err => {console.log(err);})
});

router.post('/delete', verifyToken, function(req, res, next) {
  User.findOne({"email": req.session.user})
  .then(user => {
     Images.find({"email": req.session.user})
     .then(pics => {
        console.log('profile');
        // console.log(user)
        res.json({dataCount : 3, data : {status : 200, userDetailes : user, pics : pics}});

     })

  })
  .catch(err => {console.log(err);})
});

router.post('/storePic', verifyToken, function(req, res, next) {
    console.log('authData');
  jwt.verify(req.token, process.env.SESSION_SECRET, (err, authData) => {
    console.log('verify------->');
    if(err) {
      res.json({dataCount : 1, data : {status : 403}});
    } else {
      console.log('past token validation');
      upload(req, res, (err) => {
        if (err){
          console.log(err);
        } else {
          //save the name of the file to mongoose
          // store all images in a separete model
          Images.countDocuments({"email": req.session.user}, (err, count) => {
            console.log('count '+ req.session.user);
            console.log(count);
            if (count < 4)
            {
              //save pic else delete the pic
              var imageModel = new Images({
                email: req.session.user,
                imageName: 'uploads/' + req.file.filename,
                time: String(new Date())
              });
              imageModel.save(function (err) {
              if (err) console.log(err);
              });
            }
            else
              // delete the image
              fs.unlinkSync(req.file.path);
              console.log('delete the image');
          })
          console.log('req.file');
          res.json({dataCount : 1, data : {status : 200}});
        }
      })
    }
  });
  
  
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  // console.log('bearerHeader');
  // console.log(bearerHeader);
  if((typeof bearerHeader !== 'undefined') && (req.session.user)) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    console.log(req.token);
    next();
  } else {
    req.session.user = null;
    res.json({dataCount : 1, data : {status : 403}});
  }
}

function checkSession(req, res, next){
  if (req.session.user)
    next()
  else
    res.render('index', {error: 'please sign in first!'});
}

module.exports = router;