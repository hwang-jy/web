const mysql = require('mysql');
const config = require('../../config/database.json');
const connection = mysql.createConnection(config);

module.exports = connection;