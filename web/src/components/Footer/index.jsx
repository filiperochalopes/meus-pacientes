import React from "react";
import Footer from "./styles";

const MainFooter = ({ hideControls }) => {
  return (
    <Footer>
      <p>
        Sistema em Desenvolvimento
        <br />
        Idealizado por <a href="https://filipelopes.me">Filipe Lopes</a>
        <br />
      </p>
    </Footer>
  );
};

export default MainFooter;
