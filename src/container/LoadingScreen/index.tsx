/*
 * @Author: hongbin
 * @Date: 2022-02-06 15:39:40
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-10 10:12:41
 * @Description: 加载数据屏 获取数据后进入页面
 */
import { FC, ReactElement, useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//@ts-ignore
import mapModel from "../../assets/map/tmap.glb";
import useMount from "../../hook/useMount";
import LoadFail from "./LoadFail";
import { detrusionChart } from "../../utils";
import TextLoadScene from "./TextLoadScene";
import styled from "styled-components";
import { Jump } from "../../components/icon";
import { flexCenter } from "../../styled";
import { LoadingManager, sRGBEncoding, TextureLoader } from "three";

interface IProps {
  setMap: React.Dispatch<React.SetStateAction<GLTF | undefined>>;
  addTexture: (name: string, texture: any) => void;
  handleLoad: () => void;
}
//刚进入页面的时间
const enterTime = Date.now();
const maxLoadTime = 8000; //最多8秒展示文字动画
let timer: NodeJS.Timeout;

const LoadingScreen: FC<IProps> = ({
  setMap,
  addTexture,
  handleLoad,
}): ReactElement => {
  const [progress, setProgress] = useState(0);
  const [isLoadFail, setIsLoadFail] = useState("");
  const [isCanJump, setIsCanJump] = useState(false);

  useMount(() => {
    // dracoLoader();
    loadTexture();
  });

  useEffect(() => {
    if (progress >= 100) {
      //留一小点时间执行动画
      setTimeout(() => {
        detrusionChart(false);
      }, 200);
      handleLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  /**
   * 进度增长检测
   * @param {number} increase 增长的数值
   * @param {number} prev state原本数值
   * @return {number} newValue
   */
  const timeCheck = (increase: number) => (prev: number) => {
    if (increase + prev < 100) return prev + increase;
    // >= 100 检测时间
    if (Date.now() - enterTime > maxLoadTime) return 100;
    //time < maxLoadTime
    timer = setTimeout(() => {
      setProgress(100);
    }, maxLoadTime - (Date.now() - enterTime));
    //显示跳过按钮
    setIsCanJump(true);
    return prev;
  };

  //先加载10个大面积纹理贴图
  const loadTexture = () => {
    const textureLoader = new TextureLoader();

    for (let i = 0; i < 10; i++) {
      const index = i.toString().padStart(2, "0");
      const url = `${process.env.REACT_APP_URL}q/${i}.jpg`;
      const texture = textureLoader.load(
        url,
        _ => {
          setProgress(timeCheck(5));
        },
        undefined,
        err => {
          console.error("load texture fail:", err);
          setProgress(timeCheck(5));
        }
      );
      texture.flipY = false;
      texture.encoding = sRGBEncoding;
      addTexture(index, texture);
    }
  };
  //模型加载占50% 当前大小会返回 33 66 100 三次进度加载回调，如果文件变大需要更改完善此段代码
  const dracoLoader = () => {
    let prevModel = 0;
    const manager = new LoadingManager();
    manager.onProgress = (_, loaded, total) => {
      const progress = Math.floor((loaded / total) * 100);
      if (progress === 100) return setProgress(timeCheck(50 - prevModel));
      prevModel += progress / 4;
      setProgress(timeCheck(progress / 4));
    };
    //设置错误信息
    manager.onError = setIsLoadFail;
    //创建draco解析器
    const dracoLoader = new DRACOLoader(manager);
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.setDecoderPath(process.env.REACT_APP_URL as string);
    // gltf 加载器
    const gltfLoader = new GLTFLoader(manager);
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(mapModel, setMap);
    //不带LoadingManager的加载器 如果使用gltfLoader会触发事件改变progress状态造成内存泄漏
    const normalGltfLoader = new GLTFLoader();
    normalGltfLoader.setDRACOLoader(dracoLoader);
    window.gltfLoader = normalGltfLoader;
  };

  if (isLoadFail) return <LoadFail errMsg={isLoadFail} />;

  return (
    <>
      <ToJump
        style={{
          opacity: progress === 100 ? 0 : isCanJump ? 1 : 0,
        }}
        onClick={() => {
          clearTimeout(timer);
          setProgress(100);
        }}
      >
        跳过 {Jump}
      </ToJump>
      <TextLoadScene progress={progress} />
    </>
  );
};

export default LoadingScreen;

const ToJump = styled.div`
  position: absolute;
  top: 2vmax;
  right: 3vmax;
  z-index: 10;
  color: #fffae5;
  font-size: 1.5vmax;
  cursor: pointer;
  transition: opacity 0.2s linear;
  ${flexCenter};
  svg {
    transition: transform 0.3s cubic-bezier(0.45, -0.53, 0.85, 1.06);
    width: 2vmax;
    height: 2vmax;
  }
  :hover {
    svg {
      transform: translateX(1vmin);
    }
  }
  @media screen and (max-width: 750px) {
    transform-origin: right bottom;
    transform: rotate(89deg);
    top: 96vmax;
    right: 8vmin;
  }
`;
