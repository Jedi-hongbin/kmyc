/*
 * @Author: hongbin
 * @Date: 2022-02-17 15:36:35
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-16 14:53:48
 * @Description:战役字幕
 */
import {
  FC,
  memo,
  ReactElement,
  useCallback,
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
  "志愿军与联合国军遭遇，第四十军在温井两水洞重创南朝鲜军第一第六师。第三十军在云山歼灭开过元勋师1800余人。42军主力在黄草岭，赴战岭阻敌北进，此役歼敌1.5万余人。迫使敌军从鸭绿江边撤至清川江以南",
  "志愿军将联合国军贻误至战场，而后突然发起反击，第三十八军113师穿插至三所里，龙源里断敌退路，西线敌军被迫全线撤逃。东线第20，27军在长津湖地区冒着严寒全歼美第七师三十二团，重伤美陆战一师。此役歼敌3.6万余人，将战线推至三八线",
  "联合国军34万人在三八线及其以南地区组织防御，志愿军六个军共31万余人在人民军三个军团的协助下突破敌人防线，攻占汉城，此战歼敌1.9万余人。联合国军被迫迁址北纬37度线附近",
  "中朝一线部队28万余人集结于汉城高阳金华地区休战，联合国军出动13万余人在全县发起进攻，彭德怀决定西点东反，集中六个军发起横城反击战，随后中朝军队全面转入运动防御，主动撤出汉城，此役歼敌7.8万余人。将联合国军遏制在38线南北附近地区",
  "志愿军十一个军和人民军一个军团向涟川，汶山方向实施主动突击，再次越过38线直逼汉城，随后志愿军移兵力于东线，对县里的南朝鲜军予已歼灭性打击。6月10日中朝军队将联合国军阻于汶山，高浪浦里，铁原，金化，杨口，明波里一带，敌我形成对峙。此役歼敌8.2万余人，联合国军被迫接受停战谈判",
];

export const subtitleRef =
  createRef<{ start: (index: number) => void; hide: () => void }>();

interface IProps {}

let timerId: NodeJS.Timeout;

const Subtitles: FC<IProps> = (): ReactElement => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [subtitle, setSubtitle] = useState("");

  useMount(() => {
    //离开当前标签页 音乐停止
    window.addEventListener("blur", () => {
      audioRef.current?.pause();
    });
  });

  const start = useCallback((index: number) => {
    if (audioRef.current) {
      audioRef.current.play();
      audioRef.current.volume = 0.3;
      //   audioRef.current!.playbackRate = 2;
    }
    const subtitle = subtitleArr[index - 1];
    const { length } = subtitle;
    let i = 0;
    // const dom = document.getElementById("aaa");
    const fill = () => {
      if (i < length - 1) {
        i++;
        setSubtitle(subtitle.substr(0, i));
        // dom!.innerText = subtitle.substr(0, i);
        timerId = setTimeout(() => {
          fill();
        }, 80);
      } else {
        audioRef.current?.pause();
      }
    };
    fill();
  }, []);

  useImperativeHandle(
    subtitleRef,
    () => ({
      start,
      hide: () => {
        setSubtitle("");
        clearTimeout(timerId);
        setTimeout(() => {
          setSubtitle(() => "");
          clearTimeout(timerId);
        }, 100);
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
  bottom: 5vmin;
  /* height: 15vh; */
  width: 60vmax;
  margin-left: 20vmax;
  /* background: radial-gradient(#355235d1, #437143 90%); */
  background: radial-gradient(#35523566, #4371436e 90%);
  border-radius: 0.5rem;
  padding: 0.4rem;
  color: #fffae5;
  letter-spacing: 1px;
  font-size: 0.85vmax;
  opacity: 0.8;
  display: flex;
  ${props => props.theme.replaceBg};

  @media screen and (max-width: 750px) {
    transform: rotate(90deg);
    transform-origin: top left;
    margin: 0;
    left: 12vmax;
    top: 20vmax;
    height: 11vmax;
  }
`;
