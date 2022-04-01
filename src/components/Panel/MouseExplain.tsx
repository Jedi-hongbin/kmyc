/*
 * @Author: hongbin
 * @Date: 2022-02-18 08:52:51
 * @LastEditors: hongbin
 * @LastEditTime: 2022-04-01 14:29:58
 * @Description: 介绍鼠标按键功能
 */
import { FC, ReactElement } from "react";
import styled, { css } from "styled-components";
import { chartBG } from "../../styled/GlobalStyle";
import { mouseGunLun, mouseLeft, mouseRight, Music, SpaceBar } from "../icon";

interface IProps {
  show: boolean;
}

const MouseExplain: FC<IProps> = ({ show }): ReactElement => {
  return (
    <Container show={show}>
      <Title>操作说明</Title>
      <Box icon={mouseLeft} text='鼠标左键' explain='移动视线' />
      <Box icon={mouseRight} text='鼠标右键' explain='旋转视线' />
      <Box icon={mouseGunLun} text='鼠标滚轮' explain='缩放视线-可按下拉动' />
      <Box icon={SpaceBar} text='空格键' explain='开启/关闭镜头自动旋转' />
      <Box icon={Music} text='S键' explain='开启/关闭背景音乐' />
    </Container>
  );
};

export default MouseExplain;

interface BoxProps {
  icon: JSX.Element;
  text: string;
  explain: string;
}

const Box: FC<BoxProps> = ({ icon, text, explain }) => (
  <div>
    {icon}
    <div>
      <h6>{text}</h6>
      <p>{explain}</p>
    </div>
  </div>
);

const Title = styled.span`
  font-size: 0.6rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const Container = styled.div<{ show: boolean }>`
  margin-top: 0.4rem;
  padding: 0.4rem 0.6rem;
  padding-right: 0.2rem;
  color: #fffae5;
  position: absolute;
  z-index: 1;
  margin-left: 0.4rem;
  /* background: inherit; */
  width: 10rem;
  border-radius: 0.5rem;
  left: 100%;
  top: 0;
  font-size: 0.5rem;
  display: flex;
  flex-direction: column;
  letter-spacing: 1px;
  transition-property: opacity, transform, visibility;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  transform-origin: left bottom;
  transition-delay: 0.1s;
  ${chartBG};
  & > div {
    display: flex;
    margin: 0.3rem 0;
    svg {
      width: 1.3rem;
      height: 1.3rem;
    }
    & > div {
      margin-left: 0.1rem;
    }
  }

  ${({ show }) =>
    !show &&
    css`
      opacity: 0;
      visibility: hidden;
      transform: scale(0);
    `}
`;
