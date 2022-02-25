/*
 * @Author: hongbin
 * @Date: 2022-02-18 15:21:23
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-24 13:43:57
 * @Description:歼敌
 */
import { FC, memo, ReactElement, useState } from "react";
import * as echarts from "echarts";
import useMount from "../../hook/useMount";
import styled from "styled-components";
import { detrusionTransition, rightDetrusion } from "../../styled";

interface IProps {}

const { isPhone, pageWidth } = window;

const option = {
  title: {
    text: "歼敌",
    left: isPhone ? 0 : 10,
    textStyle: {
      color: "#fffae5",
      fontSize: isPhone ? 10 : 20,
    },
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: isPhone
      ? ["运动战时期", "阵地战时期"]
      : ["运动战时期", "阵地战时期", "总数"],
    left: isPhone ? 30 : "center",
    textStyle: {
      color: "#fffae5",
      fontSize: isPhone ? 10 : 12,
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
    height: isPhone ? pageWidth / 4.5 : "auto",
  },
  toolbox: !isPhone && {
    right: 20,
    feature: {
      // saveAsImage: {
      //     title: '保存为图片'
      // },
      magicType: {
        type: ["line", "bar"],
        title: {
          line: "切换为折线图",
          bar: "切换为柱状图",
        },
      },
    },
    iconStyle: {
      borderColor: "#fffae5",
    },
    emphasis: {
      iconStyle: {
        borderColor: "#fffae5",
      },
    },
  },
  xAxis: {
    type: "category",
    data: ["毙伤敌", "俘敌", "敌投降"],
    axisLabel: {
      interval: 0,
      fontSize: isPhone ? 9 : 12,
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
      name: "运动战时期",
      type: "bar",
      data: [138293, 36835, 149],
      smooth: true,
      emphasis: {
        focus: "series",
      },
      itemStyle: {
        lineStyle: {
          color: "#aaffaa",
        },
      },
    },
    {
      name: "阵地战时期",
      type: "bar",
      data: [523661, 9253, 286],
      smooth: true,
      emphasis: {
        focus: "series",
      },
      itemStyle: {
        lineStyle: {
          color: "#23a567",
        },
      },
    },
    !isPhone && {
      name: "总数",
      type: "bar",
      data: [671954, 46088, 435],
      smooth: true,
      emphasis: {
        focus: "series",
      },
      itemStyle: {
        lineStyle: {
          color: "#0099aa",
        },
      },
    },
  ],
};

const Annihilate: FC<IProps> = (): ReactElement => {
  const [isShow, setIsShow] = useState(false);

  useMount(() => {
    const chartDom = document.getElementById("annihilate");
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

  return <Container isShow={isShow} id='annihilate'></Container>;
};

export default memo(Annihilate);

const Container = styled.div<{ isShow: boolean }>`
  position: fixed !important;
  z-index: 1;
  background: radial-gradient(#355235d1, #437143 90%);
  width: 33vmax;
  height: 30vmin;
  top: 32vmin;
  right: 0.5rem;
  padding-top: 10px;
  border-radius: 1rem;
  ${detrusionTransition};
  /* @media screen and (max-width: 1000px) {
    width: 60vmax;
  } */

  @media screen and (min-width: 1920px) {
    top: 36vmin;
    width: 25vmax;
    height: 25vmin;
    border-radius: 0.6rem;
  }

  ${({ isShow }) => !isShow && rightDetrusion};

  @media screen and (max-width: 750px), (max-height: 500px) {
    padding-top: 1px;
    transform: rotate(90deg);
    top: auto;
    right: auto;
    transform-origin: bottom left;
    bottom: calc(33vmax + 0.5rem);
    left: calc(36vmin + 1rem);
  }
  ${props => props.theme.replaceBg};
`;
