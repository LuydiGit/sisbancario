// Importação de módulos
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.get('/', (req, res) => {
  res.status(200).send('API funcionando!');
});



// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Banco 1 rodando na porta ${PORT}`);
});