// Importação de módulos
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import axios from 'axios';

import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

//============== Conexão com o DB do Banco 1 ==============
// Criando conexão
const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME 
});

// Verificar a conexão com o banco de dados do
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

// Rota para criar um novo cliente
app.post('/api/v1/cliente', async (req, res) => {
  const { name, cpf, data_nascimento, email, celular, senha } = req.body;

  // Validação dos campos obrigatórios
  if (!name || !cpf || !data_nascimento || !email || !celular || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    // Verifica se o cliente já existe
    const clienteExistenteQuery = `SELECT id FROM clientes WHERE cpf = ?`;
    const [clienteExistente] = await db.promise().query(clienteExistenteQuery, [cpf]);

    if (clienteExistente.length > 0) {
      return res.status(409).json({ error: "Cliente já cadastrado." });
    }

    // Insere o cliente na tabela 'clientes'
    const sqlInsertCliente = `
      INSERT INTO clientes (nome, cpf, data_nascimento, email, celular, senha) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, cpf, data_nascimento, email, celular, senha];
    const [result] = await db.promise().query(sqlInsertCliente, values);

    // Insere saldo inicial na tabela 'contas'
    const clienteID = result.insertId;
    const sqlInsertSaldo = `
      INSERT INTO contas (cliente_id, saldo) 
      VALUES (?, ?)
    `;
    await db.promise().query(sqlInsertSaldo, [clienteID, 100]);

    return res.status(201).json({ message: "Cadastro realizado com sucesso." });

  } catch (error) {
    console.error("Erro ao processar solicitação:", error);
    return res.status(500).json({ error: "Erro no servidor. Por favor, tente novamente mais tarde." });
  }
});

// Rota para login de cliente
app.post('/api/v1/login', async (req, res) => {
  const { email, senha } = req.body;

  // Verificar se os campos obrigatórios foram fornecidos
  if (!email || !senha) {
    return res.status(400).send("E-mail e senha são obrigatórios.");
  }

  try {
    // Consulta ao banco para verificar o cliente pelo e-mail
    const sql = `SELECT id, nome, senha FROM clientes WHERE email = ? AND senha = ?`;
    const [rows] = await db.promise().query(sql, [email, senha]);

    if (rows.length === 0) {
      return res.status(401).send("E-mail ou senha inválidos.");
    }

    const { id, nome } = rows[0];

    // Resposta de sucesso com os dados do cliente e o token
    return res.status(200).json({ user: { id, nome, email } });
  } catch (error) {
    console.error("Erro ao realizar login:", error.message || error);
    return res.status(500).send("Erro interno no servidor.");
  }
});

//Route to get pix key OK
app.get('/api/v1/pixKey/:clientId', async (req, res) =>{
  const clientId = req.params.clientId;

  try {
    // Obten a chave pix do cliente
    const sql = `
      SELECT chave, tipo_chave FROM chave_pix WHERE cliente_id = ?;
    `;
    const resultPixKey = await new Promise((resolve, reject) => {
      db.query(sql, [clientId], (err, results) => {
        if (err) {
          return reject(err); // Rejeita a promessa em caso de erro na consulta
        }
        if (results.length < 1) {
          return reject(new Error("Nenhum resultado encontrado para o cliente especificado")); // Rejeita com mensagem específica
        }
        resolve(results); // Resolve a promessa com os resultados
      });
    });

    return res.status(200).json({ result: resultPixKey });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
})

//Route to get saldo OK
app.get('/api/v1/saldo/:clientId', async (req, res) =>{
  const clientId = req.params.clientId;

  try {
    // Obten a chave pix do cliente
    const sql = `
      SELECT id, saldo FROM contas WHERE cliente_id = ?;
    `;
    const resultPixKey = await new Promise((resolve, reject) => {
      db.query(sql, [clientId], (err, results) => {
        if (err) {
          return reject(err); // Rejeita a promessa em caso de erro na consulta
        }
        if (results.length < 1) {
          return reject(new Error("Nenhum resultado encontrado para o cliente especificado")); // Rejeita com mensagem específica
        }
        resolve(results); // Resolve a promessa com os resultados
      });
    });

    return res.status(200).json({ result: resultPixKey });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
})

//Route to get transações OK
app.get('/api/v1/transacoes/:contaId', async (req, res) =>{
  const contaId = req.params.contaId;

  // Validação dos campos obrigatórios
  if (!contaId ) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  try {
  
  // Obten os dados de transação do cliente
  const selectTransacoes = `SELECT tipo, valor, chave_pix, banco_oposto, status, transacao_id, data_hora FROM transacoes WHERE conta_id = ?`;
  const [transacoes] = await db.promise().query(selectTransacoes, [contaId]);

  if (transacoes.length === 0 ) {
    return res.status(409).json({ message: "Essa conta não possuí nenhuma transação." });
  }

    return res.status(200).json({ result: transacoes });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
})

//Rota para pesquisar a chave pix para enviar dinheiro
app.get('/api/v1/searchClientByPixKey/:pixKey', async (req, res) => {
  const { pixKey } = req.params;

  try {
    // Obter IDs do banco e cliente associado à chave Pix
    const verifyChavePix = `SELECT chave FROM chave_pix WHERE chave = ?`;
    const [existingChavePix] = await db.promise().query(verifyChavePix, [pixKey]);

    if (existingChavePix.length > 0) {
      return res.status(409).json({ message: "Opa! Não dá para transferir para sua própria conta." });
    }

    // Requisição ao Banco Central para obter dados do cliente destinatário
    const response = await axios.get(`http://localhost:5003/api/v1/cliente/${pixKey}`);
    const dataClientResponse = response.data;

    if (!dataClientResponse || Object.keys(dataClientResponse).length === 0) {
      return res.status(404).json({ message: "Chave Pix não encontrada no sistema." });
    }

    return res.status(200).json({ result: dataClientResponse });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error.message || error);

    // Tratar erros específicos
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Chave pix não encontrada. Verifique a chave informada e tente novamente." });
    }

    res.status(500).json({ message: "Erro interno no servidor. Tente novamente mais tarde." });
  }
});

