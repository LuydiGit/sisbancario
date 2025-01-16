const db = require("../models/db");

// Listar todas as transações
exports.getTransactions = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM transacoes");
    res.json(rows);
    console.error();
  } catch (error) {
    console.error("Erro ao obter transações:", error);
    res.status(500).json({ error: "Erro ao obter transações" });
  }
};

// Criar uma nova transação
exports.createTransaction = async (req, res) => {
  const { conta_origem, conta_destino, valor } = req.body;

  if (!conta_origem || !conta_destino || !valor) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    // Atualizar saldo da conta de origem
    await db.query("UPDATE Contas SET saldo = saldo - ? WHERE id = ?", [
      valor,
      conta_origem,
    ]);

    // Atualizar saldo da conta de destino
    await db.query("UPDATE Contas SET saldo = saldo + ? WHERE id = ?", [
      valor,
      conta_destino,
    ]);

    // Inserir a transação
    await db.query(
      "INSERT INTO Transacoes (conta_origem, conta_destino, valor) VALUES (?, ?, ?)",
      [conta_origem, conta_destino, valor]
    );

    res.status(201).json({ message: "Transação realizada com sucesso" });
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    res.status(500).json({ error: "Erro ao criar transação" });
  }
};
