/*
 * @Author: hongbin
 * @Date: 2022-02-18 21:22:20
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-18 21:35:23
 * @Description:减员情况
 */
import { FC, memo, ReactElement } from "react";
import * as echarts from "echarts";
import useMount from "../../hook/useMount";
import styled from "styled-components";

const option = {
  title: {
    text: "志愿军运动战减员情况",
    left: 10,
    textStyle: {
      color: "#fffae5",
    },
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["运动战时期", "阵地战时期", "总数"],
    textStyle: {
      color: "#fffae5",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["阵亡", "战伤", "失踪、被俘"],
    axisLabel: {
      interval: 0,
    },
    axisLine: {
      lineStyle: {
        color: "#fffae5",
      },
    },
  },
  yAxis: {
    type: "value",
    axisLine: {
      lineStyle: {
        color: "#fffae5",
      },
    },
    splitLine: {
      //   show: false,
      lineStyle: {
        // 使用深浅的间隔色
        color: "#aaa",
      },
    },
  },
  series: [
    {
      type: "bar",
      data: [115786, 221264, 29095],
      barWidth: "30%",
    },
  ],
};

interface IProps {}

const Downsizing: FC<IProps> = (): ReactElement => {
  useMount(() => {
    const chartDom = document.getElementById("Downsizing");
    const myChart = echarts.init(chartDom!);
    option && myChart.setOption(option);
    window.addEventListener("resize", (e: any) => {
      myChart.resize();
    });
  });

  return <Container id='Downsizing'></Container>;
};

export default Downsizing;

const Container = styled.div`
  position: fixed !important;
  z-index: 1;
  background: radial-gradient(#355235d1, #437143 90%);
  width: 25vw;
  height: 30vh;
  bottom: 0.5rem;
  left: 0.5rem;
  padding-top: 10px;
  border-radius: 1rem;
  /* @media screen and (max-width: 1000px) {
    width: 60vw;
  } */

  @media screen and (min-width: 1920px) {
    width: 20vw;
    height: 20vh;
    border-radius: 0.6rem;
  }
`;
