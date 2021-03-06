import { createGlobalStyle, css } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,body {
    height: 100%;
    font-family: "Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif;
    background: ${window.MACOS ? "#345438" : "#025528"};
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
    user-select: none;
  }

  :root {
    --primary-color: #5511ff;
    --nav-height: 4rem;
  }

  .label{
    position : fixed;
    z-index : 9;
    font-size : 1vmin;
    transform : translateX(-50%);
    transition : all 0.2s ease;
    background : #00000088;
    color : #fff;
    padding : 1vmin;
    border-radius: 1vmin;
    cursor: default;
  }

  @media screen and (max-width: 750px){
    html{
      font-size: 65%;
    }
    :root {
     
    }
    .label {
      transform: rotate(90deg) translateX(-50%);
      transform-origin: left top;
    }
  }
  @media screen and (orientation: landscape) and (max-height: 550px) {
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

export const chartBG = css`
  background: ${window.MACOS
    ? "radial-gradient(#355235d1, #437143 90%)"
    : "radial-gradient(#02561cd1, #006e2d 90%)"};
`;
// "radial-gradient(rgb(3 71 3 / 82%), rgb(8 127 8) 90%)"};
