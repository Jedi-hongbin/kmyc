import THREE from "three";

declare global {
  interface Window {
    THREE: typeof THREE;
  }
}
