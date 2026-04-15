import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import AdminHome from "../pages/admin/Home";

// Admin
import AdminCadastroUsuarios from "../pages/admin/CadastroUsuario";
import AdminListarUsuarios from "../pages/admin/ListarUsuarios";
import AdminCadastroProdutos from "../pages/admin/CadastroProdutos";
import AdminListarProdutos from "../pages/admin/ListarProdutos";
import AdminCadastrarCategoria from "../pages/admin/CadastrarCategorias";
import AdminCadastrarDepartamento from "../pages/admin/CadastrarDepartamento";
import AdminCadastrarMarca from "../pages/admin/CadastrarMarca";

// Usuário
import UsuarioHome from "../pages/usuario/Home";
import CategoriaProdutos from "../pages/usuario/CategoriaProdutos";

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        {/* ADMIN */}
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/AdminListarUsuarios" element={<AdminListarUsuarios />} />
        <Route path="/AdminCadastroUsuarios" element={<AdminCadastroUsuarios />} />
        <Route path="/AdminCadastroProdutos" element={<AdminCadastroProdutos />} />
        <Route path="/AdminListarProdutos" element={<AdminListarProdutos />} />
        <Route path="/AdminCadastrarCategoria" element={<AdminCadastrarCategoria />} />
        <Route path="/AdminCadastrarDepartamento" element={<AdminCadastrarDepartamento />} />
        <Route path="/AdminCadastrarMarca" element={<AdminCadastrarMarca />} />

        {/* USUÁRIO */}
        <Route path="/UsuarioHome" element={<UsuarioHome />} />
        <Route path="/categoria/:id" element={<CategoriaProdutos />} />


      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;