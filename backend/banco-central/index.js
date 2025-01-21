// Importação de módulos
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import axios from 'axios';

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

//Route to verify if pix key exists
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

// Função para obter os dados do destinatário
async function getDataRecipient(pixKey) {
  try {
    // Obter IDs do banco e cliente associado à chave Pix
    const selectIDs = `SELECT banco_id, cliente_id FROM chaves_pix WHERE chave = ? LIMIT 1`;
    const [existingIDs] = await db_bc.promise().query(selectIDs, [pixKey]);

    if (existingIDs.length === 0) {
      throw new Error("Chave Pix não encontrada no Banco Central.");
    }

    const { banco_id: bancoId, cliente_id: clienteId } = existingIDs[0];

    // Obter a URL da API do banco destinatário
    const selectUrlApiBank = `SELECT name, url_api FROM bancos WHERE id = ? LIMIT 1`;
    const [urlAPI] = await db_bc.promise().query(selectUrlApiBank, [bancoId]);

    if (urlAPI.length === 0) {
      throw new Error("Banco destinatário não encontrado no sistema.");
    }

    // Retornar os dados formatados
    return {
      bancoName: urlAPI[0].name,
      bancoApiUrl: urlAPI[0].url_api,
      clienteId: clienteId,
    };
  } catch (error) {
    throw new Error(error.message || "Erro ao buscar dados do destinatário.");
  }
}

//Route to get recipient client data
app.get('/api/v1/cliente/:pixKey', async (req, res) => {
  const { pixKey } = req.params;

  try {
    // Chama a função para buscar os dados
    const { bancoName, bancoApiUrl, clienteId } = await getDataRecipient(pixKey);

    // Requisição à API do banco destinatário para obter dados do cliente
    const response = await axios.get(`${bancoApiUrl}/api/v1/client/${clienteId}`);
    const dataClientResponse = response.data.result;

    if (!dataClientResponse || Object.keys(dataClientResponse).length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dados do cliente não encontrados.",
      });
    }

    return res.status(200).json({
      result: dataClientResponse,
      bancoName: bancoName,
    });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error.message || error);

    // Tratar erros específicos
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Cliente destinatário não encontrado no banco especificado." });
    }

    res.status(500).json({ message: "Erro interno no servidor. Tente novamente mais tarde." });
  }
});

//Route to add pix key
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

app.put('/api/v1/transferenciaPix', async (req, res) =>{
  const { valor, chavePix } = req.body;

  // Validação dos campos obrigatórios
  if (!valor || !chavePix) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try{
    // Chama a função para buscar os dados
    const { bancoApiUrl, clienteId } = await getDataRecipient(chavePix);

    //Objeto com os valores da transferência
    const values = {
      valor,
      clienteId
    }
    // Requisição à API do banco destinatário para creditar o valor da transação
    const response = await axios.put(`${bancoApiUrl}/api/v1/receiveTransfer`, values);
    const transferConfirmation = response.data;

    if(transferConfirmation.Sucess === true){
      // Resposta final
      return res.status(201).json({ Sucess: true });
    }
    

  }catch (error){
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
})
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