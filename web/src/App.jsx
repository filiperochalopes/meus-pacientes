import Routes from "./services/Routes";
import GlobalStyles, { theme } from "./styles";
import "primereact/resources/themes/md-light-indigo/theme.css";

import React from "react";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "services/apiClient";
import { SnackbarProvider } from "notistack";

function App() {
  return (
      <ApolloProvider client={apolloClient}>
    <SnackbarProvider autoHideDuration={3000} maxSnack={3}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
          <Routes />
        </ThemeProvider>
    </SnackbarProvider>
      </ApolloProvider>
  );
}
export default App;
