var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('auth', {});
});

router.get('/sign', function(req, res, next){
  res.render('sign', {});
});

router.post('/sign', function(req, res, next){
  res.render('sign', {});
})

module.exports = router;
