import { createRoot } from "react-dom/client";
// import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "./assets/flexible.min";
import GlobalStyle from "./styled/GlobalStyle";
import App from "./App";

const container = document.getElementById("root") as HTMLDivElement;
const root = createRoot(container);
root.render(
  <>
    <GlobalStyle />
    <App />
  </>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <GlobalStyle />
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
