import { FaBars, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import "./css/LayoutUser.css";

function LayoutUser({ children }) { 
  return (
    <>
      <div className="LayoutUser">

        <div className="LayoutUser-left">
          <FaBars className="icon" />
          <span>Departamentos</span>
        </div>

        <div className="LayoutUser-center">
          <input
            type="text"
            placeholder="Buscar produtos"
          />
          <button>
            <FaSearch />
          </button>
        </div>

        <div className="LayoutUser-right">
          <div className="cart">
            <FaShoppingBag />
          </div>

          <FaUser className="icon" />
        </div>

      </div>

      <main className="content">
        {children}
      </main>
    </>
  );
}

export default LayoutUser;