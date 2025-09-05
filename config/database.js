const mysql = require('mysql2');
require('dotenv').config(); // Isso carrega as variáveis do .env

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: 'DB_ENTRELACOS', // ← Este é seu banco!
  port: process.env.MYSQLPORT
});