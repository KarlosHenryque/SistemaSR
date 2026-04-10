import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import AdminHome from "../pages/AdminHome";

// Usuários
import AdminCadastroUsuarios from "../pages/AdminCadastroUsuario";
import AdminListarUsuarios from "../pages/AdminListarUsuarios";

// Produtos
import AdminCadastroProdutos from "../pages/AdminCadastroProdutos";
import AdminListarProdutos from "../pages/AdminListarProdutos";
import AdminCadastrarCategoria from "../pages/AdminCadastrarCategorias";

// Usuário
import UsuarioHome from "../pages/usuario/UsuarioHome";

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/AdminListarUsuarios" element={<AdminListarUsuarios />} />
        <Route path="/AdminCadastroUsuarios" element={<AdminCadastroUsuarios />} />       
        <Route path="/AdminCadastroProdutos" element={<AdminCadastroProdutos />} />       
        <Route path="/AdminListarProdutos" element={<AdminListarProdutos />} />    
        <Route path="/AdminCadastrarCategoria" element={<AdminCadastrarCategoria />} />   

        // Usuário
        <Route path="/UsuarioHome" element={<UsuarioHome />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;