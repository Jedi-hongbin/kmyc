/*
 * @Author: hongbin
 * @Date: 2022-02-09 18:02:20
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-09 21:28:21
 * @Description:Map中用到的函数 方法移这里来 减少index的代码量
 */
//@ts-ignore
import QiangModel from "../../assets/map/qiang.glb";
//@ts-ignore
import nameModel from "../../assets/map/name.glb";
//@ts-ignore
import textModel from "../../assets/map/text.glb";

import { IAnimationConfigure } from "./types";
// import { Scene } from "three/src/scenes/Scene";
import { Scene } from "three/src/Three";
import { log } from "console";

export function loadMXNGModel(
  material: THREE.Material,
  animationConfigure: IAnimationConfigure[],
  scene: THREE.Scene
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

export function clickQiangAnimation(
  mash: THREE.Object3D,
  onComplete?: () => void
) {
  mash.userData.click = true;
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
      console.log("complete");
      mash.userData.click = false;
      onComplete && onComplete();
    }
  };
  animate();
}
