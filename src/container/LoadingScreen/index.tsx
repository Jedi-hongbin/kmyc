/*
 * @Author: hongbin
 * @Date: 2022-02-06 15:39:40
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-06 21:34:31
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
  setMap: React.Dispatch<React.SetStateAction<GLTF | null>>;
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
    console.log("progress:", progress);
    if (progress === 100) {
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
  let prevModel = 0;
  const dracoLoader = () => {
    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {
      console.log("地图模型加载完毕!");
    };
    manager.onProgress = async (_, loaded, total) => {
      const progress = Math.floor((loaded / total) * 100);
      if (progress === 100) {
        setProgress(prev => prev + 50 - prevModel);
      } else {
        prevModel += progress / 4;
        setProgress(prev => prev + progress / 4);
      }
    };
    manager.onError = str => {
      console.error("load err:", str);
      setIsLoadFail(str);
    };

    const dracoLoader = new DRACOLoader(manager);
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.setDecoderPath(process.env.REACT_APP_URL as string);
    const gltfLoader = new GLTFLoader(manager);
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(mapModel, gltf => {
      setMap(gltf);
    });

    window.gltfLoader = gltfLoader;
  };

  if (isLoadFail) return <LoadFail errMsg={isLoadFail} />;

  return (
    <Container>
      <Back leave={progress === 100} dir='up'>
        <h6>抗美援朝</h6>
      </Back>
      <ProgressBar progress={progress} />
      <Back leave={progress === 100} dir='down'>
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
