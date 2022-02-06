import { useEffect } from "react";

/*
 * @Author: hongbin
 * @Date: 2022-02-06 18:09:31
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-06 18:11:36
 * @Description:useEffect的无依赖版本
 */
function useMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
}

export default useMount;
