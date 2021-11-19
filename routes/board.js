const DB = require('../public/javascripts/database');
const SQL = require('../public/javascripts/sql.js');
const REGEX = require('../public/regex/regex');
const BOARD_CONFIG = require('../config/board.json');

var express = require('express');
var router = express.Router();

var Board = require('../public/javascripts/board/BoardClass');

function getOffset(page, unit) {
    if(page - 1 > 0){
        return (Math.trunc((page - 1) / 10)) * unit;
    }
    return 0;
}

function renderBoardList(request, response, done) {
    var page = request.params.page;

    DB.query(SQL.board.select.list, [BOARD_CONFIG.PAGES_PER_UNIT, getOffset(page, BOARD_CONFIG.PAGES_PER_UNIT)], function(err1, db_list){
        if(err1) {console.error("ERROR: R-BL-100"); done(err1); return;}

        DB.query(SQL.board.select.rows, function(err2, db_total){
            if(err2) {console.error("ERROR: R-BL-101"); done(err1); return;}
            var total = db_total[0].total;
            var board_data = new Board(page, total, db_list);
            done(null, board_data);
        });
    });
}

router.get('/', function(req, res){
    renderBoardList(req, res, function(err, result){
        if(err){console.error("ERROR", err); return;}
        res.render('board/board', {user:req.user, board: result});
    });
});

router.get('/:page', function(req, res){
    var page = req.params.page;
    var pageIsNumber = REGEX.number.page.test(page);

    if(!pageIsNumber){
        res.redirect('/board/1');
        return;
    }

    renderBoardList(req, res, function(err, result){
        if(err){console.error("ERROR", err); return;}
        res.render('board/board', {user:req.user, board: result});
    });
});

module.exports = router;