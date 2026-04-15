import { FaBars, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/LayoutUser.css";

function LayoutUser({ children }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [departamentoAberto, setDepartamentoAberto] = useState(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch("http://localhost:3000/menu");
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMenu();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
        setDepartamentoAberto(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleDepartamento(id) {
    setDepartamentoAberto((prev) => (prev === id ? null : id));
  }

  return (
    <>
      <div className="LayoutUser">
        <div className="LayoutUser-left" ref={menuRef}>
          <FaBars className="icon" onClick={() => setOpen(!open)} />
          <span onClick={() => setOpen(!open)}>Departamentos</span>

          {open && (
            <div className="dropdown-menu">
              {menu.map((dep) => (
                <div key={dep.id} className="dropdown-dep">
                  <strong onClick={() => toggleDepartamento(dep.id)}>
                    {dep.nome}
                  </strong>

                  {departamentoAberto === dep.id && (
                    <div className="dropdown-cat">
                      {dep.categorias.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => {
                            navigate(`/categoria/${cat.id}`);
                            setOpen(false);
                            setDepartamentoAberto(null);
                          }}
                        >
                          {cat.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
          <h2 onClick={() => navigate("/UsuarioHome")}>Santana</h2>
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