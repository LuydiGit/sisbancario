const express = require("express");
const router = express.Router();
const { 
    getBanks, 
    addBank 
} = require("../controllers/banksController");

console.log("Funções do controlador de bancos:", { getBanks, addBank });

router.get("/", getBanks);
router.post("/", addBank);

module.exports = router;
