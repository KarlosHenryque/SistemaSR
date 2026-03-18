import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import AdminHome from "../pages/AdminHome";
import AdminCadastroUsuarios from "../pages/AdminCadastroUsuario";
import AdminListarUsuarios from "../pages/AdminListarUsuarios";

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/AdminListarUsuarios" element={<AdminListarUsuarios />} />
        <Route path="/AdminCadastroUsuarios" element={<AdminCadastroUsuarios />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;