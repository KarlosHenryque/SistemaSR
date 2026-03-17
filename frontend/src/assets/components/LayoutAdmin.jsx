import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./css/LayoutAdmin.css"

function LayoutAdmin({ children }) {

  const navigate = useNavigate()
  const [abrirCadastro, setAbrirCadastro] = useState(false)

  return (
    <>
      <header className="header-admin">
        <nav className="menu-admin">
          <div 
            className="menu-item-admin"
            onMouseEnter={() => setAbrirCadastro(true)}
            onMouseLeave={() => setAbrirCadastro(false)}
          >

            <span className="menu-title-admin">
              Cadastro 
            </span>

            {abrirCadastro && (
              <ul className="submenu-admin">
                <li onClick={() => navigate("/AdminCadastroUsuarios")}>Usuários</li>
                <li>Grupo de usuário</li>
                <li>Produtos</li>
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