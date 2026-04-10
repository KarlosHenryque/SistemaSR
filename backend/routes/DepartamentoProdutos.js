const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");

router.post("/", async (req, res) => {
  const { nome, status } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "O nome do departamento é obrigatório" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO departamentos (nome, status) VALUES ($1, $2) RETURNING *",
      [nome, status !== undefined ? status : true] 
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ error: "Departamento já existe" });
    }

    res.status(500).json({ error: "Erro ao cadastrar departamento" });
  }
});

router.get("/", async (req, res) => {
  const { busca, status } = req.query;

  try {
    let query = `
      SELECT *
      FROM departamentos
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    if (busca && busca !== "%") {
      query += ` AND nome ILIKE $${index}`;
      values.push(`%${busca}%`);
      index++;
    }

    if (status !== undefined) {
      query += ` AND status = $${index}`;
      values.push(status === "true");
      index++;
    }

    query += " ORDER BY nome";

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar departamentos" });
  }
});

router.get("/ativos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM departamentos WHERE status = true ORDER BY nome"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar departamentos ativos" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, status } = req.body;

  if (!nome && status === undefined) {
    return res.status(400).json({
      error: "É necessário informar nome ou status",
    });
  }

  try {
    const fields = [];
    const values = [];
    let index = 1;

    if (nome !== undefined) {
      fields.push(`nome = $${index++}`);
      values.push(nome);
    }

    if (status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(status);
    }

    values.push(id);

    const query = `
      UPDATE departamentos
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Departamento não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ error: "Departamento já existe" });
    }

    res.status(500).json({ error: "Erro ao atualizar departamento" });
  }
});

module.exports = router;