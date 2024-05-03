import Routes from "./services/Routes";
import GlobalStyles, { theme } from "./styles";

import React from "react";
import { ThemeProvider } from "styled-components";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "services/apiClient";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <SnackbarProvider autoHideDuration={3000} maxSnack={3}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          />
          <Routes />
        </ThemeProvider>
      </ApolloProvider>
    </SnackbarProvider>
  );
}
export default App;
