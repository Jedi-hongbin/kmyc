/*
 * @Author: hongbin
 * @Date: 2022-02-10 16:18:32
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-16 21:54:57
 * @Description:通用按钮
 */

import styled from "styled-components";
import { adjustColor } from "../utils/color";

/**
 * @description: 按钮
 * @param {string} primary 必须是六位十六进制颜色
 * @param {string} color 必须是六位十六进制颜色
 * @param {string} lightColor 必须是六位十六进制颜色
 */
export const Button = styled.button<{
  primary: string;
}>`
  padding: 0.5rem;
  width: 8rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${props => props.primary + "65"};
  white-space: nowrap;
  color: ${props => adjustColor(props.primary, -100)};
  margin: 0.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in;
  font-size: 0.7rem;
  overflow: hidden;
  position: relative;
  user-select: none;

  ::after,
  ::before {
    content: "";
    width: 4rem;
    height: 4rem;
    background-color: ${props => props.primary};
    border-radius: 4rem;
    transition: transform 0.4s ease-in-out, top 0.3s ease-in-out;
    position: absolute;
    z-index: -1;
    left: 2rem;
    top: 2rem;
  }

  ::before {
    left: 2rem;
    top: -4rem;
  }

  :hover {
    box-shadow: 0 0 1rem 3px ${props => props.primary};
    color: ${props => adjustColor(props.primary, -120)};
    ::after {
      transform: scale(2.1, 2);
      top: -1rem;
    }
    ::before {
      transform: scale(2, 2);
      top: 1rem;
    }
  }

  :active {
    transform: translateY(3px);
    transition-duration: 0.1s;
  }
`;
