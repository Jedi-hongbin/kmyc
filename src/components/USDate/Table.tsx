/*
 * @Author: hongbin
 * @Date: 2022-02-16 22:00:29
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-20 13:29:13
 * @Description: chart 表
 */
import * as echarts from "echarts";
import { FC, memo, ReactElement } from "react";
import useMount from "../../hook/useMount";

interface IProps {}

const { isPhone, pageWidth } = window;
// charts.push({ name: "us", chart: myChart });

const option = {
  title: {
    text: "美军损失图表",
    left: isPhone ? 0 : 20,
    textStyle: {
      color: "#fffae5",
      fontSize: isPhone ? 12 : 20,
    },
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["总数", "陆军", "海军", "海军陆战队", "空军"],
    textStyle: {
      color: "#fffae5",
      fontSize: isPhone ? 10 : 12,
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "1%",
    containLabel: true,
    height: isPhone ? pageWidth / 1.4 : "auto",
  },
  toolbox: {
    right: 20,
    feature: {
      // saveAsImage: {
      //     title: '保存为图片'
      // },
      magicType: {
        type: ["line", "bar", "stack"],
        title: {
          line: "切换为折线图",
          bar: "切换为柱状图",
          stack: "切换为堆叠",
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
    boundaryGap: false,
    data: [
      "阵亡",
      "因伤死亡",
      "行动中失踪者被宣布死亡",
      "被俘-宣告死亡",
      "敌对死亡总数",
      "失踪推定死亡",
      "其他死亡",
      "非敌对死亡总数",
      "战区内死亡总人数",
      "非战区死亡总人数",
      "总死亡人数",
      "阵亡-无遗骸",
      "因伤势过重而死亡无遗体",
      "行动中失踪-宣布死亡-无遗骸",
      "被捕者宣布死亡-无遗骸",
      "非敌对失踪-推定死亡-无遗骸",
      "其他非敌对死亡无遗骸",
      "无遗骸总数",
      "受伤-不是致命的",
      // '全球服役人数',
      // '战区内服役人数',
    ],
    axisLabel: {
      interval: 0,
      //x轴的文字改为竖版显示
      formatter: (value: string) =>
        value.replace(/-/g, "|").split("").join("\n"),
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
      //   show: false,
      lineStyle: {
        // 使用深浅的间隔色
        color: "#aaa",
      },
    },
  },
  series: [
    {
      name: "总数",
      type: "line",
      data: [
        23613, 2460, 4817, 2849, 33739, 8, 2827, 2835, 36574, 17672, 54246,
        1521, 22, 4549, 1891, 8, 84, 8075, 103284,
        // , 5720000, 1789000
      ],
      smooth: true,
      emphasis: {
        focus: "series",
      },
    },
    {
      name: "陆军",
      type: "line",
      data: [
        19715, 1887, 3337, 2792, 27731, 4, 2121, 2125, 29856, 7277, 37133, 1072,
        22, 3276, 1850, 4, 5, 6229, 77596,
        // 2834000, 1153000
      ],
      smooth: true,
      emphasis: {
        focus: "series",
      },
    },
    {
      name: "海军",
      type: "line",
      data: [
        209, 14, 991, 24, 1238, 4, 310, 314, 1552, 5532, 7084, 49, 0, 807, 13,
        14, 37, 910, 368,
        //  1285000, 241000
      ],
      smooth: true,
      emphasis: {
        focus: "series",
      },
    },
    {
      name: "海军陆战队",
      type: "line",
      data: [
        3320, 532, 386, 29, 4267, 0, 242, 242, 4509, 1019, 5528, 252, 0, 372,
        25, 0, 6, 655, 23744,
        //  424000, 130000
      ],
      smooth: true,
      emphasis: {
        focus: "series",
      },
    },
    {
      name: "空军",
      type: "line",
      data: [
        369, 27, 103, 4, 503, 0, 154, 154, 657, 3844, 4501, 148, 0, 94, 3, 0,
        36, 281, 1576,
        // 1177000, 265000
      ],
      smooth: true,
      emphasis: {
        focus: "series",
      },
    },
  ],
};

const Table: FC<IProps> = (): ReactElement => {
  useMount(() => {
    const chartDom = document.getElementById("us_data");
    const myChart = echarts.init(chartDom!);
    option && myChart.setOption(option);
    window.addEventListener("charts_resize", (e: any) => {
      if (e.detail.key.includes("us")) {
        myChart.resize();
      }
    });
  });

  return <div id='us_data'></div>;
};

export default memo(Table);
