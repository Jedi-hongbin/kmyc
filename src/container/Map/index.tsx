/*
 * @Author: hongbin
 * @Date: 2022-02-06 09:15:57
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-28 22:05:32
 * @Description: three.js 和 glt模型 朝鲜地图模块
 */
import { FC, memo, ReactElement, useEffect, useRef } from "react";
import { Object3D } from "three";
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import {
  hideMash,
  loadMXNGModel,
  loadXCModel,
  showMash,
  XCBack,
  loadAxisModel,
  AxisRef,
} from "./function";
import qiangImg from "../../assets/map/moxinnaganky.png";
import { panelRef } from "../../components/Panel";
import { subtitleRef } from "../../components/Subtitles";
import useMount from "../../hook/useMount";
import {
  controls,
  scene,
  clearAnimateTimer,
  render,
  tick,
  renderer,
  drawLine,
  move,
  textureLoader,
  animationConfigure,
  start,
  eventListener,
} from "./utils";

interface IProps {
  animateIndex: number;
  gltf: GLTF | undefined;
  textures: { [key: string]: THREE.Texture };
  selectAnimation: (index: number) => void;
  isLoading: boolean;
}

/**
 * 不缓存加载过的模型是因为有动画不好处理,在动画未结束时移除模型,下次添加模型会保持离开时的关键帧
 */

const Map: FC<IProps> = ({
  gltf,
  textures,
  animateIndex,
  selectAnimation,
  isLoading,
}): ReactElement => {
  const cacheModel = useRef<GLTF>(null); //保存上一个战役模型
  const MXNGArr = useRef<Object3D[]>([]); //保存战役图标 莫辛纳甘枪
  const XCRef = useRef<XCBack>(null); //保存四个相册模型和调度方法 之后切换只需要切换纹理贴图
  const AxisRef = useRef<AxisRef>(null); //战役柱状图

  useEffect(() => {
    if (animateIndex > 0) {
      loadCampaignModel(animateIndex);
    } else if (animateIndex === -1) {
      // move([30, 93, -5], [30, 10, -5], 50, undefined, () => {
      controls.reset();
      // });
      controls.autoRotate = false;
    }
    return () => {
      const gltf = cacheModel.current;
      //清除当前的战役模型
      gltf && scene.remove(gltf.scene);
      clearAnimateTimer();
      if (animateIndex > 0) {
        //上一个播放的动画，恢复战役图标显示
        // eslint-disable-next-line react-hooks/exhaustive-deps
        showMash(MXNGArr.current[animateIndex - 1]);
        XCRef.current?.hide();
        subtitleRef.current?.hide();
        panelRef.current?.show();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        AxisRef.current?.hide();
      }
    };
  }, [animateIndex]);

  useMount(() => {
    window.addEventListener("keyup", e => {
      if (e.code === "Space") {
        controls.autoRotate = !controls.autoRotate;
      }
    });
  });

  useEffect(() => {
    if (!isLoading) {
      //由小入大
      move(
        [window.isPhone ? 10 : 30, 93, -5],
        [window.isPhone ? 9 : 30, 10, -5],
        50,
        undefined,
        () => {
          controls.saveState();
        }
      );
    }
  }, [isLoading]);

  useEffect(() => {
    const container = document.querySelector("#kmyc_canvas") as HTMLDivElement;
    if (!container.children.length) {
      container.appendChild(renderer.domElement);
      drawLine();
    }
    if (gltf) {
      if (textures[20]) return;
      console.log("map model load");
      scene.add(gltf.scene);
      // document.documentElement.appendChild(stats.dom);
      tick();

      //加载其他地图纹理
      for (let i = 10; i < 33; i++) {
        const url = `${process.env.REACT_APP_URL}${i}.jpg`;
        const texture = textureLoader.load(url);
        texture.flipY = false;
        texture.encoding = THREE.sRGBEncoding;
        textures[i] = texture;
      }

      //设置地图板块的纹理
      for (const mash of gltf.scene.children) {
        const texture = textures[mash.name];
        if (texture) {
          // @ts-ignore
          mash.material = new THREE.MeshBasicMaterial({ map: texture });
          mash.userData.type = 0; // 标记地图模块类型
        }
      }

      //加载战役图标 -- 莫辛纳甘卡宾枪
      const qiangTexture = textureLoader.load(qiangImg);
      qiangTexture.flipY = false;
      qiangTexture.encoding = THREE.sRGBEncoding;

      loadMXNGModel(
        new THREE.MeshBasicMaterial({ map: qiangTexture }),
        animationConfigure,
        scene,
        MXNGArr.current
      );

      eventListener(selectAnimation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltf]);

  /**加载战役模型*/
  const loadCampaignModel = (animateIndex: number) => {
    window.gltfLoader.load(
      `${process.env.REACT_APP_URL}map/${animateIndex}-animate.glb`,
      (gltf: any) => {
        console.log("战役模型:", gltf);
        start(gltf, animateIndex, () => {
          XCRef.current?.show();
          panelRef.current?.show();
          if (AxisRef.current?.models.length) {
            scene.add(...AxisRef.current.models);
            AxisRef.current.models = [];
          } else AxisRef.current?.toggle(animateIndex);
        });
        //@ts-ignore
        cacheModel.current = gltf;
        //战役图标隐藏
        const icon = MXNGArr.current[animateIndex - 1];
        hideMash(icon);
        //控制面板退下
        if (panelRef.current) {
          panelRef.current.hide();
        }
        //如果相册模型已经存在了 不必加载整个模型 只需切换即可
        if (XCRef.current) {
          XCRef.current.toggle(animateIndex);
        } else {
          loadXCModel(animateIndex, textureLoader).then(ref => {
            //@ts-ignore
            XCRef.current = ref;
            scene.add(...ref.models);
          });
        }
        //先加载模型并不添加到地图中
        loadAxisModel(scene, animateIndex).then(ref => {
          //@ts-ignore
          AxisRef.current = ref;
        });
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
