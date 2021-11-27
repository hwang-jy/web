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


function drawBoardList(req, res, done){
    var page = req.params.page;
    var pageIsNumber = REGEX.number.page.test(page);
    var searchInfo = new searchData(req);
    var params = [];

    if(!pageIsNumber){
        res.redirect('/boards/1');
        return;
    }

    if(req.query.type == undefined){    
        params = [BOARD_CONFIG.PAGES_PER_UNIT, getOffset(page, BOARD_CONFIG.PAGES_PER_UNIT)];
    }else{
        params = [`%${searchInfo.key}%`, BOARD_CONFIG.PAGES_PER_UNIT, getOffset(page, BOARD_CONFIG.PAGES_PER_UNIT)];        
    }

    DB.query(searchInfo.sql, params, function(err_list, db_list){
        if(err_list) {console.error("ERROR: R-BL-100", err_list); done(err_list); return;}

        DB.query(SQL.board.select.rows, function(err_rows, db_total){
            if(err_rows) {console.error("ERROR: R-BL-101"); done(err_rows); return;}
            var total = db_total[0].total;
            var board_data = new Board(page, total, db_list);
            
            req.session.page = page;
            done(null, {user:req.user, board: board_data, search: searchInfo});
        });
    });
}

class searchData{
    constructor(request){
        this.query = ""
        this.type = "";
        this.key = "";

        if(request.query.type != undefined){
            this.type = request.query.type;
            this.key = request.query.key;
            this.sql = SQL.board.select.listByType(this.type);
            this.query = `/search?searchType=${this.type}&searchKey=${this.key}`;
        }else{
            this.sql = SQL.board.select.list;
        }
    }
}

function isLogin(request){
    if(request.user == undefined){
        return false
    }

    return request.user.isLogin;
}

router.get('/', function(req, res){
    if(!isLogin(req)){
        res.redirect('/auth');
        return;
    }

    res.render('board/board_write', {user: req.user});
});

router.post('/', function(req, res){

    if(!isLogin(req)){
        res.redirect('/auth');
        return;
    }

    var formMethod = req.body.method;
    var boardId = req.body.id;
    var authId = req.user.id;

    if(formMethod != "DELETE"){
        var subject = req.body.subject;
        var title = req.body.title;
        var contents = req.body.contents;
    }
    
    if(formMethod == "POST"){
        DB.query(SQL.board.insert.contents, [subject, title, contents, authId], function(err, result){
            if(err){console.error("ERROR: contents create fail."); return;}
            res.redirect('/board/' + result.insertId);
        });

    }else if(formMethod == "PUT"){
        DB.query(SQL.board.update.contents, [title, contents, boardId, authId], function(err, result){
            if(err){console.error("ERROR: contents update fail."); return;}
            res.redirect('/board/' + boardId);
        });

    }else if(formMethod == "DELETE"){
        DB.query(SQL.board.update.contentDisable, [boardId, authId], function(err, result){
            if(err){console.error("ERROR: contents disable fail."); return;}
            res.redirect('/board/page/1');
        });
    }
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

    DB.query(SQL.board.select.contents, [id], function(err, result){
        if(err){console.error("ERROR: R-B-100"); done(err); return;}

        var isEnable = (result[0].enabled == 'Y' ? true : false);

        if(!isEnable){
            done({message: "삭제된 글 입니다."});
            return;
        }

        var page = req.session.page;
        var isAuthor = (req.user.id == result[0].auth);

        res.render('board/board', {user:req.user, board: result[0], prevPage: page, isOwner: isAuthor});
    });
});

router.post('/update', function(req, res){
    var contentsId = req.body.id;
    var authId = req.user.id;

    DB.query(SQL.board.select.contentsAuth, [contentsId, authId], function(err, result){
        if(err){console.error("ERROR: Contents read fail.", err); return;}

        res.render('board/board_write', {user: req.user, board: result[0]});
    });
});

router.get('/page/:page', function(req, res){
    drawBoardList(req, res, function(err, result){
        if(err){return;}

        res.render('board/boards', result);
    });
});

router.get('/page/:page/search', function(req, res){
    drawBoardList(req, res, function(err, result){
        if(err){return;}

        res.render('board/boards', result);
    });
});

module.exports = router;