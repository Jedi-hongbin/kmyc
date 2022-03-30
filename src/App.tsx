import { useCallback, useEffect, useRef, useState } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import LoadingScreen from "./container/LoadingScreen";
import Map from "./container/Map";
import USDate from "./components/USDate";
import Panel from "./components/Panel";
import Subtitles from "./components/Subtitles";
import CombatGains from "./components/CombatGains";
import { detrusionChart } from "./utils";
import ThemeProvider from "./styled/ThemeProvide";
import BackGroundMusic from "./components/BackGroundMusic";
import CampaignDetail from "./components/CampaignDetail";
import CustomMenu from "./components/CustomMenu";
import AnimateProgressConfig from "./container/Map/AnimateProgressConfig";

const needUpdateCharts = ["us"];

window.addEventListener("resize", _ => {
  const resizeEvent = new CustomEvent("charts_resize", {
    detail: { key: needUpdateCharts },
  });
  window.dispatchEvent(resizeEvent);
});

function App() {
  const textures = useRef<{ [key: string]: any }>({});
  const [map, setMap] = useState<GLTF>();
  const [animateIndex, setAnimateIndex] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState(0); //正在加载第几次战役模型
  const [isHideLoadScene, setIsHideLoadScene] = useState(false); //是否隐藏加载屏
  const [loading, setLoading] = useState(true);
  const [isShowUSDate, setIsShowUSDate] = useState(false); //美军受损表

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setIsHideLoadScene(true);
      }, 300);
    }
  }, [loading]);

  const goHome = useCallback(() => {
    setAnimateIndex(-1);
    detrusionChart(false);
  }, []);

  const addTexture = (name: string, texture: any) => {
    textures.current[name] = texture;
  };

  //准备数据请求完毕
  const handleLoad = () => {
    setLoading(false);
  };

  //map 内部更新战役动画
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectAnimation = useCallback(setAnimateIndex, []);

  const hideUSDate = useCallback(() => {
    setIsShowUSDate(false);
  }, []);

  return (
    <ThemeProvider>
      {isHideLoadScene ? (
        <>
          <CampaignDetail />
          <CustomMenu />
        </>
      ) : (
        <LoadingScreen
          setMap={setMap}
          addTexture={addTexture}
          handleLoad={handleLoad}
        />
      )}

      {/* <Map
        animateIndex={animateIndex}
        gltf={map}
        textures={textures.current}
        selectAnimation={selectAnimation}
        isLoading={loading}
        setLoadingIndex={setLoadingIndex}
      /> */}
      <Panel
        animateIndex={animateIndex}
        setAnimateIndex={setAnimateIndex}
        setIsShowUSDate={setIsShowUSDate}
        goHome={goHome}
        loadingIndex={loadingIndex}
      />
      <Subtitles />
      <USDate isShow={isShowUSDate} handleCancel={hideUSDate} />
      <CombatGains />
      <BackGroundMusic />
      <AnimateProgressConfig />
    </ThemeProvider>
  );
}

export default App;
