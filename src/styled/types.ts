export type JustifyContentProps =
  | "center"
  | "space-between"
  | "flex-start"
  | "flex-end"
  | "space-around"
  | "space-evenly";

export type AlignItems = "center" | "flex-end" | "flex-start";

export type TPosition =
  | "absolute"
  | "fixed"
  | "relative"
  | "static"
  | "sticky"
  | "-ms-page"
  | "-webkit-sticky";

export interface IRoute {
  path: string;
  name?: string;
  exact?: boolean;
  Component: React.FunctionComponent;
}

export type FlexWrap =
  | "nowrap"
  | "wrap"
  | "wrap-reverse"
  | "initial"
  | "inherit";
