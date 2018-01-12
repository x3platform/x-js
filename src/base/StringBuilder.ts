/**
  * 高效字符串构建器<br />
  * 注: 现在的主流浏览器都针对字符串连接作了优化，所以性能要好于StringBuilder类，不推荐使用，仅作字符串算法研究。
  * @class StringBuilder
  * @constructor StringBuilder
  * @memberof x
  */
export class StringBuilder {

  // 内部数组对象
  innerArray: string[] = [];

  /**
  * 构造函数
  */
  constructor() {
    // this.innerArray = [];
  }

  // #region 函数:append(text)
  /**
  * 附加文本信息
  * @method append
  * @memberof x.StringBuilder#
  * @param {String} text 文本信息
  */
  append(text: string) {
    this.innerArray[this.innerArray.length] = text;
  }
  // #endregion

  // #region 函数:toString()
  /**
  * 转换为字符串
  * @method toString
  * @memberof x.StringBuilder#
  * @returns {String}
  */
  toString() {
    return this.innerArray.join('');
  }
  // #endregion
}
