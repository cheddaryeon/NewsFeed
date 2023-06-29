import { createGlobalStyle } from 'styled-components';
import reset from "styled-reset"

const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    font-family: 'Noto Sans KR', sans-serif;
  }

  a {
    text-decoration: none;
    color: #000;
  }

  button {
    cursor: pointer;
    border: none;
    background-color: #fff;
  }

  body {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 16px;

    margin: 0 auto;
    text-align: center;

    color: #333
  }
`

export default GlobalStyle;