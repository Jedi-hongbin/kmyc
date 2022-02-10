import { useCallback, useRef, useState } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import LoadingScreen from "./container/LoadingScreen";
import Map from "./container/Map";
import styled from "styled-components";
import { flexCenter } from "./styled";
import { Button } from "./styled/Button";
import { adjustColor, randomColor } from "./utils/color";

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

      {/* <Map
        animateIndex={animateIndex}
        gltf={map}
        textures={textures.current}
        selectAnimation={selectAnimation}
      /> */}
      <Panel>
        {["一", "二", "三", "四", "五"].map((text, index) => (
          <Button
            // primary='#aaffaa'
            primary={adjustColor("#aaffaa", index * -30)}
            key={text}
            onClick={() => setAnimateIndex(index + 1)}
          >
            第{text}次战役
          </Button>
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
  background: #b6b6b688;
  border-radius: 1rem;
  ${flexCenter};
  flex-direction: column;
  padding: 1rem;
`;
// button {
//   padding: 0.5rem;
//   width: 8rem;
//   border: none;
//   border-radius: 0.5rem;
//   background-color: #aaffaa52;
//   white-space: nowrap;
//   color: #049204;
//   margin: 0.3rem;
//   font-weight: bold;
//   cursor: pointer;
//   transition: all 0.3s ease-in;
//   font-size: 0.7rem;
//   overflow: hidden;
//   position: relative;

//   ::after,
//   ::before {
//     content: "";
//     width: 4rem;
//     height: 4rem;
//     background-color: #aaffaa;
//     border-radius: 4rem;
//     transition: transform 0.4s ease-in-out, top 0.3s ease-in-out;
//     position: absolute;
//     z-index: -1;
//     left: 2rem;
//     top: 2rem;
//   }

//   ::before {
//     left: 2rem;
//     top: -4rem;
//   }

//   :hover {
//     box-shadow: 0 0 1rem 3px #aaf9aa;
//     color: #028102;
//     ::after {
//       transform: scale(2);
//       top: -1rem;
//     }
//     ::before {
//       transform: scale(2);
//       top: 1rem;
//     }
//   }

//   :active {
//     transform: translateY(3px);
//     transition-duration: 0.1s;
//   }
// }
