/*
 * @Author: hongbin
 * @Date: 2022-02-25 12:41:30
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-06 21:18:38
 * @Description:将大量的组件内的代码写在单独文件中 Map 组件结构更清晰
 */

import * as THREE from "three";
import { AnimationClip, Object3D } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { subtitleRef } from "../../components/Subtitles";
import { detrusionChart, showCombatInfo } from "../../utils";
import {
  clickQiangAnimation,
  smallPositionAnimation,
  smallScaleAnimation,
} from "./function";
import { IAnimationConfigure } from "./types";
//@ts-ignore
import positionIcon from "../../assets/map/positionIcon.glb";

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
        time: 1500,
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
        camera: [2.5, 18, 37],
        axis: [1, 15, 31.5],
        time: 2000,
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
      } else if (selectObject.userData.type === 3) {
        showCombatInfo(selectObject.userData);
        controls.autoRotate = false;
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

export interface IPositionConfigure {
  name: string;
  position: [x: number, y: number, z: number];
  bothSides: [d: string, w: string];
  results: string;
  images?: number[];
}

const positionConfigure: IPositionConfigure[][] = [
  [
    {
      name: "两水洞,丰下洞遭遇战",
      position: [-25, 2, -23],
      bothSides: [
        "南第６师第２团第３营（加强)",
        "志第４０军第１１８师第３５４团及师侦察连、３５３团一部",
      ],
      results: "全歼南第６师第２团第３营及１个炮兵中队。",
      images: [2, 3, 4],
    },
    {
      name: "草黄龄防御战",
      position: [-3, 4, -32],
      bothSides: [
        "美陆战第１师、南第３师及南首都师一部",
        "志第４２军第１２４师、１２６师１个团，炮兵第４５团及４４团１个营，另有人民军炮兵、坦克兵各一部配合",
      ],
      results:
        "歼敌２７００余人，阻止了东线敌人进攻，粉碎了敌人迂回江界之企图，有力地配合了西线作战",
      images: [16, 6, 18],
    },
    {
      name: "龟头洞进攻战",
      position: [-22, 2, -22],
      bothSides: ["南第６、第８师各两个营", "志第４０军第１１９、１２０师"],
      results:
        "歼灭南第６、第８师各两个营的大部，俘敌４００余人，缴获榴弹炮２０余门、汽车６０余辆。",
      images: [8, 9, 10],
    },
    {
      name: "云山进攻战",
      position: [-28, 2, -20],
      bothSides: [
        "美骑兵第１师８团、南第１师１２团",
        "志第３９军，炮兵第２６、２９团及第２５团２营，高射炮兵第１团",
      ],
      results:
        "攻占云山。歼灭美骑兵第１师８团大部、南第１师１２团一部，共２０００余人。缴获敌飞机４架、击落敌机３架，击毁与缴获敌坦克２８辆、汽车１７０余辆、各种炮１１９门。",
      images: [12, 13, 14, 15, 17],
    },
    {
      name: "飞虎山防御战",
      position: [-18, 2, -20],
      bothSides: ["南第７师", "志第３８军３３５团"],
      results:
        "志愿军连续作战五昼夜，共击退敌军57次进攻. 阵地失而复得、反复争夺9次，胜利完成了任务",
      images: [1, 11, 12, 20, 21, 22, 23],
    },
  ],
  [
    {
      name: "德川进攻战斗",
      position: [-22, 4, -14],
      bothSides: ["南第７师", "志第３８军"],
      results:
        "攻占德川，歼南第７师大部，在志第４２军协同下，打开战役缺口，为第二次战役胜利，创造了有利条件。",
      images: [27, 40, 39, 26],
    },
    {
      name: "宁远、孟山进攻战斗",
      position: [-19, 5, -16],
      bothSides: ["南第８师", "志第４２军"],
      results:
        "攻占宁远、孟山，歼南第８师大部，在志第３８军协同下，打开战役缺口，为第二次战役胜利，创造了有利条件。",
      images: [38, 37, 28],
    },
    {
      name: "上九洞进攻战斗",
      position: [-24, 2, -20],
      bothSides: ["美第２５师２４团", "志第３９军３４８团及３４７团４连"],
      results: "歼敌一部，利用俘虏喊话争取美第２４团１个连（１１５人）投降。",
    },
    {
      name: "长津湖地区进攻战斗",
      position: [-10, 5, -32],
      bothSides: ["美第７师，陆战第１师各一部", "志第２７军"],
      results:
        "大部歼灭美第７师第３２团及第３１团第３营和师属炮兵１个营，重创美陆战第１师两个团，毙伤俘敌４７００余人。",
      images: [49, 50, 55, 57, 59],
    },
    {
      name: "三所里迂回战斗",
      position: [-25, 5, -13],
      bothSides: [
        "美第２５师、骑兵第１师、英第２９旅各一部",
        "志第３８军１１３师",
      ],
      results: "完成了切断敌人退路的任务，为第二次战役的胜利创造了有利条件。",
      images: [29, 32, 38, 39, 44, 48],
    },
  ],
  [
    {
      name: "高浪浦里东南地区进攻战斗",
      position: [-13, 3, 9],
      bothSides: [
        "南第１师第１１、第１２团各一部",
        "志第３９军１１６师，各种炮８６门",
      ],
      results:
        "强渡临津江，１５小时前进１２至１５公里，突破敌师预备阵地，共毙伤俘敌１０４９名，缴获各种炮４１门、各种枪３０２支（挺）。",
      images: [64, 63, 62],
    },
    {
      name: "道城岘至济宁里进攻战斗",
      position: [-2, 4, 11],
      bothSides: ["南第２师、第５师各一部", "志第４２军１２４师"],
      results:
        "突破敌道城岘防御，完成了战役迂回任务，切断了南第２师退路，协同志第６６军主力将济宁里之敌歼灭，共歼敌２７００余人，缴获各种炮９２门、各种枪１６００余支（挺）。",
      images: [65, 66, 67],
    },
    {
      name: "高阳追击战斗",
      position: [-12, 2, 14],
      bothSides: ["英第２９旅、美第２５师各一部", "志第５０军１４９师"],
      results:
        "击溃美第２５师１个营。全歼英第２９旅皇家来复枪团第１营及第８骑兵（坦克）团直属中队，俘敌１９３名，毙伤敌５００余名，缴获和击毁坦克３１辆.",
      images: [68, 69, 70],
    },
  ],
  [
    {
      name: "五音山阻击战斗",
      position: [9, 3, 17],
      bothSides: [
        "南第８师、南第３师一部及美第２师１个团并４个榴炮营",
        "志第６６军第１９８师，炮兵第２９团１个营",
      ],
      results:
        "完成了坚守阵地，迟滞南第８师于横城地区，掩护我军向横城之敌反击的任务。",
      images: [71, 72, 73],
    },
    {
      name: "汉江以南、水原以北地区防御战斗",
      position: [-8, 3, 10],
      bothSides: [
        "美第３、第２５师，英第２９旅，土耳其旅，南第１师",
        "志第５０军",
      ],
      results:
        "歼敌１．１万余人，钳制了敌主要进攻集团，有力地配合了我军在横城方向的反击作战。",
      images: [74, 75, 76],
    },
    {
      name: "汉江以南、利川以北地区防御战斗",
      position: [0, 4, 21],
      bothSides: [
        "美第２４师、骑兵第１师，英第２７旅，南第６师",
        "志第３８军，炮兵第２７团２个连",
      ],
      results:
        "歼敌１．０８万余人，钳制了敌人主要进攻集团，有力地配合了我军在横城方向的反击作战。",
      images: [77, 78, 79],
    },
    {
      name: "横城反击战役",
      position: [5.5, 3, 18],
      bothSides: [
        "美第２师一部，南第３、第５、第８师",
        "志第３９、第４０、第４２、第６６军，炮兵第１师；人民军第２、第３、第５军团",
      ],
      results:
        "歼灭南第８师３个团、美第２师１个营、美南炮兵４个营和南第３、第５师各一部，共１．２万余人，其中俘敌７８００余人",
      images: [80, 81, 35],
    },
    {
      name: "龙头里、阳德院里地区机动防御战斗",
      position: [2.5, 3, 18.5],
      bothSides: [
        "美骑兵第１师，美第２４师１个团，英第２７旅，澳大利亚营，南第６师",
        "志第４２军，炮兵第４４团、第２５团第１营",
      ],
      results:
        "歼敌近９０００人，在中元山地区至阳德院里地区防守２６天，迟滞了敌人的进攻，为我军进行第五次战役准备争取了时间。",
    },
  ],
  [
    {
      name: "加平地区进攻战斗",
      position: [-2, 4, 12],
      bothSides: ["美第２４师一部，南第６师", "志第４０军"],
      results:
        "突入敌纵深３０余公里，打开了战役缺口，在第３９军协同下，完成了战役割裂任务，歼灭美第２４师、南第６师各一部。",
      images: [82, 83, 84],
    },
    {
      name: "雪马里地区进攻战斗",
      position: [-12, 3, 10],
      bothSides: [
        "英第２９旅皇家格特斯特郡团第１营及炮兵、坦克各一部",
        "志第６３军第５６０团",
      ],
      results:
        "全歼英第２９旅皇家格特斯特郡团第１营，皇家炮兵第４５团第７０队、皇家哈萨斯第８骑兵坦克团１个连。",
      images: [89, 87, 88],
    },
    {
      name: "上南里地区进攻战斗",
      position: [4, 4, 15],
      bothSides: ["南第５、第７师", "志第２７军第８１师"],
      results:
        "切断了县里之敌西南退路，在第２０军第６０师一部配合下，歼南军５个营（３０００余人），并将南第５、第７师击溃。",
      images: [90, 91, 92],
    },
    {
      name: "五马峙迂回战斗",
      position: [2, 4, 12],
      bothSides: ["南第５、第７师各一部", "志第２０军第１７８团第２营"],
      results:
        "沿途战斗１３次，前进３０公里，攻占预定占领地区五马峙，截歼逃敌一部，毙伤俘敌２９０余名。",
      images: [95, 96, 97],
    },
    {
      name: "县里地区围歼战斗",
      position: [7, 2.2, 14],
      bothSides: ["南第３、第９师", "志第２０军"],
      results:
        "在人民军第５军团协同下，将南第３、第９师大部歼灭于县里及其以南地区",
      images: [98, 99, 100],
    },
    {
      name: "大水洞、沙五郎寺进攻战斗",
      position: [-8, 3.5, 8],
      bothSides: ["美第２师、陆战第１师", "志第１５军第４４师"],
      results: "将美第２师第３８团团部及第１、第２营大部歼灭",
      images: [101, 102, 103],
    },
  ],
];

/**
 * 加载 战役地点图标
 * @param {number} animateIndex
 */
export const loadPositionIcon = async (animateIndex: number) => {
  const gltf = await window.gltfLoader.loadAsync(positionIcon);
  if (!gltf) return console.error("加载出错 - 位置图标");

  const model = gltf.scene.children[0];
  model.userData.type = 3;
  model.scale.x -= 1.2;
  model.scale.y -= 1.2;
  model.scale.z -= 1.2;
  const config = positionConfigure[animateIndex - 1];
  const iconScene = new THREE.Scene();
  for (const { position, ...info } of config) {
    const icon = model.clone();
    icon.position.set(...position);
    Object.assign(icon.userData, info);
    iconScene.add(icon);
  }

  scene.add(iconScene);

  let timer: number;
  let i = 0;
  const r = () => {
    if (i < 15) {
      timer = requestAnimationFrame(r);
    }
    for (const item of iconScene.children) {
      item.scale.x += 0.05;
      item.scale.y += 0.05;
      item.scale.z += 0.05;
    }
    i++;
  };
  r();

  /**
   * 清楚模型
   */
  const clear = () => {
    scene.remove(iconScene);
    cancelAnimationFrame(timer);
  };

  return { clear };
};
/**
 * 空格键 切换控制器暂停
 */
window.addEventListener("keyup", e => {
  if (e.code === "Space") {
    controls.autoRotate = !controls.autoRotate;
  }
});
