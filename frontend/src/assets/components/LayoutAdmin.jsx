import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./css/LayoutAdmin.css"

function LayoutAdmin({ children }) {

  const navigate = useNavigate()
  const [abrirMenu, setAbrirMenu] = useState(false)
  const menuRef = useRef()

  function toggleMenu() {
    setAbrirMenu(!abrirMenu)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAbrirMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <header className="header-admin">
        <nav className="menu-admin">

          <span 
            onClick={() => navigate("/AdminHome")}
            className="menu-title-admin"
          >
            Home
          </span>

          <div className="menu-item-admin" ref={menuRef}>
            <span 
              className="menu-title-admin"
              onClick={toggleMenu}
            >
              Usuários
            </span>

            {abrirMenu && (
              <ul className="submenu-admin">
                <li onClick={() => navigate("/AdminListarUsuarios")}>Listar usuários</li>
                <li onClick={() => navigate("/AdminCadastroUsuarios")}>
                  Novo usuário
                </li>
              </ul>
            )}
          </div>

        </nav>
      </header>

      <main>
        {children}
      </main>
    </>
  )
}

export default LayoutAdmin