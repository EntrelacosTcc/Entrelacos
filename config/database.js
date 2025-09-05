const mysql = require('mysql2');
require('dotenv').config(); // Isso carrega as variáveis do .env

module.exports = {
  connection: {
    host: process.env.MYSQL_URL ? new URL(process.env.MYSQL_URL).hostname : 'localhost',
    user: process.env.MYSQL_URL ? new URL(process.env.MYSQL_URL).username : 'root',
    password: process.env.MYSQL_URL ? new URL(process.env.MYSQL_URL).password : 'DS153010Bar@',
    database: process.env.MYSQL_URL ? new URL(process.env.MYSQL_URL).pathname.substr(1) : 'db_entrelacos',
    port: process.env.MYSQL_URL ? new URL(process.env.MYSQL_URL).port : 3306
  }
};