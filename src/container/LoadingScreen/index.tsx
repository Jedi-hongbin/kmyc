/*
 * @Author: hongbin
 * @Date: 2022-02-06 15:39:40
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-25 20:36:37
 * @Description: 加载数据屏 获取数据后进入页面
 */
import { FC, ReactElement, useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//@ts-ignore
import mapModel from "../../assets/map/tmap.glb";
import useMount from "../../hook/useMount";
import LoadFail from "./LoadFail";
import TextLoadBar from "./TextLoadBar";
import { detrusionChart } from "../../utils";

interface IProps {
  // setMap: (gltf: GLTF) => void;
  setMap: React.Dispatch<React.SetStateAction<GLTF | undefined>>;
  addTexture: (name: string, texture: any) => void;
  handleLoad: () => void;
}
//刚进入页面的时间
const enterTime = Date.now();

const LoadingScreen: FC<IProps> = ({
  setMap,
  addTexture,
  handleLoad,
}): ReactElement => {
  const [progress, setProgress] = useState(0);
  const [isLoadFail, setIsLoadFail] = useState("");

  useMount(() => {
    dracoLoader();
    loadTexture();
  });

  useEffect(() => {
    if (progress >= 100) {
      //留一小点时间执行动画
      setTimeout(() => {
        detrusionChart(false);
      }, 200);
      //2s 将文字概述播放完

      //有缓存的情况下加载时间<2s 让其执行完再进入页面
      setTimeout(() => {
        handleLoad();
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  /**
   * 进度增长检测 不准4s内加载完成
   * @param {number} increase 增长的数值
   * @param {number} prev state原本数值
   * @return {number} newValue
   */
  const timeCheck = (increase: number) => (prev: number) => {
    if (increase + prev < 100) return prev + increase;
    // >= 100 检测时间
    if (Date.now() - enterTime > 3500) return 100;
    //time < 3500
    setTimeout(() => {
      setProgress(100);
    }, 3500 - (Date.now() - enterTime));

    return prev;
  };

  //先加载10个大面积纹理贴图
  const loadTexture = () => {
    const textureLoader = new THREE.TextureLoader();

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
      texture.encoding = THREE.sRGBEncoding;
      addTexture(index, texture);
    }
  };
  //模型加载占50% 当前大小会返回 33 66 100 三次进度加载回调，如果文件变大需要更改完善此段代码
  const dracoLoader = () => {
    let prevModel = 0;
    const manager = new THREE.LoadingManager();
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
      <TextLoadBar progress={progress} />
      {/* <Container>
      </Container> */}
    </>
  );
};

export default LoadingScreen;

// const Container = styled.div`
//   width: 100vmax;
//   height: 100vmin;
//   position: fixed;
//   top: 0;
//   left: 0;
//   display: flex;
//   flex-direction: column;
//   z-index: 9;
//   background: radial-gradient(#060606f0, #000000 90%);
//   overflow: hidden;
//   opacity: 0.9;

//   @media screen and (max-width: 750px) {
//     transform: rotate(90deg) translateY(-100vmin);
//     transform-origin: top left;
//   }
// `;
