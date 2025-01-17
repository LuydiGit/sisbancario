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
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());
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

//Route to create a new client
app.post('/api/v1/conta', (req, res) => {
  const { name, cpf, data_nascimento, email, celular, senha } = req.body;

  if (!name || !cpf || !data_nascimento || !email || !celular || !senha) {
    return res.status(400).send("Todos os campos são obrigatórios");
  }

  const sql = `INSERT INTO clientes (nome, cpf, data_nascimento, email, celular, senha) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [name, cpf, data_nascimento, email, celular, senha];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir dados:", err);
      return res.status(500).send("Erro no servidor");
    }
    if(result){
      return res.status(200).send("Dados inseridos com sucesso");
    }
  });
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Banco 1 rodando na porta ${PORT}`);
});