/*
 * @Author: hongbin
 * @Date: 2022-02-06 15:48:55
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-19 11:02:33
 * @Description: 常用styled
 */
import styled, { css, keyframes } from "styled-components";
import { AlignItems, JustifyContentProps } from "./types";

export const fadeIn = keyframes`
0%{opacity:0};
100%{opacity:1};
`;
export const leftSlideIn = keyframes`
0%{
  left:-100%;
  /* width: 0;
  height: 0; */
};
/* 50%{
  left:0;
} */
100%{
  left:0;
  width: 80vw;
  height: 100vh;
};
`;
export const fadeOut = keyframes`
  0%{opacity:1};
  100%{opacity:0;};
`;
export const ActiveLateY = css`
  &:active {
    transform: translateY(1px);
  }
`;
export const Capitalize = css`
  text-transform: capitalize;
`;

export const Uppercase = css`
  text-transform: uppercase;
`;

export const Lowercase = css`
  text-transform: lowercase;
`;

export const BetweenCenter = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SpaceStyle = css`
  ${(props: any) =>
    props.space &&
    css`
      & > * {
        margin: ${props.space};
      }
    `};
`;

export const hideScrollbar = css`
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const scrollbar = css`
  ::-webkit-scrollbar-thumb {
    background: #aaa;
    border-radius: 4px;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: rgba(1, 1, 1, 0);
  }
`;

export const detrusionTransition = css`
  transition-property: transform, opacity, visibility;
  transition-duration: 0.3s;
  transition-timing-function: ease;
`;

export const rightDetrusion = css`
  visibility: hidden;
  opacity: 0;
  transform: translateX(100%);
`;

export const leftDetrusion = css`
  visibility: hidden;
  opacity: 0;
  transform: translateX(-100%);
`;

export const FlexDiv = styled.div<{
  justify?: JustifyContentProps;
  items?: AlignItems;
  space?: string;
  column?: boolean;
  flex?: number;
  height?: string;
  width?: string;
}>`
  display: flex;
  justify-content: ${props => props.justify};
  align-items: ${props => props.items};
  flex-direction: ${props => (props.column ? "column" : "row")};
  flex-wrap: wrap;
  ${({ space }) => space && `& > * {margin: ${space};}`};
  ${({ flex }) => flex && `flex:${flex}`};
  ${({ height }) => height && `height:${height}`};
  ${({ width }) => width && `width:${width}`};
`;
