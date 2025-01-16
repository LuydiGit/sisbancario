const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Registro das rotas
app.use("/accounts", require("./routes/accounts")); // Rota de contas
app.use("/transactions", require("./routes/transactions")); // Rota de transações

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Banco 1 rodando na porta ${PORT}`);
});
