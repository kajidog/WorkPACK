import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import createStore from "../store/createStore";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import {
  ThemeProvider as MaterialUIThemeProvider,
  StylesProvider,
} from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import theme from "../styles/theme";
const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);
  return (
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <CssBaseline />

          <Provider store={createStore()}>
            <Component {...pageProps} />
          </Provider>
        </StyledComponentsThemeProvider>
      </MaterialUIThemeProvider>
    </StylesProvider>
  );
};

export default MyApp;

// src/pages/_app.tsx