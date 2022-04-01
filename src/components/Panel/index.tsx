/*
 * @Author: hongbin
 * @Date: 2022-02-17 13:40:14
 * @LastEditors: hongbin
 * @LastEditTime: 2022-04-01 15:04:01
 * @Description:控制面板
 */
import {
  Dispatch,
  FC,
  memo,
  ReactElement,
  useState,
  createRef,
  useImperativeHandle,
} from "react";
import styled, { css } from "styled-components";
import { fadeIn, flexCenter, FlexDiv } from "../../styled";
import { Button } from "../../styled/Button";
import { adjustColor } from "../../utils/color";
import { CustomMenuRef } from "../CustomMenu";
import { LoadIcon } from "../icon";
import MouseExplain from "./MouseExplain";

/**
 * @description: 控制面板向外暴露方法
 */
export const panelRef = createRef<{
  hide: () => void;
  show: () => void;
}>();

interface IProps {
  animateIndex: number;
  setAnimateIndex: Dispatch<React.SetStateAction<number>>;
  setIsShowUSDate: Dispatch<React.SetStateAction<boolean>>;
  goHome: () => void;
  loadingIndex: number;
}

const campaignNames = [
  "第一次战役",
  "第二次战役",
  "第三次战役",
  "第四次战役",
  "第五次战役",
];

const Panel: FC<IProps> = ({
  animateIndex,
  setAnimateIndex,
  setIsShowUSDate,
  goHome,
  loadingIndex,
}): ReactElement => {
  const [isHide, setIsHide] = useState(false);
  const [isOpenExplain, setIsOpenExplain] = useState(false);
  const [_, setFocusUpdate] = useState(false);

  useImperativeHandle(
    panelRef,
    () => {
      return {
        hide: () => {
          !window.isPhone && setIsHide(true);
        },
        show: () => {
          setIsHide(false);
        },
      };
    },
    []
  );

  return (
    <Container isHide={isHide}>
      <div>
        {campaignNames.map((name, index) => (
          <Button
            size='medium'
            primary={adjustColor("#aaffaa", index * -10)}
            key={name}
            onClick={() => setAnimateIndex(index + 1)}
          >
            {name}
            {index + 1 === loadingIndex ? <LoadIcon /> : null}
          </Button>
        ))}
        <Button
          size='medium'
          primary='#fffdff'
          onClick={() => setIsShowUSDate(true)}
        >
          美军伤亡
        </Button>
        {animateIndex > 0 ? (
          <Button data-fade size='medium' primary='#00faff' onClick={goHome}>
            回到主页
          </Button>
        ) : null}
        <MouseExplain show={isOpenExplain} />
        {window.isPhone || isHide ? null : (
          <FlexDiv width='100%' justify='space-between'>
            <IconButton
              onMouseEnter={() => setIsOpenExplain(true)}
              onMouseLeave={() => setIsOpenExplain(false)}
            >
              <svg
                viewBox='0 0 1024 1024'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                p-id='32217'
                width='32'
                height='32'
              >
                <path
                  d='M512 56.889344c251.35104 0 455.110656 203.759616 455.110656 455.110656S763.35104 967.110656 512 967.110656 56.889344 763.35104 56.889344 512 260.64896 56.889344 512 56.889344z m28.444672 341.332992h-99.555328v56.88832h42.665984v256h-56.88832V768h170.665984v-56.889344h-56.88832V398.22336zM512 256c-23.564288 0-42.667008 19.10272-42.667008 42.667008s19.10272 42.665984 42.667008 42.665984 42.667008-19.101696 42.667008-42.665984C554.667008 275.10272 535.564288 256 512 256z'
                  fill='#ccc'
                  p-id='32218'
                ></path>
              </svg>
            </IconButton>
            <IconButton
              onMouseEnter={e => {
                setFocusUpdate(true);
                CustomMenuRef.current?.show({
                  pageX: e.pageX + 2,
                  pageY: e.pageY + 2,
                });
              }}
            >
              <svg
                viewBox='0 0 1024 1024'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                p-id='33036'
                width='32'
                height='32'
              >
                <path
                  d='M212 338c-24.852 0-45-20.148-45-45S187.148 248 212 248h600c24.852 0 45 20.148 45 45S836.852 338 812 338H212z m0 220c-24.852 0-45-20.148-45-45S187.148 468 212 468h600c24.852 0 45 20.148 45 45S836.852 558 812 558H212z m0 220c-24.852 0-45-20.148-45-45S187.148 688 212 688h600c24.852 0 45 20.148 45 45S836.852 778 812 778H212z'
                  p-id='33037'
                  fill='#ccc'
                ></path>
              </svg>
            </IconButton>
          </FlexDiv>
        )}
      </div>
    </Container>
  );
};

export default memo(Panel);

const Container = styled.div<{ isHide: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  & > div {
    transition: transform 0.3s ease;
    position: relative;
    z-index: 2;
    margin-top: 0.4rem;
    margin-left: 0.4rem;
    background: ${window.MACOS ? "#263c26" : "rgb(7 61 14)"};
    border-radius: 1rem;
    ${flexCenter};
    flex-direction: column;
    padding: 0.4rem;

    ${props => props.theme.replaceBg};

    ${Button}[data-fade] {
      animation: ${fadeIn} 0.3s linear;
    }
  }

  ${({ isHide }) =>
    isHide &&
    css`
      & > div {
        transform: translateX(-90%);
      }
      :hover {
        & > div {
          transform: translateX(0);
        }
      }
    `};
  @media screen and (max-width: 750px) {
    left: auto;
    top: 0.4rem;
    right: 0.4rem;
    transform: rotate(90deg) translateX(100%);
    transform-origin: top right;
  }
`;

const IconButton = styled.div`
  width: 2.3vmax;
  height: 2.3vmax;
  border-radius: 2.3vmax;
  transition: 0.3s linear;
  ${flexCenter};

  svg {
    width: 1.5vmax;
    height: 1.5vmax;
  }

  :hover {
    background-color: #000;
  }
`;
