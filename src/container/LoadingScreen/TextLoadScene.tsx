/*
 * @Author: hongbin
 * @Date: 2022-02-28 16:26:19
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-10 10:56:52
 * @Description:TextLoadScene
 */
import { FC, memo, ReactElement, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import bg from "../../assets/bg.png";
import DataSource from "./DataSource";

interface IProps {
  progress: number;
}

const section = [
  "抗美援朝,保家卫国",
  "1950年7月10日,“中国人民反对美国侵略台湾朝鲜运动委员会”成立,抗美援朝运动自此开始.",
  "10月,中国人民志愿军赴朝作战,拉开了抗美援朝战争的序幕.",
  "在抗美援朝战争中,志愿军得到了解放军全军和中国全国人民的全力支持,得到了以苏联为首的社会主义阵营的配合.",
  "1953年7月,双方签订《朝鲜停战协定》,从此抗美援朝胜利结束.",
  "1958年,志愿军全部撤回中国.10月25日为抗美援朝纪念日.",
  "抗美援朝战争锻造形成的伟大抗美援朝精神,是弥足珍贵的精神财富.",
  "2020年10月19日,习近平强调：在新时代继承和弘扬伟大抗美援朝精神 为实现中华民族伟大复兴而奋斗.",
  "2021年9月,“抗美援朝精神”被列入党中央批准中央宣传部梳理的第一批中国共产党人精神谱系的伟大精神.",
];

const { length } = section;
/**
 * 防止内存泄漏
 */
let timer: NodeJS.Timeout;

const TextLoadScene: FC<IProps> = ({ progress }): ReactElement => {
  const [count, setCount] = useState(-1);

  useEffect(() => {
    if (count < length) {
      timer = setTimeout(() => {
        setCount(prev => prev + 1);
      }, 5500 / length + 1);
    }
  }, [count]);

  if (progress === 100) {
    clearTimeout(timer);
  }

  return (
    <Container leave={progress === 100}>
      <Background src={bg} alt='' />
      <Section>
        {section.map((text, index) => (
          <p
            style={{
              opacity: index < count ? 1 : 0,
            }}
            key={text + index}
          >
            {text}
          </p>
        ))}
      </Section>
      <DataSource />
    </Container>
  );
};

export default memo(TextLoadScene);

const up = keyframes`
0%{top:115vmin};
100%{top:13vmin};
`;

const show = keyframes`
    0%{
        opacity:0;
    }
    100%{
        opacity:1;
    }
`;

const maskShow = keyframes`
    0%{
        opacity:1;
    }
    100%{
        opacity:0.5;
    }
`;

const Background = styled.img`
  width: inherit;
  height: inherit;
  position: absolute;
  right: 0;
  bottom: 0;
  animation: ${show} 1s linear;
  animation-fill-mode: forwards;
`;

const Section = styled.div`
  position: absolute;
  line-height: 8vmin;
  animation: ${up} 6s linear;
  animation-fill-mode: forwards;
  letter-spacing: 2px;
  text-indent: 2vmax;
  width: inherit;
  z-index: 1;
  p {
    transition: opacity 1s linear;
    text-align: center;

    &:first-child {
      font-size: 2vmax;
    }
  }
`;

const leaveCss = css`
  transition: transform 1s linear, opacity 0.3s ease;
  transform: translateY(-80%);
  opacity: 0;
`;

const Container = styled.div<{ leave: boolean }>`
  width: 100vmax;
  height: 100vmin;
  background: #000;
  position: relative;
  z-index: 9;
  color: #fffae5;
  font-size: 1.5vmax;

  &::after {
    content: "";
    width: inherit;
    height: inherit;
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #000000;
    animation: ${maskShow} 9s ease;
    animation-fill-mode: forwards;
  }
  ${({ leave }) => leave && leaveCss};
  @media screen and (max-width: 750px) {
    transform: rotate(90deg);
    transform-origin: left top;
    top: 0vmax;
    left: 100vmin;
  }
`;
