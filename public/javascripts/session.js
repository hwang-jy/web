

module.exports = function(app){
    var session = require('express-session');
    var FileStore = require('session-file-store')(session);

    const config_session = {
        secret: 'login_session',
        resave: true,
        saveUninitialized: true,
        cookie: { 
            httpOnly: false,
            secure: false
        },
        store:new FileStore()
    }

    app.use(session(config_session));
    return session;
}

