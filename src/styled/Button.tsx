/*
 * @Author: hongbin
 * @Date: 2022-02-10 16:18:32
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-20 18:21:25
 * @Description:通用按钮
 */

import styled, { css } from "styled-components";
import { adjustColor } from "../utils/color";

/**
 * @description: 按钮
 * @param {string} primary 必须是六位十六进制颜色
 */
export const Button = styled.button<{
  primary: string;
  width?: string;
  padding?: string;
  size?: "medium" | "small";
}>`
  ${({ size }) =>
    size === "small"
      ? css`
          --width: 3rem;
          --padding: 0.2rem;
          --font-size: 0.5rem;
          --after-left: 0.75rem;
          --after-top: 1rem;
          --before-left: 0.75rem;
          --before-top: -1.6rem;
          --hover--after-top: -0.5rem;
          --hover-before-top: 0.5rem;
        `
      : size === "medium"
      ? css`
          --width: 5rem;
          --padding: 0.2rem;
          --font-size: 1vmax;
          --margin: 0.2rem;
          --after-left: 1.25rem;
          --after-top: 1.5rem;
          --before-left: 1.25rem;
          --before-top: -3rem;
          --hover--after-top: -0.75rem;
          --hover-before-top: 0.75rem;
        `
      : css`
          --width: 8rem;
          --padding: 0.5rem;
          --font-size: 0.7rem;
          --after-left: 2rem;
          --after-top: 2rem;
          --before-left: 2rem;
          --before-top: -4rem;
          --hover--after-top: -1rem;
          --hover-before-top: 1rem;
        `};

  padding: var(--padding);
  width: var(--width);
  border: none;
  border-radius: 0.5rem;
  background-color: ${props => props.primary + "65"};
  white-space: nowrap;
  color: ${props => adjustColor(props.primary, -30)};
  margin: var(--margin, 0.3rem);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in;
  font-size: var(--font-size);
  overflow: hidden;
  position: relative;
  user-select: none;

  ::after,
  ::before {
    content: "";
    width: calc(var(--width) / 2);
    height: calc(var(--width) / 2);
    background-color: ${props => props.primary};
    border-radius: calc(var(--width) / 2);
    transition: transform 0.4s ease-in-out, top 0.3s ease-in-out;
    position: absolute;
    z-index: -1;
  }

  ::after {
    left: var(--after-left);
    top: var(--after-top);
  }
  ::before {
    left: var(--before-left);
    top: var(--before-top);
  }

  :hover {
    box-shadow: 0 0 1rem 3px ${props => props.primary};
    color: ${props => adjustColor(props.primary, -120)};
    ::after {
      transform: scale(2.1, 2);
      top: var(--hover--after-top);
    }
    ::before {
      transform: scale(2, 2);
      top: var(--hover-before-top);
    }
  }

  :active {
    transform: translateY(3px);
    transition-duration: 0.1s;
  }

  @media screen and (max-width: 750px) {
    width: calc(var(--width) + 3rem);
    :hover {
      background-color: ${props => props.primary};
    }
    :active {
      transform: translateY(1px);
    }
    ::after,
    ::before {
      display: none;
    }
  }
`;
