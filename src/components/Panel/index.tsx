/*
 * @Author: hongbin
 * @Date: 2022-02-17 13:40:14
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-12 12:55:54
 * @Description:控制面板
 */
import {
  Dispatch,
  FC,
  memo,
  ReactElement,
  useState,
  createRef,
  useImperativeHandle,
} from "react";
import styled, { css } from "styled-components";
import { flexCenter } from "../../styled";
import { Button } from "../../styled/Button";
import { adjustColor } from "../../utils/color";
import { LoadIcon } from "../icon";
import MouseExplain from "./MouseExplain";

/**
 * @description: 控制面板向外暴露方法
 */
export const panelRef = createRef<{
  hide: () => void;
  show: () => void;
}>();

interface IProps {
  setAnimateIndex: Dispatch<React.SetStateAction<number>>;
  setIsShowUSDate: Dispatch<React.SetStateAction<boolean>>;
  goHome: () => void;
  loadingIndex: number;
}

const campaignNames = [
  "第一次战役",
  "第二次战役",
  "第三次战役",
  "第四次战役",
  "第五次战役",
];

const Panel: FC<IProps> = ({
  setAnimateIndex,
  setIsShowUSDate,
  goHome,
  loadingIndex,
}): ReactElement => {
  const [isHide, setIsHide] = useState(false);
  const [isOpenExplain, setIsOpenExplain] = useState(false);

  useImperativeHandle(
    panelRef,
    () => {
      return {
        hide: () => {
          !window.isPhone && setIsHide(true);
        },
        show: () => {
          setIsHide(false);
        },
      };
    },
    []
  );

  return (
    <Container isHide={isHide}>
      {campaignNames.map((name, index) => (
        <Button
          size='medium'
          primary={adjustColor("#aaffaa", index * -10)}
          key={name}
          onClick={() => setAnimateIndex(index + 1)}
        >
          {name}
          {index + 1 === loadingIndex ? <LoadIcon /> : null}
        </Button>
      ))}
      <Button
        size='medium'
        primary='#fffdff'
        onClick={() => setIsShowUSDate(true)}
      >
        美军伤亡
      </Button>
      <Button size='medium' primary='#00faff' onClick={goHome}>
        回到主页
      </Button>

      <Button
        onMouseEnter={() => setIsOpenExplain(true)}
        onMouseLeave={() => setIsOpenExplain(false)}
        size='medium'
        primary='#ffaaaa'
      >
        操作说明
      </Button>
      <MouseExplain show={isOpenExplain} />
    </Container>
  );
};

export default memo(Panel);

const Container = styled.div<{ isHide: boolean }>`
  position: fixed;
  z-index: 2;
  top: 0.4rem;
  left: 0.4rem;
  background: ${window.MACOS ? "#263c26" : "rgb(18 56 23)"};
  border-radius: 1rem;
  ${flexCenter};
  flex-direction: column;
  padding: 0.4rem;
  transition: transform 0.3s ease;
  ${props => props.theme.replaceBg};

  ${({ isHide }) =>
    isHide &&
    css`
      transform: translateX(-90%);
      :hover {
        transform: translateX(0);
      }
    `};
  @media screen and (max-width: 750px) {
    left: auto;
    top: 0.4rem;
    right: 0.4rem;
    transform: rotate(90deg) translateX(100%);
    transform-origin: top right;
  }
`;
