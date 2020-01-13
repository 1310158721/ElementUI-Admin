/**
 * 工具函数
 */

/**
 * 防抖函数
 * 一个需要频繁触发的函数，在规定时间内，只让最好一次生效，前面的不生效
 * 规定时间内多次点击，最后一次才生效
 * @param { 需要执行的函数 } fn 
 * @param { 规定的时间期限 } delay 
 */
export const preventShake = (fn, delay) => {
  // 记录上一次函数触发的时间
  let lastTime = 0;
  return function () {
      // 记录当前函数触发的时间
      let nowTime = new Date().getTime();
      if (nowTime - lastTime > delay) {
          // 修正 this 指向
          fn.call(this);
          // 同步时间
          lastTime = nowTime;
      }
  };
};

/**
 * 节流函数
 * 一个需要频繁触发的函数，在规定时间内，只让最好一次生效，后面的不生效
 * 规定时间内多次点击，第一次才生效
 * @param { 需要执行的函数 } fn 
 * @param { 规定的时间期限 } delay
 * @param { 传递的参数 } params
 */
export const throttle = (fn, delay) => {
  // 记录上一次函数触发的时间
  let lastTime = 0;
  return function () {
      // 记录当前函数触发的时间
      let nowTime = new Date().getTime();
      if (nowTime - lastTime > delay) {
          // 修正 this 指向
          fn.call(this, ...arguments);
          // 同步时间
          lastTime = nowTime;
      }
  };
};
