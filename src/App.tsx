import { useCallback, useRef, useState } from "react";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import LoadingScreen from "./container/LoadingScreen";
import Map from "./container/Map";
import styled from "styled-components";
import { flexCenter } from "./styled";
import { Button } from "./styled/Button";
import { adjustColor } from "./utils/color";
import USDate from "./components/USDate";

function App() {
  const textures = useRef<{ [key: string]: any }>({});
  const [map, setMap] = useState<GLTF>();
  const [animateIndex, setAnimateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isShowUSDate, setIsShowUSDate] = useState(false); //美军受损表

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
    <div>
      {loading ? (
        <LoadingScreen
          setMap={setMap}
          addTexture={addTexture}
          handleLoad={handleLoad}
        />
      ) : null}

      <Map
        animateIndex={animateIndex}
        gltf={map}
        textures={textures.current}
        selectAnimation={selectAnimation}
        isLoading={loading}
      />
      <Panel>
        {[
          "第一次战役",
          "第二次战役",
          "第三次战役",
          "第四次战役",
          "第五次战役",
        ].map((text, index) => (
          <Button
            // primary='#aaffaa'
            primary={adjustColor("#aaffaa", index * -10)}
            key={text}
            onClick={() => setAnimateIndex(index + 1)}
          >
            {text}
          </Button>
        ))}
        <Button
          primary={adjustColor("#aaffaa", 6 * -10)}
          onClick={() => setIsShowUSDate(true)}
        >
          美军损失表
        </Button>
      </Panel>
      <USDate isShow={isShowUSDate} handleCancel={hideUSDate} />
    </div>
  );
}

export default App;

const Panel = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  background: #263c26;
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
