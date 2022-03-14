import { Object3D } from "three";
/*
 * @Author: hongbin
 * @Date: 2022-02-09 18:02:20
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-14 21:54:14
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

import { IAnimationConfigure, ModelType } from "./types";
// import { Scene } from "three/src/scenes/Scene";
import { Scene } from "three/src/Three";
//@ts-ignore
import axisModel from "../../assets/map/axis.glb";
//@ts-ignore
import axisTextModel from "../../assets/map/axisText.glb";

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
      nameModel.children[0].userData.type = ModelType["MXNG"];
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
          char.userData.type = ModelType["MXNG"];
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

const XCDesc = [
  [],
  [
    "11月2日，志愿军第39军一部攻克云山，重创美骑兵第一师，给恃强冒进的美军和南朝鲜军以迎头打击。图为战士们向敌阵地冲锋。",
    "1950年10月25日，志愿军先头部队在利洞、两水洞、黄草岭地区与敌遭遇，从此揭开抗美援朝战争的序幕。这是第42军指挥员在东线黄草岭阵地指挥战斗。",
    "第42军的战士们在黄草岭地区构筑工事。",
    "志愿军第38军一部向熙川方向开进。",
  ],
  [
    "1950年12月6日，中国人民志愿军收复平壤，第39军第116师战士冲入平壤市区。",
    "被志愿军俘虏的南朝鲜军的美军顾问。",
    "第38军主力穿插至敌后三所里，并迅速抢占了三所里以西的龙源里，切断了美第9军的退路。",
    "围歼新兴洞之敌战斗中，志愿军抢占制高点",
  ],
  [
    "1月3日，第50军第149师在高阳地区全歼掩护美军从汉城撤退的英第29旅皇家坦克营。图为被击毁的坦克。",
    "第66军先头部队的战士们抢占华岳山。",
    "志愿军第50军和人民军第1军团并肩作战，于1951年1月4日攻克汉城。",
    "中朝部队突破三八线向南挺进。",
  ],
  [
    "第42 军第375团1连副班长关崇贵在战斗中打退敌人多次进攻，并用轻机枪击落敌机一架，荣立特等功，获二级战斗英雄称号。",
    "在横城地区黄巨山阻击战中，志愿军某部9连坚守阵地两昼夜，打退”联合国军”十余次冲锋，荣获“黄巨山英雄连”称号。",
    "志愿军第50军第447团经过五次反冲击，夺回了白云山阵地。",
    "志愿军战士们在冰天雪地宿营。",
  ],
];

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
  /**
   * 设置不同的纹理 -- 切换图片
   */
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
    //hover tip
    instance.userData.type = ModelType["Picture"];
    instance.userData.desc = XCDesc[animationIndex][i];

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
      /**
       * hover 显示图片介绍
       */
      item.userData.type = ModelType["Picture"];
      item.userData.desc = XCDesc[nextIndex][index];

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

interface IModel {
  name: "b" | "f";
  model: Object3D;
}

/**
 * 战役数据
 */
interface CampaignData {
  /**
   * 毙敌人数 [南朝鲜，英法，美]
   */
  b: [n: number, yf: number, m: number];
  /**
   * 俘敌人数 [南朝鲜，英法，美]
   */
  f: [n: number, yf: number, m: number];
  /**
   * 图标位置
   */
  position: {
    b: [x: number, y: number];
    f: [x: number, y: number];
  };
}

const campaignData: CampaignData[] = [
  {
    b: [7584, 147, 2991],
    f: [4741, 0, 527],
    position: { b: [30, -30], f: [30, 0] },
  },
  {
    b: [5962, 116, 20867],
    f: [5568, 121, 3254],
    position: { b: [30, -30], f: [30, 0] },
  },
  {
    b: [4593, 270, 1141],
    f: [5967, 1, 366],
    position: { b: [30, 10], f: [30, 30] },
  },
  {
    b: [8861, 646, 34578],
    f: [7769, 1, 1214],
    position: { b: [30, 10], f: [30, 30] },
  },
  {
    b: [23654, 4957, 31926],
    f: [5233, 1115, 958],
    position: { b: [30, 10], f: [30, 30] },
  },
];

const columnarName = ["n", "yf", "m"];

const maxScaleY = 1.1; //最大放大倍数

export interface AxisRef {
  models: Object3D[];
  hide: () => void;
  toggle: (nextIndex: number) => void;
}

/**
 * @description: 加载战役数据柱状图模型
 * @param {number} animationNum
 * @return {*}
 */
export async function loadAxisModel(animationNum: number): Promise<AxisRef> {
  const axis = await window.gltfLoader.loadAsync(axisModel);
  const axisText = await window.gltfLoader.loadAsync(axisTextModel);
  axis.scene.position.z += 1;

  const bi = axis.scene; //毙伤敌
  const fu = axis.scene.clone(); //俘敌
  const models: IModel[] = [
    { name: "b", model: bi },
    { name: "f", model: fu },
  ];
  let prevColumnarIndex = animationNum;

  const handleModel = (animationNum: number, update?: boolean) => {
    for (let i = 0; i < models.length; i++) {
      const { name, model } = models[i];
      model.scale.set(1, 1, 1);
      const configure = campaignData[animationNum - 1];
      const data = configure[name];
      const max = Math.max(...data) / (maxScaleY - i * 0.2);

      //根据数值设置高度 也就是 y轴缩放倍数
      // eslint-disable-next-line no-loop-func
      data.forEach((num: number, index: number) => {
        const scaleY = num / max;
        const axisName = columnarName[index];
        const columnar = model.children.find(mesh => mesh.name === axisName);
        columnar!.scale.z = scaleY;
        //添加人数
        const numText = axisText.scene.children.find(
          mesh => mesh.name === `${animationNum}${axisName}${name}`
        );
        numText && model.add(numText.clone());
        if (update) {
          //去掉上一个人数
          const prevNumText = model.children.find(
            mesh => mesh.name === `${prevColumnarIndex}${axisName}${name}`
          );
          prevNumText && model.remove(prevNumText);
          console.log(prevNumText);
        }
      });
      if (!update) {
        // 添加title
        const title = axisText.scene.children.find(
          mesh => mesh.name === `${i}t`
        );
        model.add(title!);
      }

      // 设置位置
      const [x, z] = configure["position"][name];
      model.position.x = x;
      model.position.z = z;
    }
    update && (prevColumnarIndex = animationNum);
  };

  //init
  handleModel(animationNum);

  bi.scale.x += 0.3;
  bi.scale.y += 0.3;
  bi.scale.z += 0.3;

  return {
    toggle: (nextIndex: number) => handleModel(nextIndex, true),
    hide: () => {
      models.forEach(({ model }) => {
        model.scale.set(0, 0, 0);
      });
    },
    models: [bi, fu],
  };
}
