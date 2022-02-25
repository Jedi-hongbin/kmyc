/*
 * @Author: hongbin
 * @Date: 2022-02-18 18:07:10
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-24 13:46:43
 * @Description:击毁武器
 */
import { FC, ReactElement, memo, useState } from "react";
import styled from "styled-components";
import * as echarts from "echarts";
import useMount from "../../hook/useMount";
import { detrusionTransition, rightDetrusion } from "../../styled";

interface IProps {}

const { isPhone } = window;

const option = {
  title: {
    text: "击毁武器",
    left: isPhone ? 0 : 15,
    textStyle: {
      color: "#fffae5",
      fontSize: isPhone ? 10 : 20,
    },
  },
  tooltip: {},
  series: [
    {
      type: "pie",
      data: [
        { name: "坦克", value: 2006 },
        { name: "汽车", value: 3165 },
        { name: "装甲车", value: 44 },
        { name: "飞机", value: 10629 },
        { name: "各种炮", value: 583 },
        { name: "船只", value: 14 },
      ],
      selectedMode: "single",
      selectedOffset: 10,
      clockwise: true,
      label: {
        fontSize: isPhone ? 10 : 13,
        color: "#fffae5",
      },
      labelLine: {
        lineStyle: {
          color: "#fffae5",
        },
      },
      center: isPhone ? ["50%", "57%"] : ["50%", "60%"],
      itemStyle: {},
    },
  ],
};

const Destroy: FC<IProps> = (): ReactElement => {
  const [isShow, setIsShow] = useState(false);
  useMount(() => {
    const chartDom = document.getElementById("Destroy");
    const myChart = echarts.init(chartDom!);
    option && myChart.setOption(option);
    window.addEventListener("resize", (e: any) => {
      myChart.resize();
    });
    window.addEventListener("custom_detrusion", (e: any) => {
      const state = e.detail.detrusion;
      setIsShow(state);
    });
  });
  return <Container isShow={isShow} id='Destroy'></Container>;
};

export default memo(Destroy);

const Container = styled.div<{ isShow: boolean }>`
  position: fixed !important;
  z-index: 1;
  background: radial-gradient(#355235d1, #437143 90%);
  width: 30vmax;
  height: 29vmin;
  top: 0.5rem;
  right: 0.5rem;
  padding-top: 10px;
  border-radius: 1rem;
  ${detrusionTransition};
  @media screen and (min-width: 1920px) {
    width: 20vmax;
    height: 29vmin;
    border-radius: 0.6rem;
  }
  ${({ isShow }) => !isShow && rightDetrusion};

  @media screen and (max-width: 750px) {
    padding: 0;
    transform: rotate(90deg);
    transform-origin: top right;
    top: calc(100vmax - 0.5rem);
  }
  ${props => props.theme.replaceBg};
`;
