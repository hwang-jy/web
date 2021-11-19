var express = require('express');
var router = express.Router();

module.exports = function(passport){
    //base route: /auth
    router.get('/', function(req, res, next){
        res.render('auth/login');
    });

    router.get('/google', passport.authenticate('google', { 
        scope: ['https://www.googleapis.com/auth/plus.login', 'email']
    }));

    router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/auth'}), function(req, res){
        req.session.save(function(){
            res.redirect('/');
        })
    });
    
    router.get('/logout', function(req, res){
        req.logOut();
        res.clearCookie('connect.sid');
        req.session.destroy(function(err){
            if(err){console.error('logout fail.');}

            res.redirect('/');
        });
    });

    return router;
}

