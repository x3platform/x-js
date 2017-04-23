// -*- ecoding=utf-8 -*-

import * as x from "./core";

/**
* 栈
* @namespace stack
* @memberof x
*/
let self = {
  /*#region 类:newStack()*/
  /**
   * 栈
   * @description 创建 Stack 对象
   * @memberof x.stack
   * @returns {object} {@link x.stack.Stack|Stack} 对象
   * @example
   * // 初始化一个 Stack 对象
   * var stack = x.stack.create();
   */
  create: function () {
    return self.constructor();
  },

  /*#region 类:newStack()*/
  /**
  * 栈
  * @description 创建 Stack 对象
  * @class Stack
  * @constructor Stack
  * @memberof x.stack
  */
  constructor: function () {
    var stack = {

      // 内部数组对象
      innerArray: [],

      /*
      * 插入栈顶元素
      */
      push: function (targetObject) {
        this.innerArray[this.innerArray.length] = targetObject;
      },
      /*#endregion*/

      /*
      * 弹出栈顶元素(并删除栈顶元素)
      */
      pop: function () {
        if (this.innerArray.length === 0) {
          return null;
        }
        else {
          var targetObject = this.innerArray[this.innerArray.length - 1];

          this.innerArray.length--;

          return targetObject;
        }
      },
      /*#endregion*/

      /*
      * 取出栈顶元素(并不删除栈顶元素)
      */
      peek: function () {
        if (this.innerArray.length === 0) {
          return null;
        }

        return this.innerArray[this.innerArray.length - 1];
      },
      /*#endregion*/

      /**
       * 清空堆栈
       */
      clear: function () {
        //将元素的个数清零即可
        this.innerArray.length = 0;
      },
      /*#endregion*/

      /*#region 函数:size()*/
      /**
      * 获得线性堆栈的当前大小
      * @method size
      * @memberof x.newStack#
      */
      size: function () {
        return this.innerArray.length;
      },
      /*#endregion*/

      /*
      * 判断一个线性堆栈是否为空
      */
      isEmpty: function () {
        return (this.innerArray.length === 0) ? true : false;
      }
      /*#endregion*/
    };

    return stack;
  }
  /*#endregion*/
};

export = self;
