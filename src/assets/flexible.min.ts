export {};
(function flexible(window, document) {
  var docEl = document.documentElement;
  var dpr = window.devicePixelRatio || 1;

  // adjust body font size
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + "px";
    } else {
      document.addEventListener("DOMContentLoaded", setBodyFontSize);
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 24 将页面分成24份
  function setRemUnit() {
    var rem = docEl.clientWidth / 48;
    docEl.style.fontSize = rem + "px";
  }

  setRemUnit();

  // reset rem unit on page resize
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  });

  // detect 0.5px supports
  //   if (dpr >= 2) {
  //     var fakeBody = document.createElement("body");
  //     var testElement = document.createElement("div");
  //     testElement.style.border = ".5px solid transparent";
  //     fakeBody.appendChild(testElement);
  //     docEl.appendChild(fakeBody);
  //     if (testElement.offsetHeight === 1) {
  //       docEl.classList.add("hairlines");
  //     }
  //     docEl.removeChild(fakeBody);
  //   }

  //注入适配移动端全局变量
  const { offsetWidth, offsetHeight } = document.body;
  window.pageWidth = offsetWidth;
  // window.isPhone = offsetWidth < 750 || offsetHeight < 750;
  window.isPhone = offsetWidth < 750;
  window.vmax = (range: number) => (offsetWidth / 100) * range;
  window.vmin = (range: number) => (offsetHeight / 100) * range;
  //不是window即使用 mac配色
  window.MACOS = navigator.userAgent.indexOf("Windows") === -1;
})(window, document);
