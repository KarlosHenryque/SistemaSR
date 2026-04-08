const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");

// Listar produtos com busca opcional
router.get("/", async (req, res) => {
  const { busca } = req.query;

  try {
    let query = `
      SELECT p.id, p.nome, p.descricao, p.marca, p.preco, p.codigo,
             p.imagem, p.imagem_tipo,
             p.status,
             c.nome AS categoria
      FROM produtos p
      JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;

    const values = [];
    let index = 1;

    if (busca && busca !== "%") {
      query += `
        AND (p.nome ILIKE $${index} OR c.nome ILIKE $${index} OR p.marca ILIKE $${index})
      `;
      values.push(`%${busca}%`);
      index++;
    }

    query += " ORDER BY p.nome";

    const result = await pool.query(query, values);

    const produtos = result.rows.map(prod => ({
      ...prod,
      imagem: prod.imagem
        ? `data:${prod.imagem_tipo};base64,${prod.imagem.toString("base64")}`
        : null
    }));

    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Editar produto (sem alterar categoria)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, marca, preco, codigo, status } = req.body;

  try {
    const statusBoolean = status === true || status === "true";

    const query = `
      UPDATE produtos
      SET nome = $1,
          descricao = $2,
          marca = $3,
          preco = $4,
          codigo = $5,
          status = $6
      WHERE id = $7
      RETURNING *
    `;

    const values = [nome, descricao, marca, preco, codigo, statusBoolean, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// Ativar/desativar produto
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
    console.error("Erro ao atualizar status do produto:", error);
    res.status(500).json({ error: "Erro ao atualizar status do produto" });
  }
});

// Buscar imagem separada
router.get("/imagem/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT imagem, imagem_tipo FROM produtos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const { imagem, imagem_tipo } = result.rows[0];

    if (!imagem) {
      return res.status(404).json({ error: "Produto não possui imagem" });
    }

    res.setHeader("Content-Type", imagem_tipo);
    res.send(imagem);
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    res.status(500).json({ error: "Erro ao buscar imagem" });
  }
});

module.exports = router;