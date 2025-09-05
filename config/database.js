const mysql = require('mysql2');
require('dotenv').config(); // Isso carrega as variáveis do .env

const connection = mysql.createConnection(process.env.MYSQL_URL);