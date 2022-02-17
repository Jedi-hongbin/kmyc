/*
 * @Author: hongbin
 * @Date: 2022-02-17 15:36:35
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-17 19:54:46
 * @Description:战役字幕
 */
import {
  FC,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  createRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";
//@ts-ignore
import music from "../../assets/k.mp3";
import useMount from "../../hook/useMount";

const subtitleArr = [
  "10月25日，志愿军发起战役，以1个军的主力配合朝鲜人民军在东线进行阻击，集中5个军另1个师于西线给“联合国军”以突然性打击，将其从鸭绿江边驱逐到清川江以南，挫败了“联合国军”企图在感恩节（11月23日）前占领全朝鲜的计划，初步稳定了朝鲜战局。第一次战役志愿军共歼敌15000多人。",
  "11月24日，“联合国军”发起旨在圣诞节结束朝鲜战争的总攻势。志愿军按预定计划，将“联合国军”诱至预定地区后，立即发起反击，给以出其不意的打击。“联合国军”兵败于西部战线的清川江两岸和东部战线的长津湖畔，被迫弃平壤、元山，分从陆路、海路退至“三八线”以南。第二次战役志愿军共歼敌36000多人。",
  "志愿军集中6个军，在人民军3个军团协同下，对依托“三八线”既设阵地进行防御的“联合国军”发起全线进攻，将其从“三八线”击退至北纬37°线附近地区，占领韩国首都汉城（今首尔），并适时停止了战役追击。第三次战役共歼敌19000多人。",
  "第一阶段以一部兵力在西部战线顽强抗击，集中6个军在东部战线横城地区实施反击，但未能打破“联合国军”主要方向上的进攻。第二阶段，为了以空间换取时间，掩护后续兵团到达，遂在全线转入运动防御，抗击消耗“联合国军”。3月14日，中朝人民军队撤出汉城。4月21日，将“联合国军”扼制在“三八线”南北附近地区。第四次战役志愿军虽有较大损失，但仍歼敌7.8万多人",
  "首先集中志愿军11个军和人民军1个军团于西线实施主要突击，再次越过“三八线”，直逼汉城；接着，志愿军又转移兵力于东线，后，中朝人民军队向北转移，至6月10日，战线稳定在“三八线”南北地区。第五次战役志愿军共歼敌8万多人。",
];

export const subtitleRef =
  createRef<{ start: (index: number) => void; hide: () => void }>();

interface IProps {}

const Subtitles: FC<IProps> = (): ReactElement => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [subtitle, setSubtitle] = useState("");
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useMount(() => {
    window.addEventListener("blur", () => {
      audioRef.current?.pause();
    });
  });

  useEffect(() => {
    if (!subtitleIndex) return;
    if (audioRef.current) {
      audioRef.current.play();
      audioRef.current.volume = 0.3;
      //   audioRef.current!.playbackRate = 2;
    }
    const subtitle = subtitleArr[subtitleIndex - 1];
    const { length } = subtitle;
    let i = 0;
    const fill = () => {
      if (i < length - 1) {
        i++;
        setSubtitle(subtitle.substr(0, i));
        setTimeout(() => {
          fill();
        }, 80);
      } else {
        audioRef.current?.pause();
      }
    };
    fill();
    return () => {
      setSubtitle("");
    };
  }, [subtitleIndex]);

  const start = useCallback((index: number) => {
    setSubtitleIndex(index);
  }, []);

  useImperativeHandle(
    subtitleRef,
    () => ({
      start,
      hide: () => {
        setSubtitle("");
        audioRef.current?.pause();
      },
    }),
    [start]
  );

  return (
    <>
      {subtitle ? <Container>{subtitle}</Container> : null}
      <audio ref={audioRef} preload='load' loop src={music}></audio>
    </>
  );
};

export default memo(Subtitles);

const Container = styled.div`
  position: fixed;
  z-index: 1;
  bottom: 5vh;
  /* height: 15vh; */
  width: 60vw;
  margin-left: 20vw;
  /* background: radial-gradient(#355235d1, #437143 90%); */
  background: radial-gradient(#35523587, #4371438c 90%);
  border-radius: 0.5rem;
  padding: 0.4rem;
  color: #fffae5;
  letter-spacing: 1px;
  font-size: 0.5rem;
  display: flex;
`;
