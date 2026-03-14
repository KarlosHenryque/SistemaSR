const express = require("express");
const router = express.Router();

let usuario = {}; 

// POST para receber email e senha
router.post("/", (req, res) => {

    const { email, senha } = req.body;

    usuario = { email, senha };

    console.log("Email:", email);
    console.log("Senha:", senha);

    res.json({
        mensagem: "Dados recebidos",
        usuario
    });
});

// GET para visualizar os dados enviados
router.get("/", (req, res) => {
    res.json({
        usuario
    });
});

module.exports = router;