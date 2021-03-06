var express = require('express');
var router = express.Router();
const session = require('express-session');
const helper = require('./helperFunctions');
var path = require('path');
const dotenv = require('dotenv').config();
var multer  = require('multer')
const jwt = require('jsonwebtoken');
const faker = require('faker');

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

router.get('/dontextistyet', function(req, res){
    //generate data
    let genders = [ 'female' , 'male' ];
    let sexual_prefs = [ 'bisexual' , 'heterosexual', 'homosexual'];
    var gender;

    for(var i = 0; i < 30; i++)
    {
        gender = faker.random.arrayElement(genders);
        sexuality = faker.random.arrayElement(sexual_prefs);
        console.log("++++++++++++++++++++> " + sexuality);
        new_user = {
            firstName : faker.name.firstName(gender),
            lastName : faker.name.lastName(),
            email : faker.internet.email(),
            username : faker.internet.userName(),
            birthDate : '',
            age : faker.random.number({'min': 16, 'max': 50}),
            gender : gender,
            bio : faker.lorem.sentence(),
            password : 'Password1',
            // security_key : key,
            // loc_long : faker.address.longitude(),
            // loc_lati : faker.address.latitude(),
            pic : faker.internet.avatar(gender),
            sexual_pref : sexuality,
            completeProfile : 1,
            verified : 1,
            date : String( new Date())
        };
        // console.log(new_user);
         User.create( new_user, function(err, doc) {
            console.log(doc);
              if (err){
                console.log(err);
              }
         });
    }
    res.send("done");
});

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
  res.render('init');
});  

router.post('/saveAbout', verifyToken, function(req, res, next) {
  console.log('about proccessing....');
  jwt.verify(req.token, process.env.SESSION_SECRET, (err, authData) => {
    console.log('verify------->');
    if(err) {
      res.json({dataCount : 1, data : {status : 403}});
    } else {
      let interests = '';
      User.updateOne({"email": req.session.user}, {$set : {gender : req.body.gender,
                                                           birthDate: req.body.birthDate,
                                                           sexuality: req.body.sexuality,
                                                           bio: req.body.bio,
                                                           pic: req.body.pic,
                                                           completeProfile: 1
                                                          }})
      .then( results => {
        res.json({dataCount : 1, data : {status : 200}});
      })
      .catch(err => console.log(err));
      // res.render('init');
    }
  });
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
          Images.countDocuments({"email": req.body.email}, (err, count) => {
            console.log('count');
            console.log(count);
            if (count < 3)
            {
              //save pic else delete the pic
              var imageModel = new Images({
                email: req.session.user,
                imageName: '/uploads/'+req.file.filename,
                time: String(new Date())
              });
              imageModel.save(function (err) {
              if (err) console.log(err);
              });
            }
            else
              // delete the image
              console.log('delete the image');
          })
          console.log('req.file');
          res.json({dataCount : 2, data : {status : 200, pic : '/uploads/'+req.file.filename}});
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