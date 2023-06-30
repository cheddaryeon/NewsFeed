import { createGlobalStyle } from 'styled-components';
import reset from "styled-reset"

const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
  }

  li {
    list-style: none;
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
    width: 100%;
    min-width: 800px;

    font-family: 'Noto Sans KR', sans-serif;
    font-size: 16px;
    word-break: keep-all;
    

    margin: 0 auto;
    text-align: center;

    color: #333
  }
`

export default GlobalStyle;