// Importação de módulos
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';

import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();


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
const PORT = process.env.PORT || 5003;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.get('/api/v1/pixKey/:pixKey', async (req, res) => {
  const { pixKey } = req.params;

  try {
    // Verifica se a chave Pix já está cadastrada
    const checkPixSqlBC = `SELECT * FROM chaves_pix WHERE chave = ?`;
    const [existingPixBC] = await db_bc.promise().query(checkPixSqlBC, [pixKey]);

    if (existingPixBC.length > 0) {
      return res.status(409).json({ message: "A chave Pix já está cadastrada no Banco Central." });
    }

    return res.status(200).json({ message: "Cadastro autorizado." });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

app.post('/api/v1/pixKey', async (req, res) => {
  const { bancoId, clientId, chavePix, tipo_chave_pix } = req.body;

  try {
    // Insere os dados na tabela 'chaves_pix'
    const sqlInsertPix = `
      INSERT INTO chaves_pix (banco_id, cliente_id, chave, tipo) 
      VALUES (?, ?, ?, ?)
    `;
    await db_bc.promise().query(sqlInsertPix, [bancoId, clientId, chavePix, tipo_chave_pix]);

    return res.status(201).json({ message: "Chave Pix cadastrada com sucesso no Banco Central." });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

app.delete('/api/v1/pixKey', async (req, res) => {
  const { chavePix } = req.query;

  try {
    // Deleta a chave Pix da tabela 'chaves_pix' no banco central
    const deletePixSqlBC = `
      DELETE FROM chaves_pix WHERE chave = ?
    `;

    await db_bc.promise().query(deletePixSqlBC, [chavePix]);

    return res.status(201).json({ message: "Chave Pix apagada com sucesso do Banco Central." });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Banco Central rodando em http://localhost:${PORT}`);
});