let timers = {};
const namePrefix='timer$';

/**
  * 计时器
  * @class Timer 计时器
  * @constructor Timer
  * @memberof x
  * @param {number} interval 时间间隔(单位:秒)
  * @param {function} callback 回调函数
  * @example
  * // 初始化一个计时器
  * var timer = x.newTimer(5, function(timer) {
  *   console.log(new Date());
  *   // 停止计时器
  *   timer.stop();
  * });
  * // 启动计时器
  * timer.start();
  */
export class Timer {
  // 定时器的名称
  name: string;
  // 定时器的间隔
  interval: number;
  // 回调函数
  callback: Function;
  // 定时器标识
  timerId: number = -1;

  /**
  * 构造函数
  */
  constructor(interval: number, callback: Function) {
    this.name = namePrefix + Math.ceil(Math.random() * 900000000 + 100000000);
    this.interval = interval * 1000;
    this.callback = callback;
  }

  /*#region 函数:run()*/
  /**
  * 执行回调函数
  * @private
  * @method run
  * @memberof x.Timer#
  */
  run() {
    this.callback(this);
  }
  /*#endregion*/


  /*#region 函数:start()*/
  /**
  * 启动计时器
  * @method start
  * @memberof x.Timer#
  */
  start() {
    var that = timers[this.name] = this;
    this.timerId = setInterval(function () { timers[that.name].run() }, this.interval);
  }
  /*#endregion*/

  /*#region 函数:stop()*/
  /**
  * 停止计时器
  * @method stop
  * @memberof x.Timer#
  */
  stop() {
    clearInterval(this.timerId);
  }
  /*#endregion*/
}
