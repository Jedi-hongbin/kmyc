/*
 * @Author: hongbin
 * @Date: 2022-03-10 10:13:34
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-20 00:18:03
 * @Description:数据来源
 */

import { FC, ReactElement } from "react";
import styled from "styled-components";
import { fadeIn } from "../../styled";

interface IProps {}

export const source = [
  { name: "抗美援朝纪念馆", href: "http://www.kmycjng.com/list?cid=123" },
  { name: "百度百科-抗美援朝", href: "https://baike.baidu.com/item/抗美援朝/" },
  { name: "国防时报TV", href: "https://www.bilibili.com/video/BV1UK4y177RY" },
];

const DataSource: FC<IProps> = (): ReactElement => {
  return (
    <Container>
      数据来源:
      {source.map(({ name, href }) => (
        <a key={name} href={href} target='_blank' rel='noreferrer'>
          {name}
        </a>
      ))}
    </Container>
  );
};

export default DataSource;

const Container = styled.div`
  position: fixed;
  z-index: 1;
  bottom: 1vmin;
  font-size: 1.5vmin;
  color: #cccccc;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  animation: ${fadeIn} 4s 2s linear;
  animation-fill-mode: forwards;

  a {
    margin-left: 1vmin;
    :hover {
      color: #ffffff;
    }
  }
`;
