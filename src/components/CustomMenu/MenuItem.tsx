/*
 * @Author: hongbin
 * @Date: 2022-03-19 22:04:32
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-20 21:52:01
 * @Description:MenuItem 菜单项
 */
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { fadeIn } from "../../styled";

interface IProps {
  text: string;
  onClick?: () => void;
  option?: { title: string; onClick: () => void }[];
  renderCheck?: any;
  check?: (ref: React.RefObject<HTMLDivElement>) => void;
}

const MenuItem: FC<IProps> = ({
  text,
  onClick,
  option,
  renderCheck,
  check,
}): ReactElement => {
  const [showOption, setShowOption] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);

  /**
   * 布局发生变化时就获取option应该出现的位置 现获取位置会产生闪烁 因为和上次的css可能不同
   */
  useEffect(() => {
    if (renderCheck) {
      check && check(optionRef);
    }
  }, [renderCheck, check]);

  return (
    <Container
      {...(option?.length
        ? {
            onMouseLeave: () => setShowOption(false),
            onMouseEnter: () => setShowOption(true),
          }
        : {})}
      hoverActive={!!onClick}
      onClick={e => {
        option?.length && e.stopPropagation();
        onClick && onClick();
      }}
    >
      {/* @ts-ignore */}
      <p name='1'>{text}</p>
      {option?.length ? (
        <>
          {ArrowIcon}
          <OptionBox
            ref={optionRef}
            style={{ visibility: showOption ? "visible" : "hidden" }}
          >
            {option.map(({ title, onClick }) => (
              <MenuItem key={title} text={title} onClick={onClick} />
            ))}
          </OptionBox>
        </>
      ) : null}
    </Container>
  );
};

export default MenuItem;

const Container = styled.div.attrs({ name: "1" })<{ hoverActive?: boolean }>`
  padding: 0.8vh 1vw;
  background-color: #83c984;
  border-radius: 0.7vh;
  margin: 1vh 0;
  transition: 0.3s ease;
  transition-property: background-color, color, font-weight;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  svg {
    width: 0.8em;
    height: 0.8em;
  }
  :hover {
    p {
      transition: 0.2s ease;
      font-weight: bold;
      color: #073f08;
    }
    background-color: #3e843e;

    path {
      fill: #112e11;
    }
    ${({ hoverActive }) =>
      !hoverActive &&
      css`
        background-color: #4da14d;
      `}
  }
`;

const OptionBox = styled.div`
  position: absolute;
  padding: 0.5vh 0.8vh 0.5vh 0.8vh;
  background: #83c984c9;
  font-size: 0.8em;
  border-radius: inherit;
  /* top: 0;
  left: 100%; */
  box-shadow: 5px 3px 11px 5px #364637bd;
  animation: ${fadeIn} 0.2s 0.1s linear;
  & > div {
    margin: 0.5vh 0;
  }
  p {
    display: block;
    white-space: nowrap;
    padding: 0.2vh;
    font-weight: normal;
    :hover {
      font-weight: bold;
    }
  }
  /* :hover {
    background: inherit;
  } */
`;

const ArrowIcon = (
  <svg
    viewBox='0 0 1024 1024'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    p-id='2852'
    width='32'
    height='32'
  >
    <path
      d='M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744c-19.264-18.208-49.632-17.344-67.872 1.888-18.208 19.264-17.376 49.632 1.888 67.872l316.96 299.84-315.712 304.288c-19.072 18.4-19.648 48.768-1.248 67.872 9.408 9.792 21.984 14.688 34.56 14.688 12 0 24-4.48 33.312-13.44l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344C757.76 538.88 759.2 535.392 761.056 532.128z'
      p-id='2853'
      fill='#205120'
    ></path>
  </svg>
);
