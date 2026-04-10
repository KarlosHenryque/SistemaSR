import LayoutUser from "../../assets/components/LayoutUser";
import "../../assets/css/usuario/UsuarioHome.css";
import logo from "../../assets/images/logo.jpg";

import { FaWhatsapp, FaInstagram, FaFacebookF, FaEnvelope } from "react-icons/fa";

function UsuarioHome() {
  return (
    <LayoutUser>
      <div className="UserHome-container">

        <section className="UserHome-hero">
          <h1 className="UserHome-title">
            Seja bem-vindo ao Santana Representacoes
          </h1>

          <img src={logo} alt="Logo" className="UserHome-logo" />

          <p className="UserHome-description">
            Há 15 anos no mercado, a SantanaStore oferecendo tudo o que você precisa
            para sua obra, com qualidade, variedade e preços justos.
          </p>
        </section>

        <section className="UserHome-footer">

          <div className="UserHome-footer-left">
            <img src={logo} alt="Logo" />
          </div>

          <div className="UserHome-footer-center">
            <h2>Horário de Atendimento:</h2>
            <p>Segunda à Quinta das 8h às 19h</p>
            <p>Sábado das 7h30 às 15h30</p>
          </div>

          <div className="UserHome-footer-right">
            <a href="https://wa.me/45999657989" target="_blank" rel="noreferrer">
              <FaWhatsapp />
            </a>

            <a href="https://www.instagram.com/santana.rep/" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>

            <a href="https://www.facebook.com/santanarep/" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>

            <a href="mailto:vinicius@santanarepresentacoes.net.br">
              <FaEnvelope />
            </a>
          </div>

        </section>

      </div>
    </LayoutUser>
  );
}

export default UsuarioHome;