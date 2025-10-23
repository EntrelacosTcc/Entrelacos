const mysql = require('mysql2');
require('dotenv').config(); // Isso carrega as variáveis do .env

const connection = mysql.createConnection(process.env.MYSQL_URL);

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