import * as declare from '../base/declare';

/**
 * 队列
 * @namespace queue
 * @memberof x
 */
let self = declare({
  // #region 类:constructor()
  /**
   * 队列
   * @description Queue 对象
   * @class Queue 队列
   * @constructor Queue
   * @memberof x.collections
   */
  constructor: function() {
    // 内部数组对象
    this.innerArray = [];
  },

  /**
       * 插入队列顶部元素
       * @method push
       * @memberof x.collections.Queue#
       */
  push: function(targetObject) {
    this.innerArray.push(targetObject);
  },
  // #endregion

  /**
   * 弹出队列顶部元素
   * @method pop
   * @memberof x.collections.Queue#
   */
  pop: function() {
    if (this.innerArray.length === 0) {
      return null;
    } else {
      var targetObject = this.innerArray[0];

      // 将队列元素往前移动一个单位
      for (var i = 0; i < this.innerArray.length - 1; i++) {
        this.innerArray[i] = this.innerArray[i + 1];
      }

      this.innerArray.length = this.innerArray.length - 1;

      return targetObject;
    }
  },
  // #endregion

  /**
   * 取出队列底部元素(并不删除队列底部元素)
   */
  peek: function() {
    if (this.innerArray.length === 0) {
      return null;
    }

    return this.innerArray[0];
  },
  // #endregion

  // #region 函数:clear()
  /**
   * 清空堆栈
   * @method clear
   * @memberof x.collections.Queue#
   */
  clear: function() {
    //将元素的个数清零即可
    this.innerArray.length = 0;
  },
  // #endregion

  // #region 函数:size()
  /**
   * 获得线性队列当前大小
   * @method size
   * @memberof x.collections.Queue#
   */
  size: function() {
    return this.innerArray.length;
  },
  // #endregion

  // #region 函数:isEmpty()
  /**
   * 判断一个线性队列是否为空
   * @method isEmpty
   * @memberof x.collections.Queue#
   */
  isEmpty: function() {
    return this.innerArray.length === 0 ? true : false;
  }
  // #endregion
});

export = self;
