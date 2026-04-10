const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");

// =====================
// CREATE
// =====================
router.post("/", async (req, res) => {
  const { nome, status, departamento_id } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "O nome da categoria é obrigatório" });
  }

  if (!departamento_id) {
    return res.status(400).json({ error: "O departamento é obrigatório" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO categorias (nome, status, departamento_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nome, status ?? true, departamento_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "23503") {
      return res.status(400).json({ error: "Departamento inválido" });
    }

    if (err.code === "23505") {
      return res.status(400).json({ error: "Categoria já existe" });
    }

    res.status(500).json({ error: "Erro ao cadastrar categoria" });
  }
});

// =====================
// GET ALL (COM JOIN)
// =====================
router.get("/", async (req, res) => {
  const { busca, status } = req.query;

  try {
    let query = `
      SELECT 
        c.id,
        c.nome,
        c.status,
        c.departamento_id,
        d.nome AS departamento_nome
      FROM categorias c
      LEFT JOIN departamentos d ON d.id = c.departamento_id
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    if (busca) {
      query += ` AND c.nome ILIKE $${index}`;
      values.push(`%${busca}%`);
      index++;
    }

    if (status !== undefined) {
      query += ` AND c.status = $${index}`;
      values.push(status === "true");
      index++;
    }

    query += " ORDER BY c.nome";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

// =====================
// GET ATIVOS (IMPORTANTE)
// =====================
router.get("/ativos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.nome,
        c.departamento_id,
        d.nome AS departamento_nome
      FROM categorias c
      LEFT JOIN departamentos d ON d.id = c.departamento_id
      WHERE c.status = true
      ORDER BY c.nome
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar categorias ativas" });
  }
});

// =====================
// UPDATE
// =====================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, status, departamento_id } = req.body;

  if (!nome && status === undefined && !departamento_id) {
    return res.status(400).json({
      error: "Informe nome, status ou departamento",
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

    if (departamento_id !== undefined) {
      fields.push(`departamento_id = $${i++}`);
      values.push(departamento_id);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE categorias SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "23503") {
      return res.status(400).json({ error: "Departamento inválido" });
    }

    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
});

module.exports = router;