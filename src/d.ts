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
    /**
     * 全局gltf加载器
     */
    gltfLoader: GLTFLoader;
    /**
     * 页面宽度
     */
    pageWidth: number;
    /**
     * 是否是手机
     */
    isPhone: boolean;
    /**
     * 模拟 vmax css单位
     */
    vmax: (range: number) => number;
    /**
     * 模拟 vmin css单位
     */
    vmin: (range: number) => number;
    /**
     * 是否使用mac电脑配色  mac和window对颜色显示有差异
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
