const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");
const multer = require("multer");

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

function uploadMiddleware(req, res, next) {
  upload.single("imagem")(req, res, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    next();
  });
}

router.post("/", uploadMiddleware, async (req, res) => {
  try {
    const {
      nome,
      descricao,
      categoria_id,
      departamento_id,
      marca_id,
      preco,
      codigo,
    } = req.body;

    if (!nome || !preco || !codigo || !categoria_id || !departamento_id || !marca_id) {
      return res.status(400).json({
        erro: "Nome, preço, código, categoria, departamento e marca são obrigatórios",
      });
    }

    const precoNumber = parseFloat(preco);
    if (isNaN(precoNumber)) {
      return res.status(400).json({ erro: "Preço inválido" });
    }

    const categoriaCheck = await pool.query(
      "SELECT id FROM categorias WHERE id = $1",
      [categoria_id]
    );

    if (categoriaCheck.rows.length === 0) {
      return res.status(400).json({ erro: "Categoria não encontrada" });
    }

    const departamentoCheck = await pool.query(
      "SELECT id FROM departamentos WHERE id = $1",
      [departamento_id]
    );

    if (departamentoCheck.rows.length === 0) {
      return res.status(400).json({ erro: "Departamento não encontrado" });
    }

    const marcaCheck = await pool.query(
      "SELECT id FROM marca WHERE id = $1",
      [marca_id]
    );

    if (marcaCheck.rows.length === 0) {
      return res.status(400).json({ erro: "Marca não encontrada" });
    }

    const imagem = req.file ? req.file.buffer : null;
    const imagem_tipo = req.file ? req.file.mimetype : null;

    const query = `
      INSERT INTO produtos (
        nome,
        descricao,
        categoria_id,
        departamento_id,
        marca_id,
        preco,
        codigo,
        imagem,
        imagem_tipo
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;

    const values = [
      nome,
      descricao,
      categoria_id,
      departamento_id,
      marca_id,
      precoNumber,
      codigo,
      imagem,
      imagem_tipo,
    ];

    const result = await pool.query(query, values);

    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return res.status(500).json({ erro: "Erro ao cadastrar produto" });
  }
});

module.exports = router;