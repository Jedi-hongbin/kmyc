/*
 * @Author: hongbin
 * @Date: 2022-02-18 16:35:27
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-02 18:22:01
 * @Description:缴获武器
 */
import { FC, memo, ReactElement, useState } from "react";
import styled from "styled-components";
import * as echarts from "echarts";
import useMount from "../../hook/useMount";
import { detrusionTransition, rightDetrusion } from "../../styled";

interface IProps {}

const { isPhone, pageWidth } = window;

const option = {
  title: {
    text: "缴获武器",
    left: isPhone ? 0 : window.vmax(1),
    textStyle: {
      color: "#fffae5",
      fontSize: isPhone ? 12 : 20,
    },
  },
  tooltip: {
    trigger: "axis",
    // formatter: "{b0}: {c0}<br />{b1}: {c1}",
    formatter: ([y, z]: any) => {
      return `缴获${y.axisValue}<br />${y.seriesName} <b>${y.data}</b><br />${
        z.seriesName
      } <b>${
        z.data
      }</b><br/>总数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>${
        y.data + z.data
      }</b>`;
    },
  },
  legend: {
    data: [
      "运动战时期",
      "阵地战时期",
      // "总数"
    ],
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
    height: isPhone ? pageWidth / 3.8 : "auto",
  },
  toolbox: {
    right: isPhone ? 0 : 20,
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
    data: [
      "坦克",
      "汽车",
      "装甲车",
      "飞机",
      "火炮",
      "枪支",
      "火焰喷射器",
      "炮弹",
      //   "子弹",
      "地雷",
      "手榴弹",
      "通讯器材",
    ],
    axisLabel: {
      interval: 0,
      fontSize: isPhone ? 8 : 12,
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
      lineStyle: {
        color: "#aaa",
      },
    },
  },
  series: [
    {
      name: "运动战时期",
      type: "line",
      data: [
        187, 4954, 50, 10, 3133, 45252, 0, 96578,
        // 3720198,
        0, 2397, 1791,
      ],
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
      type: "line",
      data: [
        58, 302, 1, 1, 904, 28010, 109, 284636,
        // 15247897,
        12863, 132530, 3337,
      ],
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
    // {
    //   name: "总数",
    //   type: "bar",
    //   data: [
    //     245, 5526, 51, 11, 4037, 73262, 109, 381214,
    //     //  18968095,
    //     12862, 134927, 5128,
    //   ],
    //   smooth: true,
    //   emphasis: {
    //     focus: "series",
    //   },
    //   itemStyle: {
    //     lineStyle: {
    //       color: "#0099aa",
    //     },
    //   },
    // },
  ],
};

const CapturedWeapons: FC<IProps> = (): ReactElement => {
  const [isShow, setIsShow] = useState(false);
  useMount(() => {
    const chartDom = document.getElementById("CapturedWeapons");
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
  return <Container isShow={isShow} id='CapturedWeapons'></Container>;
};

export default memo(CapturedWeapons);

const Container = styled.div<{ isShow: boolean }>`
  position: fixed !important;
  z-index: 1;
  background: radial-gradient(#355235d1, #437143 90%);
  width: 48vmax;
  height: 35vmin;
  bottom: 0.5rem;
  right: 0.5rem;
  padding-top: 10px;
  border-radius: 1rem;
  ${detrusionTransition};
  @media screen and (min-width: 1920px) {
    width: 38vmax;
    height: 30vmin;
    border-radius: 0.6rem;
  }
  ${({ isShow }) => !isShow && rightDetrusion};

  @media screen and (max-width: 750px) {
    padding: 0px;
    transform: rotate(90deg) translateX(-48vmax);
    left: 0.5rem;
    transform-origin: bottom left;
  }
  ${props => props.theme.replaceBg};
`;
