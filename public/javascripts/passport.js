const DB = require('./database');
const SQL = require('./sql');
const googleCredentials = require('../../config/google.json');
const { InsufficientStorage } = require('http-errors');
const googleConfig = {
    clientID: googleCredentials.web.client_id,
    clientSecret: googleCredentials.web.client_secret,
    callbackURL: googleCredentials.web.redirect_uris[0]
}


module.exports = function(app){
    const passport = require('passport');
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        console.log('serializeUser', user);
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        console.log('deserializeUser', id);
        done(null, id);
    });

    passport.use(new GoogleStrategy(googleConfig, 
        function(accessToken, refreshToken, profile, done){
            const email = profile.emails[0].value;

            DB.query(SQL.auth.select.userByEmail, [email], function(err11, user){
                if(err11){
                    console.error('ERROR L100', err11);
                    done(err11);
                }

                //구글 계정으로 첫 로그인 시 DB에 계정 등록
                if(user.length === 0){
                    const name = profile.displayName;
                    
                    DB.query(SQL.auth.insert.newUser, [email, accessToken], function(err21, user21){
                        if(err21){
                            console.error('ERROR L21', err21);
                            done(err21);
                        }

                        DB.query(SQL.auth.select.userById, [user21.insertId], function(err22, user22){
                            if(err22){
                                console.error('ERROR L22', err22);
                                done(err22);
                            }

                            done(null, user22[0]);
                        });
                    });
                }
                
                //DB에 등록된 구글 이메일 로그인 시 토큰 업데이트
                if(user.length === 1){
                    DB.query(SQL.auth.update.tokenById, [accessToken, user[0].id], function(err31, user31){
                        if(err31){
                            console.error('ERROR L31', err31);
                            done(err31);
                        }

                        user[0].token = accessToken;
                        done(null, user[0]);
                    });
                }
            })
    }));

    return passport;
}