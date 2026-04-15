const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");


router.post("/", async (req, res) => {
  const { nome, status } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "O nome da marca é obrigatório" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO marca (nome, status) VALUES ($1, $2) RETURNING *",
      [nome, status ?? true]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar marca" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { status } = req.query;

    let query = "SELECT * FROM marca WHERE 1=1";
    const values = [];

    if (status !== undefined) {
      values.push(status === "true");
      query += ` AND status = $${values.length}`;
    }

    query += " ORDER BY nome";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar marcas" });
  }
});

router.get("/ativos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM marca WHERE status = true ORDER BY nome"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar ativos" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, status } = req.body;

  if (nome === undefined && status === undefined) {
    return res.status(400).json({
      error: "Informe nome ou status",
    });
  }

  try {
    const fields = [];
    const values = [];
    let i = 1;

    if (nome !== undefined) {
      fields.push(`nome = $${i++}`);
      values.push(nome);
    }

    if (status !== undefined) {
      fields.push(`status = $${i++}`);
      values.push(status);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE marca SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar marca" });
  }
});

module.exports = router;