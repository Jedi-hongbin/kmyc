/*
 * @Author: hongbin
 * @Date: 2022-02-25 12:41:30
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-28 21:53:57
 * @Description:将大量的组件内的代码写在单独文件中 Map 组件结构更清晰
 */

import * as THREE from "three";
import { AnimationClip, Object3D } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { subtitleRef } from "../../components/Subtitles";
import { detrusionChart } from "../../utils";
import {
  clickQiangAnimation,
  smallPositionAnimation,
  smallScaleAnimation,
} from "./function";
import { IAnimationConfigure } from "./types";

// cancelAnimationFrame  requestAnimationFrame
let t: number;
//动画计时器数组 用于清除未执行的动画和定时任务
let timers: NodeJS.Timeout[] = [];

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.autoClear = false;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// gbl格式 不加颜色变暗
renderer.outputEncoding = THREE.sRGBEncoding;
// Scene
export const scene = new THREE.Scene();
const scene2 = new THREE.Scene();
scene.background = new THREE.Color(0x345438);
scene.fog = new THREE.FogExp2(0x345438, 0.008);

export const textureLoader = new THREE.TextureLoader();

const sun = new THREE.PointLight(0xffffff, 2, 100);
sun.position.set(12, 5, 10);
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Base camera
export const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
); //视野能看 多近 1 多远 设置1000
const camera2 = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
); //视野能看 多近 1 多远 设置1000
scene.add(camera);
scene2.add(camera2);

export const render = () => {
  renderer.render(scene2, camera2);
  renderer.render(scene, camera);
};

//轨道控制器
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.screenSpacePanning = false;
controls.enableKeys = true;
controls.keyPanSpeed = 10;
// 更改鼠标操作 拖拽 缩放 旋转
controls.mouseButtons = {
  LEFT: THREE.MOUSE.PAN,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE,
};
controls.minDistance = 5;
controls.maxDistance = 250;
//可旋转角度
controls.maxPolarAngle = Math.PI / 2.2;

//移动端让地图‘横’过来
if (window.isPhone) {
  // scene.rotateX(3.14);
  // scene.rotateY(3.14);
  // scene.rotateZ(3.14 / 2);
  camera.position.set(10, 74, 0);
  controls.target.set(9, 10, 0);
} else {
  camera.position.set(30, 180, 0);
  controls.target.set(30, 0, 0);
}

export const tick = () => {
  // const elapsed = clock.getElapsedTime()
  render();
  // sun.position.x = Math.cos(elapsedTime)
  window.requestAnimationFrame(tick);
  // camera.rotateZ(elapsed * 0.001)
  controls.update();
  // stats && stats.update();
};

//=> end中的axis相机的轨道 y值必须小不能大于5 否则自由移动时相机下不去，无法获得更小的视野
export const animationConfigure: IAnimationConfigure[] = [
  {
    camera: [-18, 20, -4],
    axis: [-19, 3, -27],
    //镜头跳转
    jump: [
      {
        time: 5000,
        camera: [6, 17, -5],
        axis: [3, 12, -8],
        speed: 30,
      },
      {
        time: 6500,
        camera: [-15, 20, -3],
        axis: [-14, 15, -8],
        speed: 30,
      },
    ],
    end: {
      duration: 9000,
      camera: [-15, 14, -15],
      axis: [-12, 4, -35],
      speed: 35,
    },
    icon: [-21, 7, -22],
  },
  {
    camera: [-24, 15, -2],
    axis: [-22, 10, -10],
    //镜头跳转
    jump: [
      {
        time: 4500,
        camera: [-8, 12, -25],
        axis: [-7, 11, -28],
        speed: 20,
      },
      {
        time: 6500,
        camera: [-10, 20, 30],
        axis: [-9, 15, 0],
        speed: 30,
      },
    ],
    end: {
      duration: 9000,
      camera: [-9, 15, -10],
      axis: [-10, 4, -25],
    },
    icon: [-26, 7, -12],
  },
  {
    camera: [-2, 20, 19.5],
    axis: [-2.5, 15, 17],
    //镜头跳转
    jump: [
      {
        time: 2000,
        camera: [0, 18, 31.5],
        axis: [-1.5, 15, 26],
        speed: 40,
      },
      {
        time: 6000,
        camera: [8, 18, 30],
        axis: [6.6, 15, 24],
        speed: 50,
      },
    ],
    end: {
      duration: 7000,
      camera: [1.5, 18, 39],
      axis: [0, 5, 14],
      speed: 50,
    },
    icon: [-5, 7, 2],
  },
  {
    camera: [-2, 20, 19.5],
    axis: [-2.5, 15, 17],
    jump: [
      {
        time: 1000,
        camera: [2.5, 18, 37],
        axis: [1, 15, 31.5],
        speed: 40,
      },
      {
        time: 2000,
        camera: [0.8, 20, 31],
        axis: [-0.6, 15, 27],
        speed: 50,
      },
    ],
    end: {
      duration: 6500,
      camera: [-8, 21, 7.5],
      axis: [-8.5, 5, 6.3],
      speed: 50,
    },
    icon: [7, 7, 18],
  },
  {
    camera: [-2, 20, 19.5],
    axis: [-2.5, 15, 17],
    jump: [
      {
        time: 3000,
        camera: [-1.4, 18, 23],
        axis: [-2, 15, 18.4],
        speed: 40,
      },
      {
        time: 7000,
        camera: [7, 18, 22],
        axis: [6, 15, 17],
        speed: 50,
      },
    ],
    end: {
      duration: 11000,
      camera: [-4, 20, 14],
      axis: [-4.3, 5, 12],
      speed: 50,
    },
    icon: [4.5, 7, 12],
  },
];

