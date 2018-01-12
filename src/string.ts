// -*- ecoding=utf-8 -*-

import * as x from './base';

// 字符两侧空格
// \uFEFF 表示 BOM(Byte Order Mark) 即字节序标记 相关链接:http://zh.wikipedia.org/wiki/字节顺序记号
// \xA0   表示 NBSP = CHAR(160) 即字节序标记 相关链接:http://zh.wikipedia.org/wiki/不换行空格
const trimExpr = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * @namespace string
 * @memberof x
 * @description 字符串
 */
let self = {
  // #region 函数:stringify(value)
  /**
   * 将其他类型的值转换成字符串
   * x.event.remove(target, type, listener, useCapture) 的快捷方法
   * @method stringify
   * @memberof x
   * @param {anything} value 值
   */

  /**
   * 将其他类型的值转换成字符串
   * @method stringify
   * @memberof x.string
   * @param {anything} value 值
   */
  stringify: function(value) {
    var outString = '';
    var type = x.type(value);
    // console.log(value + ' type:' + type);
    if (type !== 'string') {
      if (type === 'number' || type === 'boolean' || type === 'date') {
        outString = value + '';
      } else if (type === 'array') {
        outString = '[';
        x.each(value, function(index, node) {
          outString += self.stringify(value) + ',';
        });
        outString = self.rtrim(outString, ',');
        outString += ']';
      } else if (type === 'function') {
        outString = self.stringify(value.call(value));
      } else {
        // undefined or null
        outString = '';
      }
    }
    else
    {
        outString = value;
    }

    return outString;
  },
  // #endregion

  // #region 函数:trim(text, trimText)
  /**
   * 去除字符串两端空白或其他文本信息
   * @method trim
   * @memberof x.string
   * @param {String} text 文本信息.
   * @param {Number} [trimText] 需要去除的文本信息(默认为空白).
   */
  trim: function(text, trimText: string = undefined) {
    if (x.isUndefined(trimText)) {
      return text.replace(trimExpr, '');
    } else {
      return self.rtrim(self.ltrim(text, trimText), trimText);
    }
  },
  // #endregion

  // #region 函数:ltrim(text, trimText)
  /**
   * 去除字符串左侧空白
   * @method ltrim
   * @memberof x.string
   * @param {String} text 文本信息.
   * @param {Number} [trimText] 需要去除的文本信息(默认为空白).
   */
  ltrim: function(text, trimText: string = undefined) {
    if (x.isUndefined(trimText)) {
      return text.replace(/(^[\s\uFEFF\xA0]+)/g, '');
    } else {
      return text.replace(RegExp('(^' + trimText.replace(/\\/g, '\\\\') + ')', 'gi'), '');
    }
  },
  // #endregion

  // #region 函数:rtrim(text, trimText)
  /**
   * 去除字符串右侧空白
   * @method rtrim
   * @memberof x.string
   * @param {String} text 文本信息.
   * @param {Number} [trimText] 需要去除的文本信息(默认为空白).
   */
  rtrim: function(text, trimText: string = undefined) {
    if (x.isUndefined(trimText)) {
      return text.replace(/([\s\uFEFF\xA0]+$)/g, '');
    } else {
      return text.replace(RegExp('(' + trimText.replace(/\\/g, '\\\\') + '$)', 'gi'), '');
      // return (text.substr(text.length - trimText.length, trimText.length) === trimText) ? text.substr(0, text.length - trimText.length) : text;
    }
  },
  // #endregion

  // #region 函数:format(text, args)
  /**
   * 字符串格式化
   * @method format
   * @memberof x.string
   * @param {String} text 文本信息.
   * @param {Number} [args] 参数.
   */
  format: function(text) {
    if (arguments.length == 0) {
      // throw new ReferenceError('Hello');
      return null;
    }

    var text = arguments[0];

    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
      text = text.replace(re, arguments[i]);
    }

    return text;
  },
  // #endregion

  // #region 函数:ellipsis(text, length, hasEllipsis)
  /**
   * 字符串长度超过规定长度时, 左侧多余的字符显示省略号
   * @method left
   * @memberof x.string
   * @param {String} text 需要处理的字符串
   * @param {Number} length 长度范围
   * @param {bool} [hasEllipsis] 是否显示...
   * @example
   * // 返回 'java...'
   * x.string.ellipsis('javascript', 4);
   * @example
   * // 返回 'java'
   * x.string.ellipsis('javascript', 4, false);
   */
  ellipsis: function(text: string, length: number, hasEllipsis: boolean = true) {
    if (text.length === 0) {
      return text;
    }

    if (text.length > length) {
      return text.substr(0, length) + (hasEllipsis ? '...' : '');
    } else {
      return text;
    }
  }
  // #endregion
};

export = self;
