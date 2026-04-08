import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; 
import "./css/LayoutAdmin.css";

function LayoutAdmin({ children }) {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(null);
  const menuRef = useRef();

  function toggleMenu(menu) {
    setMenuAberto(menuAberto === menu ? null : menu);
  }

  function handleLogout() {
    localStorage.removeItem("token"); 
    navigate("/"); 
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="header-admin">
        <nav className="menu-admin" ref={menuRef}>
          <span 
            onClick={() => navigate("/AdminHome")}
            className="menu-title-admin"
          >
            Home
          </span>

          {/* USUÁRIOS */}
          <div className="menu-item-admin">
            <span 
              className="menu-title-admin"
              onClick={() => toggleMenu("usuarios")}
            >
              Usuários
            </span>
            {menuAberto === "usuarios" && (
              <ul className="submenu-admin">
                <li onClick={() => navigate("/AdminListarUsuarios")}>
                  Listar usuários
                </li>
                <li onClick={() => navigate("/AdminCadastroUsuarios")}>
                  Novo usuário
                </li>
              </ul>
            )}
          </div>

          {/* PRODUTOS */}
          <div className="menu-item-admin">
            <span 
              className="menu-title-admin"
              onClick={() => toggleMenu("produtos")}
            >
              Produtos
            </span>
            {menuAberto === "produtos" && (
              <ul className="submenu-admin">
                <li onClick={() => navigate("/AdminCadastroProdutos")}>
                  Novo produto
                </li>
                <li onClick={() => navigate("/AdminListarProdutos")}>
                  Listar produtos
                </li>
              </ul>
            )}
          </div>

          {/* Sair */}
          <div className="menu-item-admin logout" onClick={handleLogout}>
            <FaSignOutAlt size={20} style={{ marginRight: "5px" }} />
          </div>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}

export default LayoutAdmin;