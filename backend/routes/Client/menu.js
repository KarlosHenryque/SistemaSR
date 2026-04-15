const express = require("express");
const router = express.Router();
const pool = require("../../dataBase/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.id AS departamento_id,
        d.nome AS departamento_nome,
        c.id AS categoria_id,
        c.nome AS categoria_nome
      FROM departamentos d
      LEFT JOIN categorias c 
        ON c.departamento_id = d.id AND c.status = true
      WHERE d.status = true
      ORDER BY d.nome, c.nome
    `);

    const menuMap = new Map();

    result.rows.forEach((row) => {
      if (!menuMap.has(row.departamento_id)) {
        menuMap.set(row.departamento_id, {
          id: row.departamento_id,
          nome: row.departamento_nome,
          categorias: [],
        });
      }

      if (row.categoria_id) {
        menuMap.get(row.departamento_id).categorias.push({
          id: row.categoria_id,
          nome: row.categoria_nome,
        });
      }
    });

    res.json(Array.from(menuMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao montar menu" });
  }
});

module.exports = router;