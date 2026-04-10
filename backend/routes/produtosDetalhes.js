const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.marca,
        p.preco,
        p.codigo,
        p.imagem,
        p.imagem_tipo,
        p.status,
        c.nome AS categoria,
        d.nome AS departamento
      FROM produtos p
      JOIN categorias c ON p.categoria_id = c.id
      JOIN departamentos d ON p.departamento_id = d.id
      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const prod = result.rows[0];

    const produto = {
      ...prod,
      imagem: prod.imagem
        ? `data:${prod.imagem_tipo};base64,${prod.imagem.toString("base64")}`
        : null
    };

    res.json(produto);

  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

module.exports = router;