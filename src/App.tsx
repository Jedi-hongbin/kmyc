import { useCallback, useRef, useState } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import LoadingScreen from "./container/LoadingScreen";
import Map from "./container/Map";
import styled from "styled-components";
import { ActiveLateY, flexCenter } from "./styled";

function App() {
  const textures = useRef<{ [key: string]: any }>({});
  const [map, setMap] = useState<GLTF>();
  const [animateIndex, setAnimateIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {loading ? (
        <LoadingScreen
          setMap={setMap}
          addTexture={addTexture}
          handleLoad={handleLoad}
        />
      ) : null}

      {/* {map ? ( */}
      <Map
        animateIndex={animateIndex}
        gltf={map}
        textures={textures.current}
        selectAnimation={selectAnimation}
      />
      {/* ) : null} */}
      <Panel>
        {[1, 2, 3, 4, 5].map(v => (
          <button key={v} onClick={() => setAnimateIndex(v)}>
            {v}
          </button>
        ))}
      </Panel>
    </div>
  );
}

export default App;

const Panel = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 50vw;
  height: 10vh;
  background: #c8c7c7;
  border-radius: 1rem;
  ${flexCenter};
  button {
    padding: 0.5rem 1rem;
    width: 10rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #aaffaa52;
    color: #049204;
    margin: 0 1rem;
    font-weight: bold;
    cursor: pointer;
    ${ActiveLateY};
  }
`;
