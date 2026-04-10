import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import AdminHome from "../pages/admin/AdminHome";

// Admin
import AdminCadastroUsuarios from "../pages/admin/AdminCadastroUsuario";
import AdminListarUsuarios from "../pages/admin/AdminListarUsuarios";
import AdminCadastroProdutos from "../pages/admin/AdminCadastroProdutos";
import AdminListarProdutos from "../pages/admin/AdminListarProdutos";
import AdminCadastrarCategoria from "../pages/admin/AdminCadastrarCategorias";
import AdminCadastrarDepartamento from "../pages/admin/AdminCadastrarDepartamento";

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
        <Route path="/AdminCadastrarDepartamento" element={<AdminCadastrarDepartamento />} />   



        // Usuário
        <Route path="/UsuarioHome" element={<UsuarioHome />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;