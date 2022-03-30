/*
 * @Author: hongbin
 * @Date: 2022-02-24 21:42:23
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-30 16:35:02
 * @Description:背景音乐
 */

import {
  createRef,
  FC,
  memo,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
//@ts-ignore
import music from "../assets/bgmusicshortvoume0.mp3";
//@ts-ignore
import music1 from "../assets/bgmusicshortvoume1.mp3";
import useMount from "../hook/useMount";

interface IProps {}

export const BGMusicRef = createRef<{
  /**
   * 切换音频播放状态
   */
  toggle: () => void;
  /**
   * 音频dom
   */
  audio: HTMLAudioElement | null;
}>();

const BackGroundMusic: FC<IProps> = (): ReactElement => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = useCallback(() => {
    audioRef.current!.paused
      ? audioRef.current?.play()
      : audioRef.current?.pause();
  }, []);

  useMount(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const play = () => {
      audio.play();
      window.removeEventListener("click", play);
    };
    window.addEventListener("click", play);
    window.addEventListener("keyup", e => {
      if (e.code === "KeyS") toggle();
    });

    const toggleMusicLoop = () => {
      audio.src = music1;
      audio.play();
      audio.loop = true;
      console.log("end");
      audio.removeEventListener("ended", toggleMusicLoop);
    };

    audio.addEventListener("ended", toggleMusicLoop);
  });

  useImperativeHandle(
    BGMusicRef,
    () => ({
      audio: audioRef.current,
      toggle,
    }),
    [toggle]
  );

  return (
    <audio id='bg_music' preload='load' ref={audioRef} src={music}></audio>
  );
};

export default memo(BackGroundMusic);
