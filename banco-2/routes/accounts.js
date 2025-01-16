const express = require("express");
const router = express.Router();
const {
  getAccounts,
  createAccount,
} = require("../controllers/accountsController");

console.log("Carregando rotas de contas"); // Log para depuração

// Rota para listar todas as contas
router.get(
  "/",
  (req, res, next) => {
    console.log("Rota /accounts foi acessada"); // Log para depuração
    next();
  },
  getAccounts
);

// Rota para criar uma nova conta
router.post("/", createAccount);

module.exports = router;
