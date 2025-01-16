const db = require("../models/db");

// Listar todas as contas
exports.getAccounts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Contas");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao obter contas:", error);
    res.status(500).json({ error: "Erro ao obter contas" });
  }
};

// Criar uma nova conta
exports.createAccount = async (req, res) => {
  const { cliente_id, saldo } = req.body;

  if (!cliente_id || saldo == null) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    await db.query("INSERT INTO Contas (cliente_id, saldo) VALUES (?, ?)", [
      cliente_id,
      saldo,
    ]);
    res.status(201).json({ message: "Conta criada com sucesso" });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
};
