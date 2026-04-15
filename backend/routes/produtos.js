const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");

router.get("/", async (req, res) => {
  const { busca, status } = req.query;

  try {
    let query = `
      SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.preco,
        p.codigo,
        p.imagem,
        p.imagem_tipo,
        p.status,
        p.marca_id,
        p.categoria_id,
        p.departamento_id,
        c.nome AS categoria,
        d.nome AS departamento
      FROM produtos p
      JOIN categorias c ON p.categoria_id = c.id
      JOIN departamentos d ON p.departamento_id = d.id
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    if (busca && busca !== "%") {
      query += `
        AND (
          p.nome ILIKE $${index}
          OR c.nome ILIKE $${index}
          OR d.nome ILIKE $${index}
        )
      `;
      values.push(`%${busca}%`);
      index++;
    }

    if (status !== undefined) {
      query += ` AND p.status = $${index}`;
      values.push(status === "true");
      index++;
    }

    query += " ORDER BY p.nome";

    const result = await pool.query(query, values);

    const produtos = result.rows.map((prod) => ({
      ...prod,
      imagem: prod.imagem
        ? `data:${prod.imagem_tipo};base64,${prod.imagem.toString("base64")}`
        : null
    }));

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    descricao,
    preco,
    codigo,
    status,
    categoria_id,
    departamento_id,
    marca_id
  } = req.body;

  try {
    const statusBoolean = status === true || status === "true";

    const query = `
      UPDATE produtos
      SET 
        nome = $1,
        descricao = $2,
        preco = $3,
        codigo = $4,
        status = $5,
        categoria_id = $6,
        departamento_id = $7,
        marca_id = $8
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      nome,
      descricao,
      preco,
      codigo,
      statusBoolean,
      categoria_id,
      departamento_id,
      marca_id,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

router.patch("/status/:id", async (req, res) => {
  const { id } = req.params;
  let { status } = req.body;

  try {
    status = status === true || status === "true";

    const result = await pool.query(
      "UPDATE produtos SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar status do produto" });
  }
});

module.exports = router;