/*
 * @Author: hongbin
 * @Date: 2022-02-24 21:42:23
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-25 11:28:33
 * @Description:背景音乐
 */

import { FC, ReactElement, useRef } from "react";
//@ts-ignore
import music from "../assets/bgmusicshortvoume.mp3";
import useMount from "../hook/useMount";

interface IProps {}

const BackGroundMusic: FC<IProps> = (): ReactElement => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useMount(() => {
    const play = () => {
      audioRef.current?.play();
      window.removeEventListener("click", play);
    };
    window.addEventListener("click", play);
    window.addEventListener("keyup", e => {
      if (e.code === "KeyS") {
        audioRef.current!.paused
          ? audioRef.current?.play()
          : audioRef.current?.pause();
      }
    });
  });

  return (
    <audio loop id='bg_music' preload='load' ref={audioRef} src={music}></audio>
  );
};

export default BackGroundMusic;
