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

/**
 * 需要特殊处理的各类模型类型
 */
export enum ModelType {
  /**
   * hover不需要变换的模型 地图模块 或 基面(纵横相交的线)
   */
  NOTReact = 0,
  /**
   * 战役图标 莫辛纳甘卡宾枪模型
   */
  MXNG = 1,
  /**
   * 大战役下的小战斗图标
   */
  PositionIcon = 3,
  /**
   * 介绍战役的图片
   */
  Picture = 7,
}
