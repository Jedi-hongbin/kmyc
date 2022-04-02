/*
 * @Author: hongbin
 * @Date: 2022-03-01 20:49:44
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-08 09:02:40
 * @Description: 战役详情
 */
import {
  createRef,
  FC,
  ReactElement,
  useImperativeHandle,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { controls, IPositionConfigure } from "../../container/Map/utils";
import useMount from "../../hook/useMount";
import { Button } from "../../styled/Button";

interface IProps {}

export const CampaignDetailRef = createRef<{ hide: () => void }>();

const CampaignDetail: FC<IProps> = (): ReactElement => {
  const [isHide, setIsHide] = useState(true);
  const [details, setDetails] = useState<IPositionConfigure | null>(null);

  useMount(() => {
    window.addEventListener("custom_showCombatInfo", (e: any) => {
      setIsHide(false);
      setDetails(e.detail);
    });
  });

  useImperativeHandle(
    CampaignDetailRef,
    () => ({
      hide: () => setIsHide(true),
    }),
    []
  );

  if (!details) return <Container isHide={isHide}></Container>;

  return (
    <Container isHide={isHide}>
      <h3>{details.name}</h3>

      <h6>敌: {details.bothSides[0]}</h6>
      <h6>我: {details.bothSides[1]}</h6>
      <p>{details.results}</p>
      <div>
        {details.images?.map(img => (
          <img
            key={img}
            alt=''
            src={`${process.env.REACT_APP_URL}small/${img}.jpg`}
          />
        ))}
      </div>

      <Button
        primary='#aaffaa'
        size='medium'
        onClick={() => {
          setIsHide(true);
          controls.autoRotate = true;
        }}
      >
        隐藏
      </Button>
    </Container>
  );
};

export default CampaignDetail;

const hideStyle = css`
  opacity: 0;
  visibility: hidden;
  transform: translateX(100%);
`;

const Container = styled.div<{ isHide: boolean }>`
  position: fixed;
  color: #fffae5;
  width: 39vmax;
  /* height: 96vmin; */
  padding: 1vmin;
  bottom: 2vmin;
  right: 1vmax;
  background: radial-gradient(#35523587, #437143 90%);
  transition-property: opacity, visibility, transform;
  transition-duration: 0.3s, 0.4s, 0.3s;
  transition-timing-function: ease;
  border-radius: 2vmax;
  box-shadow: -1px -1px 1vmax #2a472e;
  z-index: 2;
  overflow: hidden;

  h3 {
    text-align: center;
    letter-spacing: 2px;
    color: #e6e5e5;
    font-size: 3vmin;
  }

  h6 {
    margin: 1vmin 0;
    color: #f8f1d4;
    margin: 1vmin 2vmin;
    font-size: 2vmin;
  }

  p {
    margin: 2vmin;
    color: #f0e8c6;
    font-size: 2vmin;
    text-align: left;
    line-height: 3vmin;
  }

  div {
    display: flex;
    overflow: scroll hidden;

    img {
      border-radius: 1vmin;
      margin-left: 1vmax;
      max-width: 13vmax;
      margin-bottom: 1vmin;
      height: 12vmin;
    }

    ::-webkit-scrollbar-thumb {
      background: #afa;
      border-radius: 4px;
    }
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: rgba(1, 1, 1, 0);
    }
  }

  ${({ isHide }) => isHide && hideStyle};
  @media screen and (max-width: 750px) {
    transform-origin: right bottom;
    transform: rotate(90deg);
    right: 98vmin;
  }
`;
