/*
 * @Author: hongbin
 * @Date: 2022-02-18 15:14:19
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-19 10:00:59
 * @Description:志愿军战绩
 */
import { FC, ReactElement } from "react";
import Annihilate from "./Annihilate";
import CapturedWeapons from "./CapturedWeapons";
import Destroy from "./Destroy";
import Downsizing from "./Downsizing";

interface IProps {}

const CombatGains: FC<IProps> = (): ReactElement => {
  return (
    <>
      <Annihilate />
      <CapturedWeapons />
      <Destroy />
      <Downsizing />
    </>
  );
};

export default CombatGains;
//阵亡115786人，战伤221264人，失踪、被俘29095人，共计366145人
