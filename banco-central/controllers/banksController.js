const db = require("../models/db");

// Obter todos os bancos
exports.getBanks = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Bancos");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao obter bancos:", error);
    res.status(500).json({ error: "Erro ao obter bancos" });
  }
};

// Adicionar um novo banco
exports.addBank = async (req, res) => {
  const { nome, url_api, token } = req.body;

  if (!nome || !url_api || !token) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    await db.query(
      "INSERT INTO Bancos (nome, url_api, token) VALUES (?, ?, ?)",
      [nome, url_api, token]
    );
    res.status(201).json({ message: "Banco adicionado com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar banco:", error);
    res.status(500).json({ error: "Erro ao adicionar banco" });
  }
};