//  不再 tick 每一帧调用  大部分动画只调用一遍
export function onesAnimate(mash: Object3D<Event>, animate: AnimationClip) {
  const mixer = new THREE.AnimationMixer(mash);
  const action = mixer.clipAction(animate);
  //TODO: 解决ts-ignore
  // @ts-ignore
  action.setLoop(THREE.LoopOnce);
  action.play();
  const clip = action.getClip();
  const duration = clip.duration;
  const clock = new THREE.Clock();
  let sum = 0;

  //循环更新
  const run = () => {
    if (sum > duration) return;
    window.requestAnimationFrame(run);
    const t = clock.getDelta();
    sum += t;
    mixer.update(t);
  };
  run();
}

function distance(x1: number, x2: number) {
  //都是负数  -3 => -5 = -2
  if (x1 < 0 && x2 < 0) {
    return (x2 * -1 - x1 * -1) * -1;
  }
  return x2 - x1;
}

/**
 * @description: 视野切换动画
 * @param {number[]} targetCamera 目标位置的相机位置
 * @param {number[]} targetAxis 目标位置的坐标轴位置
 * @param {number} speed 速度
 * @param {() => void} every 每一帧都执行的函数
 * @param {() => void} onEnd 结束动画执行
 * @return {void}
 */
export function move(
  targetCamera: number[],
  targetAxis: number[],
  speed = 16,
  every?: () => void,
  onEnd?: () => void
) {
  // const targetCamera = [-10, 20, 26];
  // const targetAxis = [-9, 17, 0];
  const max = speed - 1;
  const diffCamera: typeof targetCamera = [];
  const diffAxis: typeof targetAxis = [];

  for (let i = 0; i < 3; i++) {
    const key = String.fromCharCode(120 + i) as "x" | "y" | "z";
    diffCamera.push(distance(camera.position[key], targetCamera[i]));
    diffAxis.push(distance(controls.target[key], targetAxis[i]));
  }

  let count = 0;
  const r = () => {
    if (count < max) {
      camera.position.x += diffCamera[0] / speed;
      camera.position.y += diffCamera[1] / speed;
      camera.position.z += diffCamera[2] / speed;

      controls.target.x += diffAxis[0] / speed;
      controls.target.y += diffAxis[1] / speed;
      controls.target.z += diffAxis[2] / speed;
      t = requestAnimationFrame(r);
      count++;
      // controls.update();
      every && every();
    } else onEnd && onEnd();
  };
  r();
}

/**
 * @description 添加模型的动画
 * @param {GLTF} gltf 带动画的glb模型
 * */
function play(gltf: GLTF) {
  gltf.animations.forEach((animate: any) => {
    const { name } = animate; //不算后面的 Action
    const mash = gltf.scene.getObjectByProperty(
      "name",
      name.substring(0, name.length - 6)
    );
    if (mash) {
      onesAnimate(mash as Object3D<Event>, animate);
    }
  });
}

