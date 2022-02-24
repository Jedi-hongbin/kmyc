/*
 * @Author: hongbin
 * @Date: 2022-02-23 18:13:44
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-24 12:02:09
 * @Description:文本加载条
 */
import { FC, ReactElement, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import bg from "../../assets/bg.png";

interface IProps {
  progress: number;
}

const textArr = [
  "",
  "1950年7月10日，“中国人民反对美国侵略台湾朝鲜运动委员会”成立，抗美援朝运动自此开始。",
  "10月，中国人民志愿军赴朝作战，拉开了抗美援朝战争的序幕。",
  "在抗美援朝战争中，志愿军得到了解放军全军和中国全国人民的全力支持，得到了以苏联为首的社会主义阵营的配合。",
  "1953年7月，双方签订《朝鲜停战协定》，从此抗美援朝胜利结束。",
  "1958年，志愿军全部撤回中国。10月25日为抗美援朝纪念日。",
  "抗美援朝战争锻造形成的伟大抗美援朝精神，是弥足珍贵的精神财富。",
  "2020年10月19日，习近平强调：在新时代继承和弘扬伟大抗美援朝精神 为实现中华民族伟大复兴而奋斗。",
  "2021年9月，“抗美援朝精神”被列入党中央批准中央宣传部梳理的第一批中国共产党人精神谱系的伟大精神。",
  "",
];

const { length } = textArr;
const percent = 100 / length;

const TextLoadBar: FC<IProps> = ({ progress }): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < length) {
      setTimeout(() => {
        setCount(prev => prev + 1);
      }, 200);
    }
  }, [count]);

  return (
    <>
      {textArr.map((text, index) => (
        <Column
          leave={progress === 100}
          key={text + index}
          range={index * percent}
          index={index}
        >
          <Background src={bg} alt='' />
          {/* {count > index ? <Text>{text}</Text> : null} */}
        </Column>
      ))}
    </>
  );
};

export default TextLoadBar;

const animation = keyframes`
    0%{
        opacity:0;
        width: 0;
    }
    100%{
        opacity:1;
        width: 100%;
    }
`;

const Text = styled.p`
  color: #fffae5;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: ${percent + "vmin"};
  /* text-align: center; */
  position: absolute;
  font-size: 1.2vmax;
  top: 0;
  left: 0;
  z-index: 10;
  animation: ${animation} 0.9s ease;
  width: 100%;
  padding-left: 3vmax;
  transition: background 0.3s ease;
  :hover {
    background: #00000099;
  }
`;

const Column = styled.div<{ index: number; leave: boolean; range: number }>`
  width: 100vmax;
  height: ${percent + "vmin"};
  position: absolute;
  z-index: 9;
  top: ${props => props.range + "%"};
  overflow: hidden;
  background-color: #2d2d2d;
  /* transition: transform 0.5s cubic-bezier(0.64, -0.4, 0.32, 0.46), */
  transition: transform 0.5s ease, opacity 0.1s linear;
  transition-delay: ${({ index }) => index / 20 + "s"};

  ::after {
    content: "";
    position: absolute;
    width: inherit;
    height: inherit;
    background-color: #000000;
    opacity: 0.8;
  }

  img {
    transform: ${props => `translateY(${90 - props.range}vmin)`};
  }

  ${({ leave, index }) =>
    leave &&
    css`
      opacity: 0;
      transform: ${index % 2 === 0
        ? "translate(-100%,-100%)"
        : "translate(100%,100%)"};
      @media screen and (max-width: 750px) {
        transform: ${index % 2 === 0
          ? "rotate(90deg) translate(-100%,-100%)"
          : "rotate(90deg) translate(100%,100%)"};
      }
    `}
  @media screen and (max-width: 750px) {
    transform: rotate(90deg);
    transform-origin: left top;
    top: 0vmax;
    left: ${props => `${100 - props.range}vmin`};
  }
`;

const Background = styled.img`
  width: 100vmax;
  height: 100vmin;
  position: absolute;
  right: 0;
  bottom: 0;

  /* @media screen and (max-width: 750px) {
    transform: rotate(90deg) translateY(100vmin);
    transform-origin: right bottom;
  } */
`;
