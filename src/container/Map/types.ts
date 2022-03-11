interface IPosition {
  /**
   * 相机坐标
   */
  camera: [x: number, y: number, z: number];
  /**
   * 坐标轴中心坐标
   */
  axis: IPosition["camera"];
}
interface IJump extends IPosition {
  time: number;
  speed?: number;
  /**
   * 第几帧切换视野
   */
  frame?: number;
}
// 拙劣的合并
// type Merge<T, Type> = {
//   [P in keyof T]: T[P];
// } & Type;

export interface IAnimationConfigure extends IPosition {
  jump: IJump[];
  end: Omit<IJump, "time"> & { duration: number };
  icon: IPosition["camera"];
}
