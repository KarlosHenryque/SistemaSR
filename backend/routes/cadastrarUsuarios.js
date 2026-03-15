const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");

const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {

  const { nome, email, senha, cpf_cnpj, tipo_usuario } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      error: "nome, email e senha são obrigatórios"
    });
  }

  if (senha.length < 6) {
    return res.status(400).json({
      error: "A senha deve ter pelo menos 6 caracteres"
    });
  }

  try {
    const emailExiste = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (emailExiste.rows.length > 0) {
      return res.status(409).json({
        error: "Email já cadastrado"
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO usuarios 
      (nome, email, senha, cpf_cnpj, tipo_usuario)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, email, cpf_cnpj, tipo_usuario`,
      [nome, email, senhaHash, cpf_cnpj || null, tipo_usuario || "usuario"]
    );

    res.status(201).json({
      usuario: result.rows[0]
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Erro ao criar usuário"
    });
  }

});

module.exports = router;