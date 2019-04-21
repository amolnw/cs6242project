var mysql = require('mysql');
var databaseInfo = {
	pool: '10',
    host     : 'nyctaxidb.cti58fwvgshd.us-east-1.rds.amazonaws.com',
    user     : 'nyctaxidbuser',
    password : 'Password6242$',
    database : 'nyctaxidb',
    timeout  : '10000'
};

var dbconnection = mysql.createPool(
	databaseInfo
);

dbconnection.on('connection', function (connection) {
  connection.on('error', function (err) {
    console.log('MySQL Connection error', err.code);
  });
  connection.on('close', function (err) {
	console.log('MySQL Connection closing error', err.code);
  });

});
module.exports = dbconnection;