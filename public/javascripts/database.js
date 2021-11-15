const mysql = require('mysql');
const config = require('../../config/database.json');
const connection = mysql.createConnection(config);

module.exports = connection;

//TODO: 자주 사용하는 쿼리는 이곳에 구현하면 되지 않을까?
// module.exports = function(){

//     login = function(req, res){
//         const id = req.body.id;
//         const pw = req.body.pw;

//         connection.query('SELECT * FROM auth WHERE name=? password=?', [id, pw], function(err, result){
//             if(err){
//                 console.error('sql error', err);
//                 res.redirect('/auth');
//                 return;
//             }

//             if(result.length === 0){
//                 res.redirect('/auth');
//                 return;
//             }

//             req.logIn();
//             console.log('login success');
//             res.writeHead(302, {
//                 Location: '/'
//             }).end();
//         });
//     }

// }