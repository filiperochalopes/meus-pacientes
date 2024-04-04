import Routes from "./services/Routes";
import { GlobalStyles } from "./theme/styles.App";
import theme from "./theme/theme";

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
          <Routes />
        </ThemeProvider>
      </ApolloProvider>
    </SnackbarProvider>
  );
}
export default App;
