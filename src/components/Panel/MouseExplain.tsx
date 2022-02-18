/*
 * @Author: hongbin
 * @Date: 2022-02-18 08:52:51
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-18 09:57:34
 * @Description: 介绍鼠标按键功能
 */
import { FC, ReactElement } from "react";
import styled, { css } from "styled-components";
import { mouseGunLun, mouseLeft, mouseRight } from "../icon";

interface IProps {
  show: boolean;
}

const MouseExplain: FC<IProps> = ({ show }): ReactElement => {
  return (
    <Container show={show}>
      <Title>鼠标操作说明</Title>
      <Box icon={mouseLeft} text='鼠标左键' explain='移动视线' />
      <Box icon={mouseRight} text='鼠标右键' explain='旋转视线' />
      <Box icon={mouseGunLun} text='鼠标滚轮' explain='缩放视线-可按下拉动' />
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
  font-size: 0.7rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const Container = styled.div<{ show: boolean }>`
  padding: 0.4rem 0.6rem;
  color: #fffae5;
  position: absolute;
  z-index: 1;
  margin-left: 0.4rem;
  /* background: inherit; */
  background: radial-gradient(#355235d1, #437143 90%);
  width: 10rem;
  border-radius: 0.5rem;
  left: 100%;
  top: 0;
  font-size: 0.6rem;
  display: flex;
  flex-direction: column;
  letter-spacing: 1px;
  transition-property: opacity, transform, visibility;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  transform-origin: left bottom;
  transition-delay: 0.1s;

  & > div {
    display: flex;
    margin: 0.5rem 0;
    svg {
      width: 1.5rem;
      height: 1.5rem;
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
