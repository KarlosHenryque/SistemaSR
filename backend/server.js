const express = require("express");
const cors = require("cors");

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Importar rotas
const login = require("./routes/login");
const usuarios = require("./routes/usuarios");
const produtos = require("./routes/produtos");
const cadastrarUsuarios = require("./routes/cadastrarUsuarios");
const cadastrarProdutos = require("./routes/cadastrarProdutos");
const cadastrarCategoriaProduto = require("./routes/cadastrarCategoriaProduto");
const cadastrarDepartamentoProdutos = require("./routes/cadastrarDepartamentoProdutos");

// Admin
app.use("/login", login);
app.use("/usuarios", usuarios);
app.use("/cadastrarUsuarios", cadastrarUsuarios);
app.use("/produtos", produtos);
app.use("/cadastrarProdutos", cadastrarProdutos);
app.use("/categorias", cadastrarCategoriaProduto);
app.use("/departamentos", cadastrarDepartamentoProdutos);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});