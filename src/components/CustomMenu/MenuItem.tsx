/*
 * @Author: hongbin
 * @Date: 2022-03-19 22:04:32
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-20 18:24:36
 * @Description:MenuItem 菜单项
 */
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { fadeIn } from "../../styled";

interface IProps {
  text: string;
  onClick: () => void;
  option?: { title: string; onClick: () => void }[];
}

const MenuItem: FC<IProps> = ({ text, onClick, option }): ReactElement => {
  const [showOption, setShowOption] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);

  /**
   * 检测出现位置能否完整显示
   */
  const check = () => {
    const rect = optionRef.current?.getBoundingClientRect();
    if (rect) {
      if (
        document.body.offsetHeight <
        rect.bottom + optionRef.current!.offsetHeight
      ) {
        optionRef.current!.style["top"] = "auto";
        optionRef.current!.style["bottom"] = "0";
      } else {
        optionRef.current!.style["top"] = "0";
        optionRef.current!.style["bottom"] = "auto";
      }
      if (
        document.body.offsetWidth * 0.95 <
        rect.right + optionRef.current!.offsetWidth
      ) {
        optionRef.current!.style["left"] = "auto";
        optionRef.current!.style["right"] = "100%";
      } else {
        optionRef.current!.style["left"] = "100%";
        optionRef.current!.style["right"] = "auto";
      }
    }
  };

  useEffect(() => {
    if (showOption) {
      check();
      requestAnimationFrame(check);
    }
  }, [showOption]);

  return (
    <Container
      {...(option?.length
        ? {
            onMouseLeave: () => setShowOption(false),
            onMouseEnter: () => setShowOption(true),
          }
        : {})}
      onClick={e => {
        option?.length && e.stopPropagation();
        onClick();
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

const Container = styled.div.attrs({ name: "1" })`
  padding: 0.8vh 1vw;
  background-color: #83c984c9;
  border-radius: inherit;
  margin: 1vh 0;
  transition: 0.3s ease;
  transition-property: background-color, color, font-weight;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  :hover {
    background-color: #3e843e;
    color: #073f08;
    font-weight: bold;
    path {
      fill: #112e11;
    }
  }
`;

const OptionBox = styled.div`
  position: absolute;
  padding: 0 0.8vh;
  background: #83c984c9;
  font-size: 0.8em;
  border-radius: inherit;
  /* top: 0;
  left: 100%; */
  box-shadow: 5px 3px 11px 5px #364637bd;
  animation: ${fadeIn} 0.2s 0.1s linear;
  p {
    display: block;
    white-space: nowrap;
    padding: 0.5vh 0.5vw;
  }
`;

const ArrowIcon = (
  <svg
    viewBox='0 0 1024 1024'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    p-id='28649'
    width='16'
    height='16'
  >
    <path
      d='M857.70558 495.009024 397.943314 27.513634c-7.132444-7.251148-18.794042-7.350408-26.048259-0.216941-7.253194 7.132444-7.350408 18.795065-0.216941 26.048259l446.952518 454.470749L365.856525 960.591855c-7.192819 7.192819-7.192819 18.85544 0 26.048259 3.596921 3.596921 8.311293 5.39487 13.024641 5.39487s9.42772-1.798972 13.024641-5.39487L857.596086 520.949836C864.747973 513.797949 864.796068 502.219239 857.70558 495.009024z'
      p-id='28650'
      fill='#205120'
    ></path>
  </svg>
);
