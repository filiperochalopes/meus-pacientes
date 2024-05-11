import Container from "./styles";
import Header from "components/Header";
import Footer from "components/Footer";
import { useState } from "react";
import { Link } from "react-router-dom";

const SimplePageLayout = ({ children, showMenu }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const handleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  return (
    <Container>
      <Header showMenu={showMenu} onMenuClick={handleMenu} />
      <div className="flex">
        {menuIsOpen && (
          <aside>
            <ul>
              <li>
                <Link to="/cadastro/exames">Cadastro de Exames</Link>
              </li>
              <li>
                <Link to="/editar/exames">Recebimento do Exame</Link>
              </li>
              <li>
                <Link to="/meu-exame-chegou">Verificar Exame</Link>
              </li>
              <li>
                <Link to="/passelivre">Lista de Passe Livre</Link>
              </li>
              <li>
                <Link to="/gestantes">Gestantes</Link>
              </li>
            </ul>
          </aside>
        )}
        <main>{children}</main>
      </div>
      <Footer />
    </Container>
  );
};

export default SimplePageLayout;
