/*
 * @Author: hongbin
 * @Date: 2022-02-16 21:02:38
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-17 10:14:03
 * @Description:美军损失表
 */

import { FC, memo, MouseEventHandler, ReactElement } from "react";
import styled, { css } from "styled-components";
import { Button } from "../../styled/Button";
import Table from "./Table";

interface IProps {
  isShow: boolean;
  handleCancel: () => void;
}

const resizeChart = () => {
  const resizeEvent = new CustomEvent("charts_resize", {
    detail: { key: "us" },
  });
  window.dispatchEvent(resizeEvent);
};

const handleMouseDown: MouseEventHandler<HTMLDivElement> = e => {
  const container = e.currentTarget.parentElement;
  if (!container) return console.error("无法获取把手父级", e);
  console.log(container.offsetHeight);
  //最大高度
  const limitTop = document.body.offsetHeight;
  const limitBottom = e.currentTarget.offsetHeight;

  const startPoint = e.pageY;
  const initHeight = container.offsetHeight;
  //chart
  // const item = charts.find(item => item.name = 'us');

  let timestamp = Date.now();
  let shake = Date.now();
  let timer: NodeJS.Timeout;

  const handleMove = (e: { pageY: number }) => {
    const currentPoint = e.pageY;
    const distance = startPoint - currentPoint;
    const h = initHeight + distance;
    const t = Date.now();
    if (h < limitTop && h > limitBottom) {
      container.style["height"] = h + "px";
    }
    //节流
    if (t - timestamp > 500) {
      timestamp = t;
      resizeChart();
    }
    //防抖 防止拖动过快小于500毫秒 保证在最后一定会适应表单
    if (t - shake < 500) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      console.log("1");
      shake = Date.now();
      resizeChart();
    }, 500);
    shake = t;
  };

  document.addEventListener("mousemove", handleMove);

  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", handleMove);
  });

  document.addEventListener("mouseleave", () => {
    document.removeEventListener("mousemove", handleMove);
  });
};

const USDate: FC<IProps> = ({ isShow, handleCancel }): ReactElement => {
  return (
    <Container isShow={isShow}>
      <div onMouseDown={handleMouseDown} id='USDate_handle'></div>
      <Table />
      <Button primary='#ffffff' onClick={handleCancel} size='small'>
        收起
      </Button>
    </Container>
  );
};

export default memo(USDate);

/* background: radial-gradient(#068a9feb, #cccccc);
background: radial-gradient(#06519fe6, #cccccc); */
const Container = styled.div<{ isShow: boolean }>`
  width: 100vw;
  height: 60vh;
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  transition: opacity 0.5s ease, transform 0.3s ease, visibility 0.3s ease;
  background: radial-gradient(#545454e6, #3c3c3c 90%);

  & > #USDate_handle {
    position: relative;
    height: 20px;
    width: 100%;
    cursor: ns-resize;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 3px;
    transition: background-color 0.3s ease;

    ::before,
    ::after {
      content: "";
      width: 20px;
      height: 2px;
      border-radius: 2px;
      background-color: #cccccc;
    }

    :active {
      background-color: #00000066;
    }
  }

  & > button {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
  }

  #us_data {
    width: 100%;
    height: calc(100% - 20px);
  }

  ${({ isShow }) =>
    isShow
      ? css`
          visibility: visible;
          transform: none;
          opacity: 1;
        `
      : css`
          visibility: none;
          transform: translateY(100%);
          opacity: 0;
        `};
`;
