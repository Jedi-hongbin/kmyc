/*
 * @Author: hongbin
 * @Date: 2022-02-06 15:39:40
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-07 14:12:46
 * @Description: 加载数据屏 获取数据后进入页面
 */
import { FC, memo, ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { flexCenter } from "../../styled";
import ProgressBar from "./ProgressBar";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//@ts-ignore
import mapModel from "../../assets/map/map.glb";
import useMount from "../../hook/useMount";
import LoadFail from "./LoadFail";

interface IProps {
  setMap: (gltf: GLTF) => void;
  addTexture: (name: string, texture: any) => void;
  handleLoad: () => void;
}

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
      //通知上级 已经ok了 可以下一步了
      handleLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  //先加载10个大面积纹理贴图
  const loadTexture = () => {
    const textureLoader = new THREE.TextureLoader();

    for (let i = 0; i < 10; i++) {
      const index = i.toString().padStart(2, "0");
      const url = `${process.env.REACT_APP_URL}${index}.jpg`;
      const texture = textureLoader.load(
        url,
        _ => {
          setProgress(prev => prev + 5);
        },
        undefined,
        err => {
          console.error("load texture fail:", err);
          setProgress(prev => prev + 5);
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
      if (progress === 100) return setProgress(prev => prev + 50 - prevModel);
      prevModel += progress / 4;
      setProgress(prev => prev + progress / 4);
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
    <Container>
      <Back leave={progress >= 100} dir='up'>
        <h6>抗美援朝</h6>
      </Back>
      <ProgressBar progress={progress} />
      <Back leave={progress >= 100} dir='down'>
        <h6>保家卫国</h6>
      </Back>
    </Container>
  );
};

export default memo(LoadingScreen);

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 9;
  & > div {
    :first-child {
      background-color: #0af;
    }
    :last-child {
      background-color: #0fa;
    }
  }
`;

const Back = styled.div<{ leave: boolean; dir: "up" | "down" }>`
  flex: 1;
  ${flexCenter};
  justify-content: ${props => (props.dir === "up" ? "flex-start" : "flex-end")};
  padding: 0 2rem;
  font-size: 10rem;
  letter-spacing: 1rem;
  text-shadow: -2px 6px 0px #168269;
  transition-property: transform;
  transition-duration: 0.7s;
  transition-timing-function: cubic-bezier(0.12, 0.04, 0.47, 1.4);
  transform: ${({ leave, dir }) =>
    leave ? `translateY(${dir === "up" ? -100 : 100}%)` : "none"};
`;
/* transform: ${props =>
  props.leave ? `translateY(${props.dir === "up" ? -85 : 100}%)` : "none"}; */