//Rota para obter dados do cliente
app.get('/api/v1/client/:clientId', async (req, res) => {
  const { clientId } = req.params;

  try {
    // Consulta para obter os dados do cliente no banco
    const sql = `SELECT nome, cpf FROM clientes WHERE id = ? LIMIT 1`;
    const [dataClient] = await db.promise().query(sql, [clientId]);

    if (dataClient.length === 0) {
      return res.status(404).json({ success: false, message: "Cliente não encontrado no sistema." });
    }

    return res.status(200).json({ result: dataClient[0] });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error.message || error);
    res.status(500).json({ message: "Erro interno no servidor. Tente novamente mais tarde." });
  }
});

//Rota para criar uma nova chave Pix OK
app.post('/api/v1/pixKey', async (req, res) => {
  const { bancoId, clientId, chavePix, tipo_chave_pix } = req.body;

  // Validação dos campos obrigatórios
  if (!bancoId || !clientId || !chavePix || !tipo_chave_pix) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    // Verifica se a chave Pix já existe no banco do cliente
    const checkPixSqlContas = `SELECT * FROM chave_pix WHERE chave = ?`;
    const [existingPixContas] = await db.promise().query(checkPixSqlContas, [chavePix]);

    if (existingPixContas.length > 0) {
      return res.status(409).json({ message: "Já existe uma chave Pix cadastrada com o mesmo valor." });
    }

    // Verifica se a chave Pix é autorizada pelo Banco Central
    const bankAuthResponse = await axios.get(`http://localhost:5003/api/v1/pixKey/${chavePix}`);

    if (bankAuthResponse.status !== 200) {
      return res.status(409).json({ message: "Chave Pix não autorizada pelo Banco Central." });
    }

    // Insere os dados na tabela 'contas'
    const sqlInsertContas = `
      INSERT INTO chave_pix (cliente_id, chave, tipo_chave) 
      VALUES (?, ?, ?)
    `;
    await db.promise().query(sqlInsertContas, [clientId, chavePix, tipo_chave_pix]);

    // Envia os dados para o Banco Central para registro da chave Pix
    const bankRegisterResponse = await axios.post('http://localhost:5003/api/v1/pixKey', {
      bancoId,
      clientId,
      chavePix,
      tipo_chave_pix,
    });

    if (bankRegisterResponse.status === 201) {
      return res.status(201).json({ message: "Chave Pix cadastrada com sucesso" });
    }

    // Caso algo inesperado aconteça
    res.status(500).json({ message: "Erro ao registrar chave Pix no Banco Central." });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

app.put('/api/v1/transferenciaPix', async (req, res) =>{
  const { clientId, valorTransacao, chavePix } = req.body;

  // Validação dos campos obrigatórios
  if (!clientId || !valorTransacao || !chavePix) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try{
    // Obten o saldo da conta do cliente
    const selectSaldo = `SELECT id, saldo FROM contas WHERE cliente_id = ?`;
    const [saldoTotal] = await db.promise().query(selectSaldo, [clientId]);

    if (saldoTotal.length === 0 ) {
      return res.status(409).json({ message: "Não há saldo em conta." });
    }

    const saldoAtual = Number (saldoTotal[0].saldo)
    // Limpar o valor da transferência para garantir o formato correto
    const valorNumerico = valorTransacao.replace(/[^\d,]/g, '').replace(',', '.');
    const valorTransacaoFormatado = Number(valorNumerico);

    if(valorTransacaoFormatado > saldoAtual){
      return res.status(409).json({ message: "Saldo em conta é menor que o valor solicitado." });
    }

    //Objeto com os valores da transação
    const values ={
      valor: valorTransacaoFormatado,
      chavePix,
      contaId: saldoTotal[0].id
    }

    // Verifica se a chave Pix é autorizada pelo Banco Central
    const responseCentralBank = await axios.put(`http://localhost:5003/api/v1/transferenciaPix`, values);

    if(responseCentralBank.data.Sucess === true){
      const saldoAtualizado = saldoAtual - valorTransacaoFormatado;
      
      // Atualiza o saldo da conta do cliente final
      const updateSaldo = `UPDATE contas SET saldo = ? WHERE cliente_id = ?`;
      const [resultSql] = await db.promise().query(updateSaldo, [saldoAtualizado, clientId]);

      if(resultSql.affectedRows === 1){
        // Salva a transação no banco de dados
        const sqlInsertTransaction = `
        INSERT INTO transacoes (conta_id, tipo, valor, chave_pix, banco_oposto, status, transacao_id, data_hora)
        VALUES (?, 'enviada', ?, ?, 'Banco Two', 'concluída', ?, ?)`;

        await db.promise().query(sqlInsertTransaction, [
          saldoTotal[0].id,
          valorTransacaoFormatado,
          chavePix,
          responseCentralBank.data.valuesTransation.transactionId,
          responseCentralBank.data.valuesTransation.timestamp
        ]);

        // Resposta final
        return res.status(201).json({ Sucess: true });
      }
    }

  }catch (error){
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
})

//Rota para receber transferência de pix
app.put('/api/v1/receiveTransfer', async (req, res) =>{
  const { valor, cliente_recebedor_id, chavePix, transactionId, timestamp } = req.body;

  // Validação dos campos obrigatórios
  if (!valor || !cliente_recebedor_id || !chavePix || !transactionId || !timestamp) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    // Obten o saldo da conta do cliente
    const selectSaldo = `SELECT id, saldo FROM contas WHERE cliente_id = ?`;
    const [saldoTotal] = await db.promise().query(selectSaldo, [cliente_recebedor_id]);

    const saldoAtual = Number (saldoTotal[0].saldo)
    const saldoAtualizado = saldoAtual + valor
    
    // Atualiza o saldo da conta do cliente final
    const updateSaldo = `UPDATE contas SET saldo = ? WHERE cliente_id = ?`;
    const [resultSql] = await db.promise().query(updateSaldo, [saldoAtualizado, cliente_recebedor_id]);

    if(resultSql.affectedRows === 1){
      // Salva a transação no banco de dados local (exemplo)
      const sqlInsertTransaction = `
      INSERT INTO transacoes (conta_id, tipo, valor, chave_pix, banco_oposto, status, transacao_id, data_hora)
      VALUES (?, 'recebida', ?, ?, 'Banco One', 'concluída', ?, ?)`;

      await db.promise().query(sqlInsertTransaction, [
        saldoTotal[0].id,
        valor,
        chavePix,
        transactionId,
        timestamp
      ]);

      // Resposta final
      return res.status(201).json({ Sucess: true, transactionId });
    }
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
})

//Rota para excluir chave Pix OK
app.delete('/api/v1/pixKey', async (req, res) => {
  const { chavePix } = req.query;

  // Validação do campo obrigatório
  if (!chavePix) {
    return res.status(400).json({ message: "O campo 'chavePix' é obrigatório." });
  }

  try {
    // Deleta a chave Pix da tabela 'contas'
    const deletePixSqlContas = `
      DELETE FROM chave_pix WHERE chave = ?
    `;
    await db.promise().query(deletePixSqlContas, [chavePix]);

    // Requisição para apagar a chave pix do Banco Central
    const Response = await axios.delete(`http://localhost:5003/api/v1/pixKey?chavePix=${chavePix}`);

    if (Response.status !== 201) {
      return res.status(409).json({ message: "Não foi possível apagar a chave pix do Banco Central." });
    }

    // Resposta final
    res.status(200).json({ message: "Chave Pix deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    res.status(500).json({ message: "Erro ao tentar apagar chave pix." });
  }
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Banco 1 rodando em http://localhost:${PORT}`);
});