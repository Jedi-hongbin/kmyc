/**
 * @description: 派发推出事件 让chart 图表退出显示区域
 * @param {boolean} true->推出 false -> 恢复
 */
export const detrusionChart = (detrusion: boolean) => {
  const Event = new CustomEvent("custom_detrusion", {
    detail: { detrusion: !detrusion },
  });
  window.dispatchEvent(Event);
};

/**
 * @description:编程式触发图标重新自适应布局
 * @param {string[]} 需要更新的图标标识
 * @return {void}
 */
export const resizeChart = (...charts: string[]) => {
  const resizeEvent = new CustomEvent("charts_resize", {
    //   detail: { key: ["us"] },
    detail: { key: charts },
  });
  window.dispatchEvent(resizeEvent);
};

/**
 * @description:显示战斗信息
 * @param {object} 战斗信息
 * @return {void}
 */
export const showCombatInfo = (detail: object) => {
  const resizeEvent = new CustomEvent("custom_showCombatInfo", {
    detail,
  });
  window.dispatchEvent(resizeEvent);
};
