// Importação de módulos
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';

import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

//============== Conexão com o DB do Banco 1 ==============
// Criando conexão
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

//============== Conexão com o DB do Banco Central ==============
// Criando conexão
const db_bc = mysql.createConnection({
  host: process.env.DB_HOST_BC,  
  user: process.env.DB_USER_BC, 
  password: process.env.DB_PASSWORD_BC,
  database: process.env.DB_NAME_BC
});

// Verificar a conexão com o banco de dados do
db_bc.connect((err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados do BC:', err);
    return;
  }
  console.log('Conectado ao banco de dados do BC');
});

const app = express();
const PORT = process.env.PORT || 5002;

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

// Route to create a new Pix key
app.post('/api/v1/pixKey', async (req, res) => {
  const { bancoId, clientId, saldo, chavePix, tipo_chave_pix } = req.body;

  // Validação dos campos obrigatórios
  if (!bancoId || !clientId || !saldo || !chavePix || !tipo_chave_pix) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Insere os dados na tabela 'contas'
    const sqlContas = `
      INSERT INTO contas (cliente_id, saldo, chave_pix, tipo_chave_pix) 
      VALUES (?, ?, ?, ?)
    `;
    const contasValues = [clientId, saldo, chavePix, tipo_chave_pix];

    const resultContas = await new Promise((resolve, reject) => {
      db.query(sqlContas, contasValues, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Insere os dados na tabela 'chaves_pix' no banco central
    const sqlPixBC = `
      INSERT INTO chaves_pix (banco_id, cliente_id, chave, tipo) 
      VALUES (?, ?, ?, ?)
    `;
    const pixValues = [bancoId, clientId, chavePix, tipo_chave_pix];

    const resultPixBC = await new Promise((resolve, reject) => {
      db_bc.query(sqlPixBC, pixValues, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Resposta final
    res.status(201).json({ message: "Chave Pix cadastrada com sucesso" });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Banco 2 rodando na porta ${PORT}`);
});