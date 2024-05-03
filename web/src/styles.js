import { createGlobalStyle } from "styled-components";

export const theme = {
  colors: {
    green: "#13965E",
    gray400: "#606060",
    gray: "#D9D9D9",
    grayLight: "#F8F8F8",
    grayMedium: "#A6A6A6",
    black: "#000",
    blue: "#325AA4",
    white: "#fff",
    red: "#FF7171",
    red700: "#B40D0D",
    blueGradient:
      "linear-gradient(to right, rgb(0, 105, 208), rgb(73, 143, 255))",
  },
  ligth: {
    colors: {
      blueGradient:
        "linear-gradient(to right, rgb(0, 105, 208), rgb(73, 143, 255))",
    },
  },
  dark: {
    colors: {
      black: "#000",
    },
  },
};

export default createGlobalStyle`

  *{
    margin: 0;
    padding: 0;
    /* font-family: 'Raleway', sans-serif; */
    border: none;
    outline: none;
    text-decoration: none;
    box-sizing:border-box;
  }

  html, body, #root{
    height: 100%;
    background: ${(props) => props.theme.white};
  }

  body{
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 0.8125rem;
  }

  h1{
    color: ${(props) => props.theme.black};
  }

  input {
    outline: none;
    border: none;
    background: #f0f0f0;
    padding: 4px 8px;

    &::placeholder{
      color: ${(props) => props.theme.black};
    }
  }

  p{
    margin-bottom: 1rem;
  }

  .flex {
    display: flex;
    &.space-between { justify-content: space-between }
    &.align-end { align-items: flex-end }
    &.justify-end { justify-content: flex-end }
    &.center { align-items: center }
  }
`;
