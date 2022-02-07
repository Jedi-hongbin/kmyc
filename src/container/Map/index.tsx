/*
 * @Author: hongbin
 * @Date: 2022-02-06 09:15:57
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-07 20:23:30
 * @Description: three.js 和 glt模型 朝鲜地图模块
 */
import { FC, memo, ReactElement, useEffect, useRef } from "react";
import { AnimationClip, AnimationObjectGroup, Event, Object3D } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IAnimationConfigure } from "./types";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "three/examples/jsm/libs/stats.module";
//@ts-ignore
const stats = new Stats();

interface IProps {
  animateIndex: number;
  gltf: GLTF;
  textures: { [key: string]: THREE.Texture };
}
// cancelAnimationFrame  requestAnimationFrame
let t: number;
//动画计时器数组 用于清除未执行的动画和定时任务
let timers: NodeJS.Timeout[] = [];

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.autoClear = false;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.shadowMap.enabled = true;
// gbl格式 不加颜色变暗
renderer.outputEncoding = THREE.sRGBEncoding;

// Scene
const scene = new THREE.Scene();
const scene2 = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x112134, 0.01);

scene.add(new THREE.AxesHelper(50));
scene2.add(new THREE.AxesHelper(20));

const textureLoader = new THREE.TextureLoader();
// scene2.background = textureLoader.load(
//   `${process.env.REACT_APP_URL}gridbg.jpg`
// );

