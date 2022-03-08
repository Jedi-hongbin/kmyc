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
    /**
     * 是否是mac电脑  mac和window对颜色显示有差异
     */
    MACOS: boolean;
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
