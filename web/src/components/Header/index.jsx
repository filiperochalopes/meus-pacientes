import React from "react";
import Header from "./styles";

const MainHeader = ({ hideControls }) => {
  return (
    <Header>
      {!hideControls && <div id="menu">Menu</div>} Nome da Aplicação
    </Header>
  );
};

export default MainHeader;
