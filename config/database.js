const mysql = require('mysql2');
require('dotenv').config(); // Isso carrega as variáveis do .env

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

// 2. Conecte ao banco
connection.connect((error) => {
  if (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error);
  } else {
    console.log('✅ Conectado ao MySQL Railway!');
  }
});

// 3. Exporte a conexão
module.exports = connection

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10, // número máximo de conexões simultâneas
});

module.exports = pool;