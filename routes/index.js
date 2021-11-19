var express = require('express');
const { end } = require('../public/javascripts/database.js');
var router = express.Router();
const DB = require('../public/javascripts/database.js');
const SQL = require('../public/javascripts/sql.js');
const REGEX = require('../public/regex/regex');

router.get('/', function(req, res){
  renderBoardList(req, res);
});

router.get('/:page', function(req, res){
  if(REGEX.number.page.test(req.params.page)){
    renderBoardList(req, res);
  }else{
    res.redirect('/');
  }
});

var pageConfig = {
    currPage: 1,
    unit: 100,
    view: 10,
    total: 0,
    
    setValidPage: function(request){
      const FIRST_PAGE = 1;
      const rqPage = request.params.page;      
      const CURR_PAGE = Math.max(rqPage, FIRST_PAGE);
      this.currPage = rqPage ? CURR_PAGE: FIRST_PAGE;
    },

    /** @returns Number of pages */
    getButtons: function(){
      var buttonCount = this.getButtonCount()
      var off = this.getOffset(this.view);
      return this.makeNumbers(1, buttonCount, off);
    },

    getButtonCount: function(){
      var post_start = this.total - this.getOffset(this.unit);
      if(post_start % this.unit == 0){
        return 10;
      }
      return Math.ceil(post_start % this.unit / this.view);
    },

    /** @returns  Number of posts */
    getViewArray: function(){
      var start = this.view * (this.currPage - 1);
      var end = Math.min((this.view * this.currPage) - 1, this.total - 1);
      var off = this.getOffset(this.unit);
      return this.makeNumbers(start, end, -off);
    },

    /**
     * @param {number} start 
     * @param {number} end 
     * @param {number} offset default 0
     */
    makeNumbers: function(start, end, offset=0){
      obj = [];
      for(i=start; i<=end; i++){
        obj.push(i + offset);
      }
      return obj;
    },

    getOffset: function(unit){
      if(this.currPage - 1 > 0){
        return (Math.trunc((this.currPage - 1) / 10)) * unit;
      }
      return 0;
    }
}

function renderBoardList(req, res){

  var config = pageConfig;
  config.setValidPage(req);
  DB.query(SQL.board.select.list, [config.unit, config.getOffset(config.unit)], (err, result) => { 
    if(err){
      console.error("BS_100", err);
      return;
    }

    DB.query(SQL.board.select.rows, (err, total) => {
      var data = result;
      config.total = total[0].total;
      data.page = config;
      data.post = [];
      arr = config.getViewArray();
      
      arr.forEach(element => {
        data.post.push(data[element]);
      });

      res.render('index', {user: req.user, board_list: data})
    });
  });
}

module.exports = router;
