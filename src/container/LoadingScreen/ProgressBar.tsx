/*
 * @Author: hongbin
 * @Date: 2022-02-06 16:02:29
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-07 10:13:11
 * @Description:进度条组件
 */
import { FC, ReactElement } from "react";
import styled, { css } from "styled-components";

interface IProps {
  progress: number;
}
//TODO 改成 朝鲜地图缩影,随着进度不断填充方式加载
const ProgressBar: FC<IProps> = ({ progress }): ReactElement => {
  return <Bar width={progress} />;
};

export default ProgressBar;

const Bar = styled.div<{ width: number }>`
  width: 100vw;
  background: #fff;
  position: relative;
  transition: height 0.2s linear, opacity 0.5s linear;
  transform-origin: center;

  ::after {
    content: "";
    height: 100%;
    transition: width 0.6s ease-out;
    background: linear-gradient(48deg, #07a9ff, #08ffaa);
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0px 2px 4px 2px #979595ba;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  ${({ width }) =>
    width >= 100
      ? css`
          opacity: 0;
          height: 0;

          ::after {
            transition-duration: 0.2s;
            width: 120vw;
          }
        `
      : css`
          height: 0.5rem;
          ::after {
            width: ${width + "vw"};
          }
        `};
`;