interface IPosition {
  camera: [x: number, y: number, z: number];
  axis: IPosition["camera"];
}
interface IJump extends IPosition {
  time: number;
  speed?: number;
}
// 拙劣的合并
// type Merge<T, Type> = {
//   [P in keyof T]: T[P];
// } & Type;

export interface IAnimationConfigure extends IPosition {
  jump: IJump[];
  end: Omit<IJump, "time"> & { duration: number };
}
