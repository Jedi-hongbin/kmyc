import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap';
// require('./lib/three.min');
require('./lib/GLTFLoader');
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const scene2 = new THREE.Scene()
// scene.background = 0x112134;
scene.fog = new THREE.FogExp2(0x112134, 0.01);
// Draco loader
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderConfig({ type: "js" });
// dracoLoader.setDecoderPath('draco/');
// GLTF loader
const gltfLoader = new THREE.GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

scene.add(new THREE.AxesHelper(50));
scene2.add(new THREE.AxesHelper(20));

const textureLoader = new THREE.TextureLoader()
// scene2.background = textureLoader.load('https://api.hongbin.xyz:3002/kmyc/gridbg.jpg');

const textures = {}
for (let i = 0; i < 33; i++) {
    const index = i.toString().padStart(2, '0');
    const url = `https://api.hongbin.xyz:3002/kmyc/${index}.jpg`;
    const texture = textureLoader.load(url);
    texture.flipY = false;
    texture.encoding = THREE.sRGBEncoding;
    textures[`${index}`] = texture;
}

// const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
// dirLight1.position.set(-10, 30, -10);
// scene.add(dirLight1);
// scene2.add(dirLight1);
const sun = new THREE.PointLight(0xffffff, 2, 100);
sun.position.set(12, 5, 10);
scene.add(sun);
// scene2.add(sun);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// scene2.add(ambientLight);
//动画对应的配置
//=> end中的axis相机的轨道 y值必须小不能大于5 否则自由移动时相机下不去，无法获得更小的视野
const animationConfigure = [
    {
        camera: [-18, 20, -4],
        axis: [-19, 3, -27],
        //镜头跳转
        jump: [
            {
                time: 6000,
                camera: [6, 17, -5],
                axis: [3, 12, -8],
                speed: 20

            },
            {
                time: 8000,
                camera: [-15, 20, -3],
                axis: [-14, 15, -8],
                speed: 20
            },
        ],
        end: {
            duration: 10000,
            camera: [-15, 14, -15],
            axis: [-12, 4, -35],
            speed: 25
        }
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
                speed: 20
            },
            {
                time: 7500,
                camera: [-10, 20, 30],
                axis: [-9, 15, 0],
                speed: 30
            },
        ],
        end: {
            duration: 10000,
            camera: [-9, 15, -10],
            axis: [-10, 4, -25],
        }
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
                speed: 40

            },
            {
                time: 7000,
                camera: [8, 18, 30],
                axis: [6.6, 15, 24],
                speed: 50
            },
        ],
        end: {
            duration: 8000,
            camera: [1.5, 18, 39],
            axis: [0, 5, 14],
            speed: 50
        }
    },
    {
        camera: [-2, 20, 19.5],
        axis: [-2.5, 15, 17],
        jump: [
            {
                time: 2000,
                camera: [2.5, 18, 37],
                axis: [1, 15, 31.5],
                speed: 40

            },
            {
                time: 3000,
                camera: [0.8, 20, 31],
                axis: [-0.6, 15, 27],
                speed: 50
            },
        ],
        end: {
            duration: 7500,
            camera: [-8, 21, 7.5],
            axis: [-8.5, 5, 6.3],
            speed: 50
        }
    },
    {
        camera: [-2, 20, 19.5],
        axis: [-2.5, 15, 17],
        jump: [
            {
                time: 4000,
                camera: [-1.4, 18, 23],
                axis: [-2, 15, 18.4],
                speed: 40
            },
            {
                time: 8000,
                camera: [7, 18, 22],
                axis: [6, 15, 17],
                speed: 50
            },
        ],
        end: {
            duration: 12000,
            camera: [-4, 20, 14],
            axis: [-4.3, 5, 12],
            speed: 50
        }
    },
]

const animationNum = 5;

gltfLoader.load(
    'map/map.glb',
    (gltf) => {
        console.log(gltf);
        //将模型绑定到动画混合器里面
        //同时将这个外部模型的动画全部绑定到动画混合器里面
        for (const mash of gltf.scene.children) {
            const texture = textures[mash.name];
            if (texture) {
                mash.material = new THREE.MeshBasicMaterial({ map: texture })
            }
        }
        scene.add(gltf.scene)

        //  加载完地图模型  加载 作战箭头动画
        gltfLoader.load(
            `map/${animationNum}-animate.glb`,
            (gltf) => {
                console.log(gltf);
                gltf.animations.forEach((animate) => {
                    const { name } = animate;//不算后面的 Action
                    const mash = gltf.scene.getObjectByProperty('name', name.substring(0, name.length - 6));
                    if (mash) {
                        onesAnimate(mash, animate)
                    }
                });
                scene.add(gltf.scene)
            }, undefined, (e) => {
                console.error('错了', e);
            })
    }, (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded'), xhr;
    }
    , (e) => {
        console.error('啊出错了', e)
    }
)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)//视野能看 多近 1 多远 设置1000
const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)//视野能看 多近 1 多远 设置1000
scene.add(camera)
scene2.add(camera2)

