/*
 * @Author: hongbin
 * @Date: 2022-02-06 18:35:25
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-06 18:44:42
 * @Description:加载失败显示卡片
 */
import { FC, ReactElement } from "react";
import styled from "styled-components";
import { flexCenter } from "../../styled";

interface IProps {
  errMsg: string;
}

const LoadFail: FC<IProps> = ({ errMsg }): ReactElement => {
  return (
    <Card>
      <p>很抱歉,加载失败</p>
      <p>错误信息: {errMsg}</p>
      <a href='mailto:2218176087@qq.com' title='邮箱'>
        点击与我联系
      </a>
    </Card>
  );
};

export default LoadFail;

const Card = styled.div`
  ${flexCenter};
  flex-direction: column;
  font-size: 2rem;
  width: 100vw;
  height: 100vh;
  p {
    background: #5511ff38;
    border-radius: 10px;
    padding: 1rem;
    width: 20rem;
    text-align: center;
    color: #51f;
    font-weight: bold;
    letter-spacing: 2px;
    box-shadow: 0 0 3px 1px;
  }
`;
