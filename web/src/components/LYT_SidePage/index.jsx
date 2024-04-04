import React from "react";
import Container from "./styles";
import Header from "components/Header";

const SidePageLayout = ({
  children,
  sideComponent,
  headerHideControls = true,
}) => {
  return (
    <Container>
      <Header hideControls={headerHideControls} />
      <div className="flex">
        <main>{children}</main>
        <div>
          {sideComponent || (
            <div className="sideComponent">Seja Bem Vindo!</div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default SidePageLayout;