const configure = animationConfigure[animationNum - 1];

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
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
controls.target.set(...configure.axis)
//坐标轴位置

if (configure.jump) {
    for (const { time, camera, axis, speed } of configure.jump) {
        setTimeout(() => {
            move(camera, axis, speed);
        }, time)
    }
}
//结束动画 开启自动旋转
if (configure.end) {
    setTimeout(() => {
        move(configure.end.camera, configure.end.axis, configure.end.speed);
        controls.autoRotate = true;
    }, configure.end.duration)
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.autoClear = false;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.shadowMap.enabled = true;
// gbl格式 不加颜色变暗
renderer.outputEncoding = THREE.sRGBEncoding;
/**
 * Animate
 */
// const clock = new THREE.Clock();
const tick = () => {
    // const elapsed = clock.getElapsedTime()
    renderer.render(scene2, camera2)
    renderer.render(scene, camera)
    // sun.position.x = Math.cos(elapsedTime)
    window.requestAnimationFrame(tick)
    // camera.rotateZ(elapsed * 0.001)
    controls.update()
}

tick()


//  不再 tick 每一帧调用  大部分动画只调用一遍

function onesAnimate(mash, animate) {
    const mixer = new THREE.AnimationMixer(mash);
    const action = mixer.clipAction(animate);
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
        window.requestAnimationFrame(run)
        const t = clock.getDelta();
        sum += t;
        // console.log(sum);
        mixer.update(t);
    }
    run();
}
const panel = document.querySelector('#panel')
function listenClickToPanel(select, callback) {
    const btn = document.createElement('button');
    panel.appendChild(btn);
    btn.innerText = select;
    btn.onclick = callback;
}
listenClickToPanel('0.2', () => {
    val = 0.2
})
listenClickToPanel('-0.2', () => {
    val = -0.2
})
listenClickToPanel('LOG', () => {
    // console.log(camera, controls);
    console.log(camera.rotation, camera);
    console.log(`camera.position: \n${camera.position.x} \n${camera.position.y} \n${camera.position.z}`);
    // console.log(`controls.target: \n${controls.target.x} \n${controls.target.y} \n${controls.target.z}`);
    console.log(controls?.target);
})

listenClickToPanel('Position-X', () => {
    gsap.to(camera.position, {
        x: val,
        duration: 1,
        ease: 'easeIn',
    })
})
listenClickToPanel('Position-Y', () => {
    gsap.to(camera.position, {
        y: val,
        duration: 1,
        ease: 'easeOut',
    })
})
listenClickToPanel('Position-Z', () => {
    gsap.to(camera.position, {
        z: val,
        duration: 1,
        ease: 'easeOut',

    })
})
//调试输入框
const input = document.querySelector("#input");
var val = 0;
input.onchange = (e) => {
    val = Number(e.target.value)
}
const inputx = document.querySelector("#inputx");
var valx = 0;
inputx.onchange = (e) => {
    valx = Number(e.target.value)
}
const inputy = document.querySelector("#inputy");
var valy = 0;
inputy.onchange = (e) => {
    valy = Number(e.target.value)
}
const inputz = document.querySelector("#inputz");
var valz = 0;
inputz.onchange = (e) => {
    valz = Number(e.target.value)
}

listenClickToPanel('AXIS MOVE', () => {
    const { x, y, z } = camera.position;
    move([x, y, z], [valx, valy, valz]);
})

listenClickToPanel('CAMERA MOVE', () => {
    const { x, y, z } = controls.target;
    move([valx, valy, valz], [x, y, z]);
})

function distance(x1, x2) {
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
function move(targetCamera, targetAxis, speed = 16) {
    // const targetCamera = [-10, 20, 26];
    // const targetAxis = [-9, 17, 0];

    const diffCamera = [];
    const diffAxis = [];

    for (let i = 0; i < 3; i++) {
        diffCamera.push(distance(camera.position[String.fromCharCode(120 + i)], targetCamera[i]))
        diffAxis.push(distance(controls.target[String.fromCharCode(120 + i)], targetAxis[i]))
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
            controls.update()
        }
    }
    r();
}

listenClickToPanel("autoRotate", () => {
    controls.autoRotate = !controls.autoRotate
})
listenClickToPanel("初始镜头", () => {
    move(configure.camera, configure.axis);
})


if (configure.jump) {
    for (const { camera, axis } of configure.jump) {
        listenClickToPanel(camera, () => {
            move(camera, axis);
        })
    }
}
if (configure.end) {
    listenClickToPanel('END', () => {
        move(configure.end.camera, configure.end.axis);
    })
}
