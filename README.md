> TODO:
>
> - ~~战役动画时 面板贴边~~
> - ~~战役播放字幕 --音效~~
> - ~~自适应图标 字幕等元素 resize 时自动处理~~
> - 汉城和首尔市一个城市
> - 战役模型 3 进攻路线 太同步死板
> - 战役模型 4 播放太快了 而且日期使用了中文句号
> - ~~播放战役时 图标推出~~
> - ~~播放战役同时播放弹幕有卡顿~~
> - ~~增加回到主页按钮~~

2022-02-21

> - 移动端右上角图标部分浏览器右侧超出屏幕
> - ~~每次战役加入建模战斗数据~~
> - ~~加入背景音乐~~
> - ~~修改当前加载动画--翻开历史书形式 同时加载数据~~
> - 加入模块: 战斗概述
> - 图标加入展示敌我投入力量对比
> - ~~mousemove 事件加入截流 减少计算~~

2022-02-23

> - 在需要的时候调用 controls.update 减少卡顿
> - safari 浏览器 按钮动画 伪元素 transform 动画超出 overflow:hidden 范围

2022-02-28

> - 在需要的时候调用 controls.update 减少卡顿 可参考 http://www.chubao.cn/s/godness/index.html
> - 战役素材少，每场战役中的战斗有地点标注 点击出现相关事件意义 照片 可取自 跨过鸭绿江电视剧

2022-03-1

> - 击毁武器表 改成 双方伤亡对比 目前未查询到权威且详细数据

2022-03-2

> - 按钮单位改用 vmax 或 媒体查询大屏显示器
> - ~~大屏设备 echart 图标 title 距离左侧显得近~~
> - ~~概述文字 卡顿 尝试优化 减少 dom 绘制~~
> - 地图背景颜色在 window 上不明显
> - 播放动画前讲解当前局势
> - ~~进军进度 箭头点击事件 触发显式事件~~

2022 - 03 -10

> - ~~模型优化~~
> - ~~模型动画减速~~
> - window 颜色显示统一

2022-03-12

> - ~~requestAnimationFrame 计算当前帧和建模动画帧对比达到某点切换视野 替代计时器~~ ---- 宣告破产
>
> * ~~尝试 动画的 reset 方法能否解决每次删除添加动画模型~~ - 不能

2022-03-13

> - 探索动画使用方式放在一起使用会不会对性能有提高

2022-03-19

> - 根据新模型重新制定视野位置
> - 需要 hover 的模型才动画交互
> - ~~箭头信息需跟新模型适配~~
> - 屏蔽右键菜单 右键自定义菜单 快捷功能按钮如 停止播放 停止音乐 描述信息 等
> - ~~动画节点 添加控制面板 点击切换动画进度~~

2022-03-21

> - ~~大屏幕 图表中字体太小~~
> - ~~动画进度音频进度同步~~

2022-03-30

> - ~~背景音乐 分成两段 军号声只播放一遍 剩余部分循环~~
> - ~~进度条控制讲解音频准确定位 放弃采用百分比模糊计算~~ > ~~点击进度条播放 播放方式和第一次观看动画行为一致 停止自动旋转 。。。~~

2022-04-01

> - 提升动画最后几帧模型的稳定性 快速滑动可能最后帧的模型不会.play()方法
> - 再次尝试取消逐帧渲染 提升性能
> - 再次修改 window 配色
> - 在 window 上调试
