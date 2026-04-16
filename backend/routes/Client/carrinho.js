const express = require("express");
const router = express.Router();
const pool = require("../../dataBase/db");

router.get("/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        ci.id,
        p.id AS produto_id,
        p.nome,
        p.preco,
        p.imagem,
        p.imagem_tipo,
        ci.quantidade
      FROM carrinho_itens ci
      INNER JOIN carrinho c ON c.id = ci.carrinho_id
      INNER JOIN produtos p ON p.id = ci.produto_id
      WHERE c.usuario_id = $1
      `,
      [usuario_id]
    );

    const itens = result.rows.map((item) => {
      return {
        id: item.id,
        produto_id: item.produto_id,
        nome: item.nome,
        preco: item.preco,
        quantidade: item.quantidade,

        imagem: item.imagem
          ? `data:${item.imagem_tipo};base64,${item.imagem.toString("base64")}`
          : null,
      };
    });

    return res.json({ itens });

  } catch (error) {
    console.error("Erro carrinho:", error);

    return res.status(500).json({
      error: "Erro ao buscar carrinho"
    });
  }
});
router.post("/adicionar", async (req, res) => {
  const client = await pool.connect();

  try {
    let { usuario_id, produto_id, quantidade } = req.body;

    if (!usuario_id || !produto_id) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    quantidade = parseInt(quantidade) || 1;

    await client.query("BEGIN");

    let carrinho = await client.query(
      "SELECT id FROM carrinho WHERE usuario_id = $1",
      [usuario_id]
    );

    let carrinho_id;

    if (carrinho.rows.length === 0) {
      const novo = await client.query(
        `INSERT INTO carrinho (usuario_id, criado_em)
         VALUES ($1, NOW())
         RETURNING id`,
        [usuario_id]
      );

      carrinho_id = novo.rows[0].id;
    } else {
      carrinho_id = carrinho.rows[0].id;
    }

    const item = await client.query(
      `SELECT id, quantidade 
       FROM carrinho_itens 
       WHERE carrinho_id = $1 AND produto_id = $2`,
      [carrinho_id, produto_id]
    );

    if (item.rows.length > 0) {
      await client.query(
        `UPDATE carrinho_itens 
         SET quantidade = quantidade + $1
         WHERE id = $2`,
        [quantidade, item.rows[0].id]
      );
    } else {
      await client.query(
        `INSERT INTO carrinho_itens (carrinho_id, produto_id, quantidade)
         VALUES ($1, $2, $3)`,
        [carrinho_id, produto_id, quantidade]
      );
    }

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Produto adicionado ao carrinho!",
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro carrinho:", error);

    return res.status(500).json({
      success: false,
      error: "Erro ao adicionar ao carrinho",
    });

  } finally {
    client.release();
  }
});

router.delete("/remover/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM carrinho_itens WHERE id = $1",
      [id]
    );

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao remover item" });
  }
});

module.exports = router;