import { useCallback, useRef, useState } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import LoadingScreen from "./container/LoadingScreen";
import Map from "./container/Map";
import styled from "styled-components";
import { ActiveLateY, flexCenter } from "./styled";

function App() {
  const textures = useRef<{ [key: string]: any }>({});
  const map = useRef<GLTF>(null);
  const [animateIndex, setAnimateIndex] = useState(0);
  const [loadType, setLoadType] = useState<"loading" | "load" | "end">(
    "loading"
  );

  const addTexture = useCallback((name: string, texture: any) => {
    textures.current[name] = texture;
  }, []);
  //准备数据请求完毕
  const handleLoad = useCallback(() => {
    setLoadType("load");
    setTimeout(() => {
      setLoadType("end");
    }, 400);
  }, []);

  const setMap = useCallback((gltf: GLTF) => {
    // @ts-ignore
    map.current = gltf;
  }, []);

  return (
    <div>
      {loadType !== "end" ? (
        <LoadingScreen
          setMap={setMap}
          addTexture={addTexture}
          handleLoad={handleLoad}
        />
      ) : null}

      <Map
        animateIndex={animateIndex}
        gltf={map.current!}
        textures={textures.current}
      />
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