/**视线移动*/
function sightMove(animateIndex: number, onEnd?: () => void) {
  const configure = animationConfigure[animateIndex - 1];
  if (window.isPhone) {
    subtitleRef.current?.start(animateIndex);
  }
  //移动到摄像机位置
  else
    move(configure.camera, configure.axis, 40, undefined, () => {
      //字幕慢点出来 和动画一起跟新dom引起卡顿
      subtitleRef.current?.start(animateIndex);
    });

  //战役动画 pc端才播放
  if (configure.jump && !window.isPhone) {
    for (const { time, camera, axis, speed } of configure.jump) {
      const timer = setTimeout(() => {
        move(camera, axis, speed);
      }, time);
      timers.push(timer);
    }
  }
  //结束动画 开启自动旋转 执行回调
  if (configure.end) {
    const timer = setTimeout(() => {
      !window.isPhone &&
        move(configure.end.camera, configure.end.axis, configure.end.speed);
      controls.autoRotate = true;
      onEnd && onEnd();
    }, configure.end.duration);
    timers.push(timer);
  }
}
/**
 * @description: 设置战役模型动画和实现动画
 * @param {GLTF} model
 * @param {number} animateIndex
 * @param {() => void } onEnd 动画结束执行回调
 * @return {*}
 */
export function start(model: GLTF, animateIndex: number, onEnd: () => void) {
  play(model);
  scene.add(model.scene);
  sightMove(animateIndex, onEnd);
  controls.autoRotate = false;
  detrusionChart(true);
}

export function clearAnimateTimer() {
  cancelAnimationFrame(t);
  for (const timer of timers) {
    clearTimeout(timer);
  }
  timers = [];
}

/**
 * @description: 画底部纵横相交的网格线
 */
export const drawLine = () => {
  const material = new THREE.LineBasicMaterial({
    color: 0x172619,
  });

  for (let i = 0; i <= 100; i++) {
    const points = [];
    points.push(new THREE.Vector3(-150, 0, (i - 50) * 3));
    points.push(new THREE.Vector3(150, 0, (i - 50) * 3));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    line.userData.type = 0;
    scene.add(line);
  }
  for (let i = 0; i <= 100; i++) {
    const points = [];
    points.push(new THREE.Vector3((i - 50) * 3, 0, -150));
    points.push(new THREE.Vector3((i - 50) * 3, 0, 150));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    line.userData.type = 0;
    scene.add(line);
  }
};

// 声明 raycaster 和 mouse 变量
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let prevDate = Date.now();
//hover监听
/**
 * @description:  事件监听
 * @param {any} selectAnimation
 * @return {*}
 */
export const eventListener = (selectAnimation: any) => {
  renderer.domElement.addEventListener("mousemove", event => {
    event.preventDefault();
    // 截流减少计算
    if (Date.now() - prevDate < 150) return;
    prevDate = Date.now();
    const intersects = getIntersects(event);
    // 获取选中最近的 Mesh 对象
    if (intersects.length) {
      const selectObject = intersects[0].object;
      //地图模块不处理
      if (selectObject.userData.type === 0) return;
      //38线 两个mash hover效果怪异
      if (selectObject!.parent!.name.match(/38line/)) {
        if (!selectObject!.parent?.userData.animation)
          smallPositionAnimation(selectObject!.parent!);
      }
      //莫辛纳甘枪模型
      else if (selectObject.userData.type === 1) {
        hoverIcon(selectObject);
      }
      //其他模型
      else if (!selectObject.userData.animation) {
        smallScaleAnimation(selectObject);
      }
    }
  });
  //战役图标hover事件
  const hoverIcon = (selectObject: Object3D) => {
    const { parent } = selectObject;
    const parentData = parent!.userData;
    //文本scene && 枪scene没在动
    if (parentData.text && !parent!.parent!.children[0].userData.animation) {
      smallScaleAnimation(parent!.parent!.children[0]);
    }
    //枪scene没在动 && 不是文本scene
    else if (!parentData.animation && !parentData.text) {
      smallScaleAnimation(parent!);
    }
    //单独一把枪
    else if (!parentData.text && !selectObject.userData.animation) {
      smallScaleAnimation(selectObject);
    }
  };

  const getIntersects = (event: { clientX: number; clientY: number }) => {
    // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    raycaster.setFromCamera(mouse, camera);

    // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
    var intersects = raycaster.intersectObjects(scene.children);

    //返回选中的对象
    return intersects;
  };

  renderer.domElement.addEventListener("click", event => {
    event.preventDefault();
    const intersects = getIntersects(event);
    // 获取选中最近的 Mesh 对象
    if (intersects.length) {
      const selectObject = intersects[0].object;
      //莫辛纳甘枪图标
      if (selectObject.userData.type === 1) {
        // 默认点击的是枪 mode指向两把枪的容器scene
        let { parent: model } = selectObject;
        //如果点击的是文字 则指到枪scene
        model!.userData.text && (model = model!.parent!.children[0]);

        if (!model!.userData.click) {
          clickQiangAnimation(model!, () => {
            const { index } = model?.userData as { index: number };
            if (index) selectAnimation(index);
            else alert("未获取到战役索引");
          });
        }
      }
    }
  });

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};
