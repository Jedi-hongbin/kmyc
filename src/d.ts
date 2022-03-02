// import THREE from "three";
import "styled-components";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// declare global {
//   interface Window {
//     THREE: typeof THREE;
//   }
// }
declare global {
  interface Window {
    gltfLoader: GLTFLoader;
    pageWidth: number;
    isPhone: boolean;
    vmax: (range: number) => number;
    vmin: (range: number) => number;
  }
}

declare module "styled-components" {
  export interface DefaultTheme {
    /**
     * 在不支持透明背景的浏览器中替换背景
     */
    replaceBg: string;
  }
}
