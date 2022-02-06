import { useRef, useState } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import LoadingScreen from "./container/LoadingScreen";
import Map from "./container/Map";

function App() {
  const [map, setMap] = useState<GLTF | null>(null);
  const textures = useRef<{ [key: string]: any }>({});
  const [isLoad, setIsLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  function addTexture(name: string, texture: any) {
    textures.current[name] = texture;
  }
  //准备数据请求完毕
  function handleLoad() {
    setIsLoad(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div>
      {isLoading ? (
        <LoadingScreen
          setMap={setMap}
          addTexture={addTexture}
          handleLoad={handleLoad}
        />
      ) : null}
      {isLoad ? <Map gltf={map!} textures={textures.current} /> : null}
    </div>
  );
}

export default App;
