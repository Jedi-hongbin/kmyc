// import THREE from "three";
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
  }
}
