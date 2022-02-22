/*
 * @Author: hongbin
 * @Date: 2022-02-22 20:52:20
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-22 21:20:22
 * @Description: styled-components 主题支持 为了解决qq浏览器不显示透明背景颜色
 */

import { ReactNode, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import useMount from "../hook/useMount";

/**
 * 不支持 十六进制 透明颜色的浏览器
 */
const fuckBrowser = ["UCBrowser", "MQQBrowser", "browserplus"];

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState({ replaceBg: "" });

  useMount(() => {
    // alert(navigator.userAgent);
    //在uc浏览器或夸克等极为先进的浏览器对背景高斯模糊样式的支持令人发指
    //在这些浏览器中不使用背景模糊效果
    if (fuckBrowser.some(b => navigator.userAgent.indexOf(b) !== -1)) {
      setTheme(() => ({ replaceBg: "background: #44733b;opacity:0.9;" }));
    }
  });

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

export default ThemeProvider;
