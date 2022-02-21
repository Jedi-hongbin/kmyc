import { Object3D } from "three";
/*
 * @Author: hongbin
 * @Date: 2022-02-09 18:02:20
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-21 17:29:28
 * @Description:Map中用到的函数 方法移这里来 减少index的代码量
 */
//@ts-ignore
import QiangModel from "../../assets/map/qiang.glb";
//@ts-ignore
import nameModel from "../../assets/map/name.glb";
//@ts-ignore
import textModel from "../../assets/map/text.glb";
//@ts-ignore
import xcModel from "../../assets/map/xc.glb";

import { IAnimationConfigure } from "./types";
// import { Scene } from "three/src/scenes/Scene";
import { Scene } from "three/src/Three";

/**
 * @description: 加载枪械图标
 */
export function loadMXNGModel(
  material: THREE.Material,
  animationConfigure: IAnimationConfigure[],
  scene: THREE.Scene,
  cacheModel: Object3D[]
) {
  window.gltfLoader.load(QiangModel, gltf => {
    const icon = gltf.scene;
    const left = icon.children[0];
    left.userData.type = 1;
    //@ts-ignore
    left.material = material;

    const right = left.clone();
    left.rotateZ(Math.PI / 5);
    left.rotateX(Math.PI / 9);
    right.rotateZ(-Math.PI / 5);
    right.rotateX(-Math.PI / 9);
    right.rotateY(Math.PI);
    right.position.x = 2.5;
    left.position.x += 0.5;
    icon.add(right);
    icon.position.y -= 1;

    icon.add(right);

    window.gltfLoader.load(nameModel, name => {
      const nameModel = name.scene;
      nameModel.children[0].userData.type = 1;
      nameModel.userData.text = true;
      window.gltfLoader.load(textModel, text => {
        for (let index = 0; index < 5; index++) {
          const Qiang = new Scene();
          const iconItem = icon.clone();
          iconItem.userData.index = index + 1;
          const nameItem = nameModel.clone();
          const char = text.scene.children.find(
            mash => mash.name === String(index + 1)
          )!;
          char.position.z = 0;
          char.userData.type = 1;
          nameItem.add(char);
          Qiang.add(iconItem, nameItem);
          Qiang.position.set(...animationConfigure[index].icon);
          scene.add(Qiang);
          //嫌图标太大了遮挡进军路线 手动缩小
          Qiang.scale.x -= 0.41;
          Qiang.scale.y -= 0.41;
          Qiang.scale.z -= 0.41;
          Qiang.position.y = 5;
          //暴露给外边 直接控制
          cacheModel.push(Qiang);
        }
      });
    });
  });
}

/**
 * @description: 小幅度的缩放动画
 * @param {THREE} mash 传入three模型
 * @return {void}
 */
export function smallScaleAnimation(mash: THREE.Object3D) {
  mash.userData.animation = true;
  const f = 0.02;
  let count = 0;
  const speed = 20;
  const half = speed / 2;
  const animate = () => {
    if (count < half) {
      mash.scale.x += f;
      mash.scale.y += f;
      mash.scale.z += f;
      mash.position.y += f;
    } else {
      mash.scale.x -= f;
      mash.scale.y -= f;
      mash.scale.z -= f;
      mash.position.y -= f;
    }
    if (count < speed - 1) {
      count++;
      requestAnimationFrame(animate);
    } else {
      mash.userData.animation = false;
    }
  };
  animate();
}

/**
 * @description: 点击枪模型的动画
 * @param {*} 枪的容器
 * @return {void} void
 */
export function clickQiangAnimation(
  mash: THREE.Object3D,
  onComplete?: () => void
) {
  mash.userData.click = true;
  onComplete && onComplete();
  const [l, r] = mash.children;

  const angle = 0.03;
  const dis = 0.06;
  let count = 0;
  const speed = 20;
  const half = speed / 2;
  const max = speed - 1;

  const animate = () => {
    if (count < half) {
      l.rotateZ(angle);
      l.position.x -= dis;
      r.rotateZ(angle);
      r.position.x += dis;
    } else {
      l.rotateZ(-angle);
      l.position.x += dis;
      r.rotateZ(-angle);
      r.position.x -= dis;
    }
    if (count < max) {
      count++;
      requestAnimationFrame(animate);
    } else {
      mash.userData.click = false;
    }
  };
  animate();
}

/**
 * @description: 按scale隐藏模型
 * @param {THREE} mash
 * @return {*}
 */
export function hideMash(mash: THREE.Object3D) {
  const { x, y, z } = mash.scale;
  //记录留show调用用
  mash.userData.prevScale = { x, y, z };
  const range = 10;
  let i = 0;
  const run = () => {
    if (i < range - 1) requestAnimationFrame(run);
    mash.scale.x -= x / range;
    mash.scale.y -= y / range;
    mash.scale.z -= z / range;
    i++;
  };

  run();
}
/**
 * @description: 按scale显示模型 在hideMash后调用
 * @param {THREE} mash
 * @return {*}
 */
