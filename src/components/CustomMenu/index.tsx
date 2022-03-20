/*
 * @Author: hongbin
 * @Date: 2022-03-19 21:53:41
 * @LastEditors: hongbin
 * @LastEditTime: 2022-03-20 21:09:43
 * @Description:自定义鼠标右键菜单
 */
import {
  createRef,
  FC,
  memo,
  ReactElement,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { source } from "../../container/LoadingScreen/DataSource";
import { controls } from "../../container/Map/utils";
import useMount from "../../hook/useMount";
import { fadeIn } from "../../styled";
import { chartBG } from "../../styled/GlobalStyle";
import { BGMusicRef } from "../BackGroundMusic";
import MenuItem from "./MenuItem";

interface MenuLayout {
  x: number;
  y: number;
}

export const CustomMenuRef = createRef<{
  show: (e: { pageX: number; pageY: number }) => void;
}>();

interface IProps {}

const CustomMenu: FC<IProps> = (): ReactElement => {
  const [isShowMenu, setIsShowMenu] = useState(false); // 是否展示菜单
  const [menuLayout, setMenuLayout] = useState<MenuLayout>({ x: 0, y: 0 }); // 菜单左上角位置
  const wrap = useRef<HTMLDivElement>(null);

  useMount(() => {
    document.addEventListener("contextmenu", (e: any) => {
      if (e.target.getAttribute("canvas") === "1") return;
      e.preventDefault();
      let x = e.pageX + 2;
      let y = e.pageY;
      if (e.pageX + wrap.current?.offsetWidth > document.body.offsetWidth)
        x = e.pageX - wrap.current!.offsetWidth;
      if (e.pageY + wrap.current?.offsetHeight > document.body.offsetHeight)
        y = document.body.offsetHeight - wrap.current!.offsetHeight - 10;
      setMenuLayout({ x, y });
      setIsShowMenu(true);
    });
  });

  useImperativeHandle(
    CustomMenuRef,
    () => ({
      show: (e: { pageX: number; pageY: number }) => {
        //按钮右侧不会显示不全不必判断位置是否合理
        setIsShowMenu(true);
        setMenuLayout({ x: e.pageX, y: e.pageY });
      },
    }),
    []
  );

  return (
    <Container
      style={{ visibility: isShowMenu ? "visible" : "hidden" }}
      onClick={(e: any) => {
        if (
          e.target.nodeName === "SECTION" ||
          e.target.getAttribute("name") === "1"
        )
          setIsShowMenu(false);
      }}
    >
      <Menu
        ref={wrap}
        layout={menuLayout}
        onMouseLeave={() => setIsShowMenu(false)}
      >
        <SubTitle>快捷菜单</SubTitle>
        {BGMusicRef.current?.audio ? (
          <MenuItem
            text={
              BGMusicRef.current.audio.paused ? "开启背景音乐" : "关闭背景音乐"
            }
            onClick={BGMusicRef.current.toggle}
          />
        ) : null}
        <MenuItem
          text={controls.autoRotate ? "关闭镜头旋转" : "开启镜头旋转"}
          onClick={() => {
            controls.autoRotate = !controls.autoRotate;
          }}
        />
        <MenuItem
          text={"数据来源"}
          option={source.map(({ name, href }) => ({
            title: name,
            onClick: () => {
              window.open(href, "_blank");
            },
          }))}
          renderCheck={menuLayout}
        />
      </Menu>
    </Container>
  );
};

export default memo(CustomMenu);

const Container = styled.section`
  position: fixed;
  z-index: 999999;
  /**
  * 多一些宽高 不会在边界处自动使用布局 导致width，height获取不正确
  */
  width: 130vw;
  height: 130vh;

  animation: ${fadeIn} 0.1s linear;
`;

const Menu = styled.div<{ layout: MenuLayout }>`
  padding: 1vh;
  ${chartBG};
  position: absolute;
  border-radius: 1vh;
  font-size: 1vw;
  color: #205120;
  box-shadow: 5px 3px 11px 5px #364637bd;

  ${({ layout: { x, y } }) => `top: ${y}px;left:${x}px`};
`;

const SubTitle = styled.span`
  color: #023802;
  font-size: 0.9em;
`;
