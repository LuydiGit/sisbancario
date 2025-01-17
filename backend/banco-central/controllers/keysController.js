const db = require("../models/db");

// Obter todas as chaves PIX
exports.getKeys = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Chaves_PIX");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao obter chaves PIX:", error);
    res.status(500).json({ error: "Erro ao obter chaves PIX" });
  }
};

// Adicionar uma nova chave PIX
exports.addKey = async (req, res) => {
  const { banco_id, cliente_id, chave, tipo } = req.body;

  if (!banco_id || !cliente_id || !chave || !tipo) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    await db.query(
      "INSERT INTO Chaves_PIX (banco_id, cliente_id, chave, tipo) VALUES (?, ?, ?, ?)",
      [banco_id, cliente_id, chave, tipo]
    );
    res.status(201).json({ message: "Chave PIX adicionada com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar chave PIX:", error);
    res.status(500).json({ error: "Erro ao adicionar chave PIX" });
  }
};

// Validar uma chave PIX
exports.validateKey = async (req, res) => {
  const { chave } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM Chaves_PIX WHERE chave = ?", [
      chave,
    ]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Chave PIX não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao validar chave PIX:", error);
    res.status(500).json({ error: "Erro ao validar chave PIX" });
  }
};
