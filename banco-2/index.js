// Importação de módulos
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';

import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Criar conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,  // Exemplo: localhost ou IP do seu servidor
  user: process.env.DB_USER,  // Seu usuário do MySQL
  password: process.env.DB_PASSWORD,  // Sua senha do MySQL
  database: process.env.DB_NAME  // Nome do seu banco de dados
});


// Verificar a conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});


const app = express();
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(results)
    res.status(200).json(results);
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Banco 2 rodando na porta ${PORT}`);
});