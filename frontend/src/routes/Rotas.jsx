import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import AdminHome from "../pages/AdminHome";

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AdminHome" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;