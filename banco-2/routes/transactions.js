const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
} = require("../controllers/transactionsController");

console.log("Funções do controlador:", { getTransactions, createTransaction});

router.get("/", getTransactions);
router.post("/", createTransaction);

module.exports = router;
  