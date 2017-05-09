import * as lang from "./base/lang";
import * as kernel from "./base/kernel";
import * as declare from "./base/declare";

import * as Hashtable from "./collections/Hashtable";
import * as Queue from "./collections/Queue";
import * as Stack from "./collections/Stack";
/**
 * X JavaScript Library
 * @namespace x
 */
var self = lang.extend({}, lang, kernel, {

  // 声明对象方法
  declare: declare,

  /*#region 函数:query(selector)*/
  /**
  * 精确查询单个表单元素。
  * @method query
  * @memberof x
  * @param {string} selector 选择表达式
  */
  query: function (selector) {
    if (lang.type(selector).indexOf('html') == 0) {
      // Html 元素类型 直接返回
      return selector;
    }
    else if (lang.type(selector) == 'string') {
      // var results = Sizzle.apply(window, Array.prototype.slice.call(arguments, 0));
      // return (results.length == 0) ? null : results[0];
      return document.querySelector(selector);
    }
  },
  /*#endregion*/

  /*#region 函数:queryAll(selector)*/
  /**
  * 精确查询单个表单元素。
  * @method query
  * @memberof x
  * @param {string} selector 选择表达式
  */
  queryAll: function (selector) {
    if (lang.type(selector).indexOf('html') == 0) {
      // Html 元素类型 直接返回
      var results = [];
      results.push(selector);

      return results;
    }
    else if (lang.type(selector) == 'string') {
      // return Sizzle.apply(window, Array.prototype.slice.call(arguments, 0));
      return document.querySelectorAll(selector);
    }
  },
  /*#endregion*/

  /**
   * 集合信息
   */
  collections: {},
});

// 集合信息
var collections = {
  Hashtable: Hashtable,
  Queue: Queue,
  Stack: Stack,
}

lang.extend(self.collections, collections);

export = self;
