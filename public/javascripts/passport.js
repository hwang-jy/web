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

            DB.query(SQL.auth.select.userByEmail, [email], function(err_search, db_search_user){
                if(err_search){
                    console.error('ERROR L100', err_search);
                    done(err_search);
                }

                //구글 계정으로 첫 로그인 시 DB에 계정 등록
                if(db_search_user.length === 0){
                    const name = profile.displayName;
                    
                    // TODO: 닉네임으로 사용될 값이 중복될 수 있으므로 닉네임 변경 기능 추가
                    DB.query(SQL.auth.insert.signup, [email, name, accessToken], function(err_insert, db_new_user){
                        if(err_insert){
                            console.error('ERROR L21', err_insert);
                            done(err_insert);
                        }

                        DB.query(SQL.auth.select.userById, [db_new_user.insertId], function(err, result){
                            if(err){
                                console.error('ERROR L22', err);
                                done(err);
                            }

                            done(null, result[0]);
                        });
                    });
                }
                
                //DB에 등록된 구글 이메일 로그인 시 토큰 업데이트
                if(db_search_user.length === 1){
                    DB.query(SQL.auth.update.tokenById, [accessToken, db_search_user[0].id], function(err_update, result){
                        if(err_update){
                            console.error('ERROR L31', err_update);
                            done(err_update);
                        }

                        db_search_user[0].token = accessToken;
                        done(null, db_search_user[0]);
                    });
                }
            })
    }));

    return passport;
}