const sun = new THREE.PointLight(0xffffff, 2, 100);
sun.position.set(12, 5, 10);
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Base camera
const camera = new THREE.PerspectiveCamera(
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
//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
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
controls.minDistance = -Infinity;
controls.maxDistance = 400;
//可旋转角度
controls.maxPolarAngle = Math.PI / 2.2;
camera.position.set(0, 400, 0);
controls.target.set(0, 0, 0);

/**
 * 不缓存加载过的模型是因为有动画不好处理,在动画未结束时移除模型,下次添加模型会保持离开时的关键帧
 */

const Map: FC<IProps> = ({ gltf, textures, animateIndex }): ReactElement => {
  const cacheModel = useRef<GLTF>(null); //保存上一个战役模型

  useEffect(() => {
    if (animateIndex) {
      loadCampaignModel(animateIndex);
    }
    return () => {
      const gltf = cacheModel.current;
      //清除当前的战役模型
      gltf && scene.remove(gltf.scene);
      clearAnimateTimer();
    };
  }, [animateIndex]);

  useEffect(() => {
    const container = document.querySelector("#kmyc_canvas");
    console.log(container?.children);
    if (container?.children.length) return;
    if (gltf) {
      console.log("gltf:", gltf);
      container?.appendChild(renderer.domElement);
      document.documentElement.appendChild(stats.dom);
      move([0, 93, -5], [0, 10, -5], 50);
      //加载其他地图纹理
      for (let i = 10; i < 33; i++) {
        const url = `${process.env.REACT_APP_URL}${i}.jpg`;
        const texture = textureLoader.load(url);
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        textures[i] = texture;
      }

      for (const mash of gltf.scene.children) {
        const texture = textures[mash.name];
        if (texture) {
          // @ts-ignore
          mash.material = new THREE.MeshBasicMaterial({ map: texture });
        }
      }
      scene.add(gltf.scene);

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

      const tick = () => {
        // const elapsed = clock.getElapsedTime()
        renderer.render(scene2, camera2);
        renderer.render(scene, camera);
        // sun.position.x = Math.cos(elapsedTime)
        window.requestAnimationFrame(tick);
        // camera.rotateZ(elapsed * 0.001)
        controls.update();
        stats && stats.update();
      };

      tick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf]);

  /**加载战役模型*/
  const loadCampaignModel = (animateIndex: number) => {
    window.gltfLoader.load(
      `${process.env.REACT_APP_URL}map/${animateIndex}-animate.glb`,
      (gltf: any) => {
        console.log("战役模型:", gltf);
        start(gltf, animateIndex);
        //@ts-ignore
        cacheModel.current = gltf;
      },
      undefined,
      e => {
        alert("战役模型加载出错");
        console.error("战役模型加载出错", e);
      }
    );
  };

  return <div id='kmyc_canvas'></div>;
};

export default memo(Map);

//=> end中的axis相机的轨道 y值必须小不能大于5 否则自由移动时相机下不去，无法获得更小的视野
const animationConfigure: IAnimationConfigure[] = [
  {
    camera: [-18, 20, -4],
    axis: [-19, 3, -27],
    //镜头跳转
    jump: [
      {
        time: 4000,
        camera: [6, 17, -5],
        axis: [3, 12, -8],
        speed: 30,
      },
      {
        time: 6000,
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
  },
];

//  不再 tick 每一帧调用  大部分动画只调用一遍
function onesAnimate(
  mash: Object3D<Event> | AnimationObjectGroup,
  animate: AnimationClip
) {
  const mixer = new THREE.AnimationMixer(mash);
  const action = mixer.clipAction(animate);
  //TODO: 解决ts-ignore
  // @ts-ignore
  action.setLoop(THREE.LoopOnce);
  action.play();
  // console.log(action.time)
  const clip = action.getClip();
  // console.log("clip.time")
  const duration = clip.duration;
  // console.log(clip.duration)
  const clock = new THREE.Clock();
  let sum = 0;

  //循环更新
  const run = () => {
    if (sum > duration) return;
    window.requestAnimationFrame(run);
    const t = clock.getDelta();
    sum += t;
    // console.log(sum);
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
 * @return {void}
 */
function move(targetCamera: number[], targetAxis: number[], speed = 16) {
  // const targetCamera = [-10, 20, 26];
  // const targetAxis = [-9, 17, 0];

  const diffCamera: typeof targetCamera = [];
  const diffAxis: typeof targetAxis = [];

  for (let i = 0; i < 3; i++) {
    const key = String.fromCharCode(120 + i) as "x" | "y" | "z";
    diffCamera.push(distance(camera.position[key], targetCamera[i]));
    diffAxis.push(distance(controls.target[key], targetAxis[i]));
  }

  let count = 0;
  const r = () => {
    if (count < speed) {
      camera.position.x += diffCamera[0] / speed;
      camera.position.y += diffCamera[1] / speed;
      camera.position.z += diffCamera[2] / speed;

      controls.target.x += diffAxis[0] / speed;
      controls.target.y += diffAxis[1] / speed;
      controls.target.z += diffAxis[2] / speed;
      t = requestAnimationFrame(r);
      count++;
      // controls.update();
    }
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
      onesAnimate(mash, animate);
    }
  });
}

/**视线移动*/
function sightMove(animateIndex: number) {
  const configure = animationConfigure[animateIndex - 1];

  //移动到摄像机位置
  move(configure.camera, configure.axis, 40);

  //战役动画
  if (configure.jump) {
    for (const { time, camera, axis, speed } of configure.jump) {
      const timer = setTimeout(() => {
        move(camera, axis, speed);
      }, time);
      timers.push(timer);
    }
  }
  //结束动画 开启自动旋转
  if (configure.end) {
    const timer = setTimeout(() => {
      move(configure.end.camera, configure.end.axis, configure.end.speed);
      controls.autoRotate = true;
    }, configure.end.duration);
    timers.push(timer);
  }
}
/**
 * @description: 设置战役模型动画和实现动画
 * @param {GLTF} model
 * @param {number} animateIndex
 * @return {*}
 */
function start(model: GLTF, animateIndex: number) {
  play(model);
  scene.add(model.scene);
  sightMove(animateIndex);
  controls.autoRotate = false;
}

function clearAnimateTimer() {
  cancelAnimationFrame(t);
  for (const timer of timers) {
    clearTimeout(timer);
  }
  timers = [];
}
