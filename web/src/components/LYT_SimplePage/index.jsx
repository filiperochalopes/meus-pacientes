import Container from "./styles";
import Header from "components/Header";
import Footer from "components/Footer";

const SimplePageLayout = ({ children }) => {
  return (
    <Container>
      <Header institutionInformation={true} />
      <div className="flex">
        <main>{children}</main>
      </div>
      <Footer />
    </Container>
  );
};

export default SimplePageLayout;
