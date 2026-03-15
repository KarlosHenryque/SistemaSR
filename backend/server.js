const express = require("express");
const cors = require("cors");

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Importar rotas
const login = require("./routes/login");
const cadastrarUsuarios = require("./routes/cadastrarUsuarios");

// Utilizar rotas
app.use("/login", login);
app.use("/cadastrarUsuarios", cadastrarUsuarios);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});