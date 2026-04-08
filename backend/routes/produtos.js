const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");

// Listar produtos com busca opcional
router.get("/", async (req, res) => {
  const { busca } = req.query;

  try {
    let query = `
      SELECT id, nome, descricao, categoria, marca, preco, codigo, imagem, imagem_tipo
      FROM produtos
      WHERE 1=1
    `;

    let values = [];
    let index = 1;

    if (busca && busca !== "%") {
      query += `
        AND (nome ILIKE $${index} OR categoria ILIKE $${index} OR marca ILIKE $${index})
      `;
      values.push(`%${busca}%`);
      index++;
    }

    query += " ORDER BY nome";

    const result = await pool.query(query, values);

    // Transformar imagem em base64 para enviar no JSON
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

// Editar produto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, categoria, marca, preco, codigo } = req.body;

  try {
    const query = `
      UPDATE produtos
      SET nome = $1,
          descricao = $2,
          categoria = $3,
          marca = $4,
          preco = $5,
          codigo = $6
      WHERE id = $7
      RETURNING *
    `;

    const values = [nome, descricao, categoria, marca, preco, codigo, id];
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

// Rota para buscar imagem separada (para frontend exibir diretamente)
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