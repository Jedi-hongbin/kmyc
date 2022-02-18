/*
 * @Author: hongbin
 * @Date: 2022-02-18 15:14:19
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-18 16:35:55
 * @Description:志愿军战绩
 */
import { FC, ReactElement } from "react";
import styled from "styled-components";
import Annihilate from "./Annihilate";
import CapturedWeapons from "./CapturedWeapons";

interface IProps {}

const CombatGains: FC<IProps> = (): ReactElement => {
  return (
    <>
      <Annihilate />
      <CapturedWeapons />
    </>
  );
};

export default CombatGains;

const Container = styled.div``;
