const express = require("express");
const cors = require("cors");

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Importar rotas
const login = require("./routes/login");
const usuarios = require("./routes/usuarios");
const cadastrarUsuarios = require("./routes/cadastrarUsuarios");
const cadastrarProdutos = require("./routes/cadastrarProdutos");
const produtos = require("./routes/produtos");

// Usuários
app.use("/login", login);
app.use("/usuarios", usuarios);
app.use("/cadastrarUsuarios", cadastrarUsuarios);

// Produtos
app.use("/produtos", produtos);
app.use("/cadastrarProdutos", cadastrarProdutos);


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});