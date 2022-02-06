/*
 * @Author: hongbin
 * @Date: 2022-02-06 09:15:57
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-06 20:50:12
 * @Description: three.js 和 glt模型 朝鲜地图模块
 */
import { FC, ReactElement, useEffect } from "react";
import { AnimationClip, AnimationObjectGroup, Event, Object3D } from "three";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IAnimationConfigure } from "./types";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

interface IProps {
  gltf: GLTF;
  textures: { [key: string]: THREE.Texture };
}

const Map: FC<IProps> = ({ gltf, textures }): ReactElement => {
  useEffect(() => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const container = document.querySelector("#kmyc_canvas");
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.autoClear = false;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // renderer.shadowMap.enabled = true;
    // gbl格式 不加颜色变暗
    renderer.outputEncoding = THREE.sRGBEncoding;
    container?.appendChild(renderer.domElement);
    // Scene
    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x112134, 0.01);

    scene.add(new THREE.AxesHelper(50));
    scene2.add(new THREE.AxesHelper(20));

    // const textureLoader = new THREE.TextureLoader();
    // scene2.background = textureLoader.load('https://api.hongbin.xyz:3002/kmyc/gridbg.jpg');

    // const textures: { [key: string]: Texture } = {};
    // for (let i = 0; i < 33; i++) {
    //   const index = i.toString().padStart(2, "0");
    //   const url = `https://api.hongbin.xyz:3002/kmyc/${index}.jpg`;
    //   const texture = textureLoader.load(url);
    //   texture.flipY = false;
    //   texture.encoding = THREE.sRGBEncoding;
    //   textures[`${index}`] = texture;
    // }

    const sun = new THREE.PointLight(0xffffff, 2, 100);
    sun.position.set(12, 5, 10);
    scene.add(sun);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const animationNum = 5;

    for (const mash of gltf.scene.children) {
      const texture = textures[mash.name];
      console.log("texture:", texture);

      if (texture) {
        // @ts-ignore
        mash.material = new THREE.MeshBasicMaterial({ map: texture });
      }
    }
    scene.add(gltf.scene);

    //  加载完地图模型  加载 作战箭头动画
    //   gltfLoader.load(
    //       `map/${animationNum}-animate.glb`,
    //       (gltf:any) => {
    //           console.log(gltf);
    //           gltf.animations.forEach((animate:any) => {
    //               const { name } = animate;//不算后面的 Action
    //               const mash = gltf.scene.getObjectByProperty('name', name.substring(0, name.length - 6));
    //               if (mash) {
    //                   onesAnimate(mash, animate)
    //               }
    //           });
    //           scene.add(gltf.scene)
    //       }, undefined, (e) => {
    //           console.error('错了', e);
    //       })

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

    const configure = animationConfigure[animationNum - 1];

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

    //摄像机位置
    camera.position.set(...configure.camera);
    controls.target.set(...configure.axis);
    //坐标轴位置

    if (configure.jump) {
      for (const { time, camera, axis, speed } of configure.jump) {
        setTimeout(() => {
          move(camera, axis, speed);
        }, time);
      }
    }
    //结束动画 开启自动旋转
    if (configure.end) {
      setTimeout(() => {
        move(configure.end.camera, configure.end.axis, configure.end.speed);
        controls.autoRotate = true;
      }, configure.end.duration);
    }

    const tick = () => {
      // const elapsed = clock.getElapsedTime()
      renderer.render(scene2, camera2);
      renderer.render(scene, camera);
      // sun.position.x = Math.cos(elapsedTime)
      window.requestAnimationFrame(tick);
      // camera.rotateZ(elapsed * 0.001)
      controls.update();
    };

    tick();

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
          requestAnimationFrame(r);
          count++;
          controls.update();
        }
      };
      r();
    }
  }, []);

  return <div id='kmyc_canvas'></div>;
};

export default Map;

//=> end中的axis相机的轨道 y值必须小不能大于5 否则自由移动时相机下不去，无法获得更小的视野
const animationConfigure: IAnimationConfigure[] = [
  {
    camera: [-18, 20, -4],
    axis: [-19, 3, -27],
    //镜头跳转
    jump: [
      {
        time: 6000,
        camera: [6, 17, -5],
        axis: [3, 12, -8],
        speed: 20,
      },
      {
        time: 8000,
        camera: [-15, 20, -3],
        axis: [-14, 15, -8],
        speed: 20,
      },
    ],
    end: {
      duration: 10000,
      camera: [-15, 14, -15],
      axis: [-12, 4, -35],
      speed: 25,
    },
  },
  {
    camera: [-24, 15, -2],
    axis: [-22, 10, -10],
    //镜头跳转
    jump: [
      {
        time: 5500,
        camera: [-8, 12, -25],
        axis: [-7, 11, -28],
        speed: 20,
      },
      {
        time: 7500,
        camera: [-10, 20, 30],
        axis: [-9, 15, 0],
        speed: 30,
      },
    ],
    end: {
      duration: 10000,
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
        time: 3000,
        camera: [0, 18, 31.5],
        axis: [-1.5, 15, 26],
        speed: 40,
      },
      {
        time: 7000,
        camera: [8, 18, 30],
        axis: [6.6, 15, 24],
        speed: 50,
      },
    ],
    end: {
      duration: 8000,
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
        time: 2000,
        camera: [2.5, 18, 37],
        axis: [1, 15, 31.5],
        speed: 40,
      },
      {
        time: 3000,
        camera: [0.8, 20, 31],
        axis: [-0.6, 15, 27],
        speed: 50,
      },
    ],
    end: {
      duration: 7500,
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
        time: 4000,
        camera: [-1.4, 18, 23],
        axis: [-2, 15, 18.4],
        speed: 40,
      },
      {
        time: 8000,
        camera: [7, 18, 22],
        axis: [6, 15, 17],
        speed: 50,
      },
    ],
    end: {
      duration: 12000,
      camera: [-4, 20, 14],
      axis: [-4.3, 5, 12],
      speed: 50,
    },
  },
];

function init() {}

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
