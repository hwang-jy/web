

module.exports = function(app){
    var session = require('express-session');
    var FileStore = require('session-file-store')(session);

    const config_session = {
        secret: 'login_session',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            httpOnly: true,
            /*
            if https
                secure = true;
            else
                secure = false;
            */
            secure: false
        },
        store:new FileStore()
    }

    app.use(session(config_session));
    return session;
}

