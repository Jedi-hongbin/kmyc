import { useCallback, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [isShowUSDate, setIsShowUSDate] = useState(false); //美军受损表

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
      {loading ? (
        <LoadingScreen
          setMap={setMap}
          addTexture={addTexture}
          handleLoad={handleLoad}
        />
      ) : null}

      {/* <Map
        animateIndex={animateIndex}
        gltf={map}
        textures={textures.current}
        selectAnimation={selectAnimation}
        isLoading={loading}
      /> */}
      <Panel
        setAnimateIndex={setAnimateIndex}
        setIsShowUSDate={setIsShowUSDate}
        goHome={goHome}
      />
      <Subtitles />
      <USDate isShow={isShowUSDate} handleCancel={hideUSDate} />
      <CombatGains />
      <BackGroundMusic />
    </ThemeProvider>
  );
}

export default App;
