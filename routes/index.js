var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {error: 'you need to register first' });
});

module.exports = router;
