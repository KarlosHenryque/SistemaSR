const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");
const multer = require("multer");

// multer usando memória
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Apenas PNG ou JPEG"));
    }
  },
});

// middleware para tratar erro do multer
function uploadMiddleware(req, res, next) {
  upload.single("imagem")(req, res, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    next();
  });
}

// rota para cadastrar produto
router.post("/", uploadMiddleware, async (req, res) => {
  try {
    const { nome, descricao, categoria_id, marca, preco, codigo } = req.body;

    if (!nome || !preco || !codigo || !categoria_id) {
      return res.status(400).json({
        erro: "Nome, preço, código e categoria_id são obrigatórios",
      });
    }

    const precoNumber = parseFloat(preco);
    if (isNaN(precoNumber)) {
      return res.status(400).json({
        erro: "Preço inválido",
      });
    }

    const categoriaCheck = await pool.query(
      "SELECT id FROM categorias WHERE id = $1",
      [categoria_id]
    );
    if (categoriaCheck.rows.length === 0) {
      return res.status(400).json({ erro: "Categoria não encontrada" });
    }

    const imagem = req.file ? req.file.buffer : null;
    const imagem_tipo = req.file ? req.file.mimetype : null;

    const query = `
      INSERT INTO produtos
      (nome, descricao, categoria_id, marca, preco, codigo, imagem, imagem_tipo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      nome,
      descricao,
      categoria_id,
      marca,
      precoNumber,
      codigo,
      imagem,
      imagem_tipo,
    ];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    res.status(500).json({ erro: "Erro ao cadastrar produto" });
  }
});

module.exports = router;