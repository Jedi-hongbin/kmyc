/*
 * @Author: hongbin
 * @Date: 2022-03-21 11:37:09
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-21 22:36:48
 * @Description: 动画进度控制器
 */
import {
  createRef,
  FC,
  ReactElement,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { fadeIn, flexCenter } from "../../styled";
import { chartBG } from "../../styled/GlobalStyle";
import { animationPlayer } from "./utils";

export const AnimationConfigRef = createRef<{
  /**
   * 显示控制面板
   */
  show: () => void;
  /**
   * 隐藏控制面板
   */
  hide: () => void;
}>();

interface IProps {}

const AnimateProgressConfig: FC<IProps> = (): ReactElement => {
  const [isShow, setIsShow] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(100);

  useImperativeHandle(
    AnimationConfigRef,
    () => ({
      show: () => {
        setIsShow(true);
      },
      hide: () => {
        setIsShow(false);
      },
    }),
    []
  );

  if (!isShow) return <></>;

  return (
    <Container>
      <BackgroundBar ref={bgRef}>
        <Progress percent={percent} />
        <TimeNum
          style={{ left: percent + "%" }}
          onMouseDown={e => {
            const start = e.pageX;
            if (!bgRef.current) return;
            const bg = bgRef.current;
            const prev = percent;
            const move = (et: MouseEvent) => {
              const dis = et.pageX - start;
              // 指针位置
              const progress = (dis / bg.offsetWidth) * 100;
              const percent = prev + progress;
              if (percent < 0 || percent > 100) return;
              setPercent(percent);
              animationPlayer.setProgress(percent);
            };

            //根据移动距离 和 进度条宽度 计算位置百分比
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", move);
            });
            document.addEventListener("mouseleave", () => {
              document.removeEventListener("mousemove", move);
            });
          }}
        >
          {Math.round(percent)}
        </TimeNum>
      </BackgroundBar>
    </Container>
  );
};

export default AnimateProgressConfig;

const Progress = styled.div<{ percent: number }>`
  background-color: #8fd08d8f;
  width: ${props => props.percent + "%"};
  height: inherit;
  border-radius: inherit;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  ::after {
    content: "";
    width: 3px;
    height: 130%;
    background-color: #183017;
    display: block;
    position: absolute;
    left: ${props => props.percent + "%"};
    top: -15%;
    border-radius: 1vh;
  }
`;

const TimeNum = styled.div`
  ${flexCenter};
  background-color: #274826;
  font-size: 0.1rem;
  color: #fffae5;
  padding: 2px 10px;
  border-radius: 0.1rem;
  position: absolute;
  display: inline;
  top: 2.5vh;
  cursor: grab;
  transform: translateX(-50%);
  :active {
    cursor: grabbing;
  }
`;

const BackgroundBar = styled.div`
  width: 90%;
  margin-left: 5%;
  height: 1.5vh;
  background-color: #fafafa;
  border-radius: 0.4vh;
  margin-top: 2vh;
  position: relative;
`;

const Container = styled.div`
  position: fixed;
  width: 30vmax;
  height: 7vmin;
  ${chartBG};
  border-radius: 1vh;
  top: 5vh;
  right: 4vw;
  z-index: 9;
  animation: ${fadeIn} 0.3s linear;
`;
