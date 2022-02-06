/*
 * @Author: hongbin
 * @Date: 2022-02-06 09:15:57
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-06 09:21:52
 * @Description: three.js 和 glt模型 朝鲜地图模块
 */
import { FC, ReactElement } from "react";
require("../../assets/GLTFLoader"); //向THREE注入glt模型加载器 省去手动daro解析器

interface IProps {}

const Map: FC<IProps> = (): ReactElement => {
  return <canvas></canvas>;
};

export default Map;
