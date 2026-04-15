const express = require("express");
const router = express.Router();
const pool = require("../../dataBase/db");

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.preco,
        p.codigo,
        p.imagem,
        p.imagem_tipo
      FROM produtos p
      WHERE p.categoria_id = $1`,
      [id]
    );

    const produtos = result.rows.map((prod) => ({
      ...prod,
      imagem: prod.imagem
        ? `data:${prod.imagem_tipo};base64,${prod.imagem.toString("base64")}`
        : null,
    }));

    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

module.exports = router;