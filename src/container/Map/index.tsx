/*
 * @Author: hongbin
 * @Date: 2022-02-06 09:15:57
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-09 23:39:31
 * @Description: three.js 和 glt模型 朝鲜地图模块
 */
import { FC, memo, ReactElement, useCallback, useEffect, useRef } from "react";
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
import {
  controls,
  scene,
  clearAnimateTimer,
  tick,
  renderer,
  drawLine,
  move,
  textureLoader,
  animationConfigure,
  start,
  eventListener,
  loadPositionIcon,
  Explain,
} from "./utils";
import { CampaignDetailRef } from "../../components/CampaignDetail";

let loadingTimer: NodeJS.Timeout;
const explain = new Explain();
interface IProps {
  animateIndex: number;
  gltf: GLTF | undefined;
  textures: { [key: string]: THREE.Texture };
  selectAnimation: (index: number) => void;
  isLoading: boolean;
  setLoadingIndex: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * 不缓存加载过的模型是因为有动画不好处理,在动画未结束时移除模型,下次添加模型会保持离开时的关键帧
 */
let currentIndex: number;

const Map: FC<IProps> = ({
  gltf,
  textures,
  animateIndex,
  selectAnimation,
  isLoading,
  setLoadingIndex,
}): ReactElement => {
  const cacheModel = useRef<GLTF>(null); //保存上一个战役模型
  const MXNGArr = useRef<Object3D[]>([]); //保存战役图标 莫辛纳甘枪
  const XCRef = useRef<XCBack>(null); //保存四个相册模型和调度方法 之后切换只需要切换纹理贴图
  const AxisRef = useRef<AxisRef>(null); //战役柱状图
  const PositionRef = useRef<{ clear: () => void }>(null); //战斗图标功能

  /**加载战役模型*/
  const loadCampaignModel = useCallback((loadAnimateIndex: number) => {
    //100毫秒以后再更新状态是为了在有缓存的情况下 使用缓存模型 dom不必更新
    loadingTimer = setTimeout(() => {
      setLoadingIndex(loadAnimateIndex);
    }, 100);

    window.gltfLoader.load(
      `${process.env.REACT_APP_URL}map/${loadAnimateIndex}-animate.glb`,
      async (gltf: any) => {
        if (currentIndex !== loadAnimateIndex) return;
        await explain.asyncLoadVoice(loadAnimateIndex);
        clearTimeout(loadingTimer);
        setLoadingIndex(0); //重置 停止加载
        console.log("战役模型:", gltf);
        start(gltf, loadAnimateIndex, async () => {
          XCRef.current?.show();
          panelRef.current?.show();
          if (AxisRef.current?.models.length) {
            scene.add(...AxisRef.current.models);
            AxisRef.current.models = [];
          } else AxisRef.current?.toggle(loadAnimateIndex);
          //播放结束 展示 小战役图标
          //@ts-ignore
          PositionRef.current = await loadPositionIcon(loadAnimateIndex);
        });
        //@ts-ignore
        cacheModel.current = gltf;
        //战役图标隐藏
        const icon = MXNGArr.current[loadAnimateIndex - 1];
        hideMash(icon);
        //控制面板退下
        panelRef.current?.hide();
        //如果相册模型已经存在了 不必加载整个模型 只需切换即可
        if (XCRef.current) {
          XCRef.current.toggle(loadAnimateIndex);
        } else {
          loadXCModel(loadAnimateIndex, textureLoader).then(ref => {
            //@ts-ignore
            XCRef.current = ref;
            scene.add(...ref.models);
          });
        }
        //先加载模型并不添加到地图中
        loadAxisModel(loadAnimateIndex).then(ref => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (animateIndex > 0) {
      currentIndex = animateIndex;
      loadCampaignModel(animateIndex);
    } else if (animateIndex === -1) {
      controls.reset();
      controls.autoRotate = false;
    }
    return () => {
      const gltf = cacheModel.current;
      //清除当前的战役模型
      if (gltf) {
        gltf.scene.traverse(function (item) {
          if (item instanceof THREE.Mesh) {
            item.geometry.dispose(); //删除几何体
            item.material.dispose(); //删除材质
          }
        });
        scene.remove(gltf.scene);
      }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        PositionRef.current?.clear();
        CampaignDetailRef.current?.hide();
        explain.stop();
      }
    };
  }, [animateIndex, loadCampaignModel]);

  useEffect(() => {
    if (!isLoading) {
      tick();
      //由小入大
      move(
        [window.isPhone ? 10 : 30, 93, -5],
        [window.isPhone ? 9 : 30, 10, -5],
        40,
        undefined,
        async () => {
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

  return <div id='kmyc_canvas'></div>;
};

export default memo(Map);
