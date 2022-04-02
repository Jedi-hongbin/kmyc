/*
 * @Author: hongbin
 * @Date: 2022-02-10 17:19:09
 * @LastEditors: hongbin
 * @LastEditTime: 2022-02-10 18:07:08
 * @Description:根据颜色获取相应颜色
 */

/**
 * @description: 调整颜色更亮更暗
 * @param {string} color 六位十六禁止颜色
 * @param {number} range 正负数决定颜色更改
 * @return {string} new color
 */

export function adjustColor(color: string, range: number) {
  let newColor = "#";
  for (let i = 0; i < 3; i++) {
    const hxStr = color.substr(i * 2 + 1, 2);
    let val = parseInt(hxStr, 16);
    val += range;
    if (val < 0) val = 0;
    else if (val > 255) val = 255;
    newColor += val.toString(16).padStart(2, "0");
  }
  return newColor;
}
// // #049204  #028102

// for (let index = 1; index <= 255; index++) {
//   console.log(adjustColor('#000000', index))
// }

export const randomColor = () => "#" + Math.random().toString(16).slice(-6);
