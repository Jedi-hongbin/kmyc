/*
 * @Author: hongbin
 * @Date: 2022-02-24 21:42:23
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-19 23:51:46
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
import music from "../assets/bgmusicshortvoume.mp3";
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
    const play = () => {
      audioRef.current?.play();
      window.removeEventListener("click", play);
    };
    window.addEventListener("click", play);
    window.addEventListener("keyup", e => {
      if (e.code === "KeyS") toggle();
    });
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
    <audio loop id='bg_music' preload='load' ref={audioRef} src={music}></audio>
  );
};

export default memo(BackGroundMusic);
