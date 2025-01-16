const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5800;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use("/keys", require("./routes/keys"));
app.use("/banks", require("./routes/banks")); // Aqui importa o `banks.js`

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`API Banco Central rodando na porta ${PORT}`);
});
