var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv').config();
const session = require('express-session');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

mongoose.set('useCreateIndex', true);
//mongodb+srv://admin:<password>@matcha-vpb7s.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://admin:"+ process.env.DB_PASSWORD +"@matcha-vpb7s.mongodb.net/test?retryWrites=true&w=majority" ,  { useNewUrlParser: true })
.catch(err => console.log(err));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var initRouter = require('./routes/init');
var dashboardRouter = require('./routes/dashboard');
var profileRouter = require('./routes/profile');
var userProfileRouter = require('./routes/userProfile');


var app = express();

app.use(session({
     secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 100000000 }
 }));
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/init', initRouter);
app.use('/dashboard', dashboardRouter);
app.use('/profile', profileRouter);
app.use('/userProfile', userProfileRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // console.log('err= ' + req.url);
  // console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
