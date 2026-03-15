const express = require("express");
const router = express.Router();
const pool = require("../dataBase/db");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {

  const { email, senha } = req.body;

  try {

    const resultado = await pool.query(
      "SELECT id, email, senha, tipo_usuario FROM usuarios WHERE email = $1",
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensagem: "Usuário não encontrado"
      });
    }

    const usuario = resultado.rows[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Senha incorreta"
      });
    }

    delete usuario.senha;

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario
    });

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: "Erro no servidor"
    });
  }

});

module.exports = router;