export function showMash(mash: THREE.Object3D) {
  const { prevScale } = mash.userData;
  if (!prevScale)
    return console.error(
      "没有需要的prevScale字段 需要在调用过hideMash后调用此方法",
      mash
    );
  const { x, y, z } = prevScale;

  const range = 10;
  let i = 0;
  const run = () => {
    if (i < range) requestAnimationFrame(run);
    mash.scale.x += x / range;
    mash.scale.y += y / range;
    mash.scale.z += z / range;
    i++;
  };

  run();
}

export function smallPositionAnimation(mash: Object3D) {
  mash.userData.animation = true;
  const range = 0.01;
  const count = 20;
  const half = count / 2;
  const max = count - 1;
  let i = 0;

  const run = () => {
    if (i < max) requestAnimationFrame(run);
    else mash.userData.animation = false;
    if (i < half) mash.position.y += range;
    else mash.position.y -= range;
    i++;
  };

  run();
}

export interface XCBack {
  models: Object3D[];
  show: () => void;
  hide: () => void;
  /**
   * @description:  切换下一场战役的相册纹理
   * @param {number} nextIndex
   */
  toggle: (nextIndex: number) => void;
}

/**
 * @description: 加载相册模型 返回相关操作回调
 * @param {number} animationIndex 战役索引
 * @param {THREE.TextureLoader} textureLoader 纹理加载器
 * @return {XCBack} XCBack
 */
export async function loadXCModel(
  animationIndex: number,
  textureLoader: THREE.TextureLoader
): Promise<XCBack> {
  const gltf = await window.gltfLoader.loadAsync(xcModel);
  const [model] = gltf.scene.children;
  const multiple = 5;
  model.position.y = 1.8 * multiple;

  if (animationIndex === 1) {
    model.rotateY(-Math.PI / 2);
    model.rotateX(-Math.PI / 10);
    model.rotateZ(Math.PI / 10);
  }

  const setZero = (mash: typeof model) => {
    mash.scale.x = 0;
    mash.scale.y = 0;
    mash.scale.z = 0;
  };
  setZero(model);

  const setMaterial = (mash: Object3D, url: string) => {
    const texture = textureLoader.load(url);
    texture.flipY = false;
    texture.encoding = 3001;
    //@ts-ignore
    const mater = mash.material.clone(); //不能共用一个material 以为 instance.material 指向的都是同一个对象
    mater.map = texture;
    //@ts-ignore
    mash.material = mater;
  };

  const pictures: XCBack["models"] = [];

  for (let i = 0; i < 4; i++) {
    const instance = model.clone();
    setMaterial(
      instance,
      `${process.env.REACT_APP_URL}xc/${animationIndex}-${i}-y.jpg`
    );
    if (animationIndex === 1) {
      instance.position.x = (i - 1) * -5 * multiple;
      instance.position.z = -14 * multiple;
    } else if (animationIndex === 2) {
      instance.position.x = -10 * multiple;
      instance.position.z = (i - 2) * 5 * multiple;
    } else {
      instance.position.x = -10 * multiple;
      instance.position.z = (i - 1) * 5 * multiple;
    }
    pictures.push(instance);
  }

  let timer1: number;
  let count = 0;
  const range = 30;
  const show = () => {
    if (count < range) {
      pictures.forEach(item => {
        item.scale.y += multiple / range;
        item.scale.z += (multiple / range) * 1.8;
        item.scale.x += multiple / range / 10;
      });
      count++;
      timer1 = requestAnimationFrame(show);
    }
  };

  const hide = () => {
    pictures.forEach(setZero);
    count = 0;
    cancelAnimationFrame(timer1);
    requestAnimationFrame(() => {
      cancelAnimationFrame(timer1);
    });
  };

  let prevIndex = animationIndex;

  const toggle: XCBack["toggle"] = nextIndex => {
    pictures.forEach((item, index) => {
      setMaterial(
        item,
        `${process.env.REACT_APP_URL}xc/${nextIndex}-${index}-y.jpg`
      );
      //旋转角度
      if (nextIndex === 1) {
        if (prevIndex !== 1) {
          item.rotateY(-Math.PI / 2);
          item.rotateX(-Math.PI / 10);
          item.rotateZ(Math.PI / 10);
        }
      } else {
        if (prevIndex === 1) {
          item.rotateY(Math.PI / 2);
          item.rotateX(Math.PI / 10);
          item.rotateZ(Math.PI / 10);
        }
      }
      //位置
      if (nextIndex === 1) {
        item.position.x = (index - 1) * -5 * multiple;
        item.position.z = -14 * multiple;
      } else if (nextIndex === 2) {
        item.position.x = -10 * multiple;
        item.position.z = (index - 2) * 5 * multiple;
      } else {
        item.position.x = -10 * multiple;
        item.position.z = (index - 1) * 5 * multiple;
      }
    });
    prevIndex = nextIndex;
  };

  return {
    show,
    hide,
    models: pictures,
    toggle,
  };
}
