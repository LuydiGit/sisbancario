const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST, // Host do banco, definido no .env
  user: process.env.DB_USER, // Usuário do banco, definido no .env
  password: process.env.DB_PASSWORD, // Senha do banco, definido no .env
  database: process.env.DB_NAME, // Nome do banco, definido no .env
});

console.log("Conectando ao banco com as configurações:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conexão com o banco de dados bem-sucedida!");
    connection.release(); // Libera a conexão após o teste
  }
});

module.exports = pool.promise(); // Exporta o pool com suporte a Promises
