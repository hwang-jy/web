var express = require('express');
var router = express.Router();

module.exports = function(passport){
  // base route: /auth
  router.get('/', (req, res, next) => {
    res.render('auth/login', {});
  });

  router.get('/google', 
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/plus.login', 'email']
  }));

  router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/auth'}),
      (req, res) => {
        req.session.save(() => { 
          res.redirect('/');
        });
      }
  );

  router.get('/logout', (req, res) => {
    req.logOut();
    res.clearCookie('connect.sid');
    req.session.destroy((err) => {
      if(err){
        console.error('logout fail.', err);
      }

      res.redirect('/');
    });
  });

  return router;
}