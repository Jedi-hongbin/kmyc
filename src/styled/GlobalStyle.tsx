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
  @media screen and (orientation: landscape) and (max-height: 750px) {
    * {
      z-index: -1 !important;
    }
    #root::before{
      content: "";
      display: flex;
      width: 100vmax;
      height: 100vmin;
      background: #a0f5a0;
    }
    #root::after{
      content: "为了更好体验，请在浏览器竖屏情况下横持手机浏览";
      color: #448744;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: 5vmin;
      border-radius: 1vmin;
      text-shadow: 0px 1px 7px #fffae5;
      background: linear-gradient(145deg, #abffab, #90dd90);
      box-shadow:  26px 26px 52px #7aba7a,
              -26px -26px 52px #c6ffc6;
    }
  }
`;

export default GlobalStyle;
