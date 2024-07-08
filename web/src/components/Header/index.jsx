import React from "react";
import Header from "./styles";
import PropTypes from "prop-types";
import { useAppContext } from "services/Context";
import { Link } from "react-router-dom";

const MainHeader = ({ showMenu, onMenuClick }) => {
  const { user, logout } = useAppContext();

  return (
    <Header>
      {user?.id && <button onClick={onMenuClick}>Menu</button>}{" "}
      {!user?.id && <Link to="/login">Login</Link>}{" "}
      {user?.institutionRoles[0]?.institution.name} • Meus Pacientes{" "}
      {user?.id && <button onClick={logout}>Sair</button>}
    </Header>
  );
};

MainHeader.propTypes = {
  showMenu: PropTypes.bool,
};

MainHeader.defaultProps = {
  showMenu: true,
};

export default MainHeader;
