import { FaBars, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/LayoutUser.css";

function LayoutUser({ children }) {
  const [open, setOpen] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDepartamentos() {
      try {
        const res = await fetch("http://localhost:3000/departamentos/ativos");
        const data = await res.json();

        const ordenado = data.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );

        setDepartamentos(ordenado);
      } catch (err) {
        console.error("Erro ao buscar departamentos:", err);
      }
    }

    fetchDepartamentos();
  }, []);

  function handleDepartamentoClick(dep) {
  setOpen(false);
  navigate(`/produtos/${dep.id}`);
}

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="LayoutUser">

        <div className="LayoutUser-left" ref={menuRef}>
          <FaBars className="icon" onClick={() => setOpen(!open)} />
          <span onClick={() => setOpen(!open)}>Departamentos</span>

          {open && (
            <div className="dropdown-menu">
              <div className="menu-column">
                {departamentos.map((dep) => (
                  <div
                    key={dep.id}
                    className="dropdown-item"
                    onClick={() => handleDepartamentoClick(dep)}
                  >
                    {dep.nome}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="LayoutUser-center">
          <input type="text" placeholder="Buscar produtos" />
          <button>
            <FaSearch />
          </button>
        </div>

        <div className="LayoutUser-right">
          <h2
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/UsuarioHome")}
          >
            Santana
          </h2>
          
          <div className="cart">
            <FaShoppingBag />
          </div>

          <FaUser className="icon" />
        </div>

      </div>

      <main className="content">{children}</main>
    </>
  );
}

export default LayoutUser;