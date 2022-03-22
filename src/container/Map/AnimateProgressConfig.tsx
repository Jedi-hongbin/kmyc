/*
 * @Author: hongbin
 * @Date: 2022-03-21 11:37:09
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-22 17:24:37
 * @Description: 动画进度控制器
 */
import {
  createRef,
  FC,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Pause, Play } from "../../components/icon";
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
  /**
   * 开始播放动画和音频
   */
  play: () => void;
  /**
   * 停止播放动画和音频
   */
  stop: () => void;
}>();

interface IProps {}

const AnimateProgressConfig: FC<IProps> = (): ReactElement => {
  const [isShow, setIsShow] = useState(false);
  const [isPlay, setIsPlay] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(100);

  useEffect(() => {
    if (isPlay) {
      animationPlayer.play(percent => {
        setPercent(percent);
        if (percent > 100) setIsPlay(false);
      });
    } else {
      animationPlayer.stop();
    }
  }, [isPlay]);

  useImperativeHandle(
    AnimationConfigRef,
    () => ({
      show: () => {
        setIsShow(true);
      },
      hide: () => {
        setIsShow(false);
        setPercent(100);
      },
      play: () => {
        setIsShow(true);
      },
      stop: () => {
        setIsShow(false);
      },
    }),
    []
  );

  if (!isShow) return <></>;

  return (
    <Container>
      <IconButton onClick={() => percent < 100 && setIsPlay(state => !state)}>
        {isPlay ? Pause : Play}
      </IconButton>
      <BackgroundBar ref={bgRef}>
        {/* @ts-ignore */}
        <Progress style={{ "--percent": percent + "%" }} />
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
              animationPlayer.setProgress(percent + 0.05);
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

const Progress = styled.div`
  /* background-color: #8fd08dc2; */
  background: linear-gradient(183deg, #6bf567e6, #56ba5491);
  width: var(--percent);
  height: inherit;
  border-radius: inherit;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  ::before {
    content: "";
    width: 3px;
    height: 130%;
    background-color: #183017;
    display: block;
    position: absolute;
    left: 0;
    top: -15%;
    border-radius: 1vh;
  }
  ::after {
    content: "";
    width: 3px;
    height: 130%;
    background-color: #183017;
    display: block;
    position: absolute;
    left: var(--percent);
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
  flex: 1;
  margin: 0 7% 0 2%;
  height: 1.5vh;
  background-color: #fafafa;
  border-radius: 0.4vh;
  margin-top: -1vh;
  position: relative;
  ::before {
    content: "";
    position: absolute;
    left: 0.4vh;
    transform: translateX(-100%);
    width: 10px;
    height: inherit;
    top: 0;
    background-color: #345438;
    border-top-left-radius: 0.2vh;
    border-bottom-left-radius: 0.2vh;
    border-right: 2px solid #183017;
  }
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
  display: flex;
  align-items: center;
  padding: 0 1%;
  max-width: 600px;
`;

const IconButton = styled.div`
  cursor: pointer;
  width: 3vw;
  height: 3vw;
  transform: translateX(-0.5vw);
  ${flexCenter};
  svg {
    transform: scale(1, 1.4);
    width: 1.5vw;
    height: 1.5vw;
    path {
      fill: #fffae5;
    }
  }
`;
