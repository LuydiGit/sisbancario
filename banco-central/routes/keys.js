const express = require("express");
const router = express.Router();
const {
  getKeys,
  addKey,
  validateKey,
} = require("../controllers/keysController");

//Verifica a função usada pelo controlador
console.log("Funções do controlador:", { getKeys, addKey, validateKey });

router.get("/", getKeys);
router.post("/", addKey);
router.get("/:chave", validateKey);

module.exports = router;
