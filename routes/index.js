var express = require('express');
var router = express.Router();
const db = require('../public/javascripts/database.js');


/* GET home page. */
router.get('/', function(req, res, next){
  db.query(`SELECT 
              BS_BOARD.id, 
              title, 
              auth.name AS name, 
              DATE_FORMAT(created, '%H:%i %m-%d-%y') AS created, 
              views, 
              good-bad AS hit
              FROM BS_BOARD LEFT JOIN auth 
              ON BS_BOARD.auth=auth.id`, 
            (err, result) => {
    if(err){
      console.error("sql error");
    }

    res.render('index', {title: 'Community', user: req.user, board_list: result})
  });
})

module.exports = router;
