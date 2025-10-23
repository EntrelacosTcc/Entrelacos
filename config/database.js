const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

connection.connect((error) => {
  if (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error);
  } else {
    console.log('✅ Conectado ao MySQL Railway!');
  }
});

module.exports = connection;