import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,body {
    height: 100%;
    font-family: "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;
    background: #345438;
    overflow: hidden;
  }
 
  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  :root {
    --primary-color: #5511ff;
    --nav-height: 4rem;
  }

  @media screen and (max-width: 750px){
    html{
      font-size: 65%;
    }
    :root {
     
    }
  }
`;

export default GlobalStyle;
