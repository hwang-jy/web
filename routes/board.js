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

function isLogin(request){
    if(request.user == undefined){
        return false
    }

    return request.user.isLogin;
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
    if(!isLogin(req)){
        res.redirect('/auth');
        return;
    }

    res.render('board/new');
});

router.get('/:id', function(req, res, done){
    if(!isLogin(req)){
        res.redirect('/auth');
        return;
    }

    var id = req.params.id;
    var idIsNumber = REGEX.number.id.test(id);

    if(!idIsNumber){
        done(null);
        return;
    }

    DB.query(SQL.board.select.content, [id], function(err, result){
        if(err){console.error("ERROR: R-B-100"); done(err); return;}

        console.log('board >>', result[0]);
        res.render('board/board', {user:req.user, board: result[0]});
    });
});

router.get('/page/:page', function(req, res){
    var page = req.params.page;
    var pageIsNumber = REGEX.number.page.test(page);

    if(!pageIsNumber){
        res.redirect('/boards/1');
        return;
    }

    renderBoardList(req, res, function(err, result){
        if(err){console.error("ERROR", err); return;}
        res.render('board/boards', {user:req.user, board: result});
    });
});

module.exports = router;