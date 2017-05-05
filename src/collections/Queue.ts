/**
* 队列
* @namespace queue
* @memberof x
*/
let self = {
  /*#region create()*/
  /**
   * 创建 队列
   * @description 创建 Queue 对象
   * @memberof x.queue
   * @returns {object} {@link x.queue.Queue|Queue} 对象
   * @example
   * // 初始化一个 Queue 对象
   * var queue = x.queue.create();
   */
  create: function () {
    return self.constructor();
  },

  /*#region 类:newQueue()*/
  /**
  * 队列
  * @description Queue 对象
  * @class Queue 队列
  * @constructor Queue
  * @memberof x.queue
  */
  constructor: function () {
    var queue = {

      // 内部数组对象
      innerArray: [],

      /**
      * 插入队列顶部元素
      * @method push
      * @memberof x.queue.Queue#
      */
      push: function (targetObject) {
        this.innerArray.push(targetObject);
      },
      /*#endregion*/

      /**
      * 弹出队列顶部元素
      * @method pop
      * @memberof x.queue.Queue#
      */
      pop: function () {
        if (this.innerArray.length === 0) {
          return null;
        }
        else {
          var targetObject = this.innerArray[0];

          // 将队列元素往前移动一个单位
          for (var i = 0; i < this.innerArray.length - 1; i++) {
            this.innerArray[i] = this.innerArray[i + 1];
          }

          this.innerArray.length = this.innerArray.length - 1;

          return targetObject;
        }
      },
      /*#endregion*/

      /**
      * 取出队列底部元素(并不删除队列底部元素)
      */
      peek: function () {
        if (this.innerArray.length === 0) {
          return null;
        }

        return this.innerArray[0];
      },
      /*#endregion*/

      /*#region 函数:clear()*/
      /**
      * 清空堆栈
      * @method clear
      * @memberof x.queue.Queue#
      */
      clear: function () {
        this.innerArray.length = 0; //将元素的个数清零即可
      },
      /*#endregion*/

      /*#region 函数:size()*/
      /**
      * 获得线性队列当前大小
      * @method size
      * @memberof x.queue.Queue#
      */
      size: function () {
        return this.innerArray.length;
      },
      /*#endregion*/

      /*#region 函数:isEmpty()*/
      /*
      * 判断一个线性队列是否为空
      * @method isEmpty
      * @memberof x.queue.Queue#
      */
      isEmpty: function () {
        return (this.innerArray.length === 0) ? true : false;
      }
      /*#endregion*/
    };

    return queue;
  }
  /*#endregion*/
};

export = self;
