import React from "react";
import Header from "./styles";
import PropTypes from "prop-types";

const MainHeader = ({ showMenu, onMenuClick }) => {
  return (
    <Header>
      {showMenu && <button onClick={onMenuClick}>Menu</button>} PSF SEDE 2 •
      Meus Pacientes
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
