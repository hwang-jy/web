var express = require('express');
var router = express.Router();
const DB = require('../public/javascripts/database.js');
const SQL = require('../public/javascripts/sql.js');

router.get('/', function(req, res){
  renderBoardList(req, res);
});

router.get('/:page', function(req, res){
  renderBoardList(req, res);
});

function getPage(req){
  const FIRST_PAGE = 1;
  const CURR_PAGE = Math.max(req.params.page, FIRST_PAGE);
  return req.params.page ? CURR_PAGE: FIRST_PAGE;
}

function getPageConfig(page){
  return { 
    unit: 100,
    view: 10,
    offset: 0
  };
}

function renderBoardList(req, res){
  var page = getPage(req);
  var config = getPageConfig(page);
  DB.query(SQL.board.select.list, [config.offset, config.unit], (err, result) => { 
    if(err){
      console.error("BS_100");
      return;
    }

    DB.query(SQL.board.select.rows, (err, total) => {
      var data = result;
      data.total = total[0].total;
      data.page = page;
      res.render('index', {user: req.user, board_list: data})
    });
  });
}

module.exports = router;
