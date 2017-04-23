// -*- ecoding=utf-8 -*-

import * as x from "./core";

/**
* 栈
* @namespace dictionary
* @memberof x
*/

let self = {
  /*#region create()*/
  /**
   * 创建 队列
   * @description 创建 Dictionary 对象
   * @memberof x.dictionary
   * @returns {object} {@link x.dictionary.Dictionary|Dictionary} 对象
   * @example
   * // 初始化一个 Dictionary 对象
   * var queue = x.dictionary.create();
   */
  create: function () {
    return self.constructor();
  },

  /*#region 类:newHashTable()*/
  /**
  * 哈希表
  * @class HashTable 哈希表
  * @constructor Dictionary
  * @memberof x
  * @example
  * // returns HashTable
  * var hashtable = x.newHashTable();
  */
  constructor: function () {
    var dictionary = {

      // 内部数组对象
      innerArray: [],

      /*#region 函数:clear()*/
      /**
      * 清空哈希表
      * @method clear
      * @memberof x.dictionary.Dictionary#
      */
      clear: function () {
        this.innerArray = [];
      },
      /*#endregion*/

      /*#region 函数:exist(key)*/
      /**
      * 判断是否已存在相同键的对象
      * @method exist
      * @memberof x.dictionary.Dictionary#
      * @returns {bool}
      */
      exist: function (key) {
        for (var i = 0; i < this.innerArray.length; i++) {
          if (this.innerArray[i].name === key) {
            return true;
          }
        }

        return false;
      },
      /*#endregion*/

      /*#region 函数:get(index)*/
      /**
      * @method get
      * @memberof x.dictionary.Dictionary#
      */
      get: function (index) {
        return this.innerArray[index];
      },
      /*#endregion*/

      /*#region 函数:add(key, value)*/
      /**
      * @method add
      * @memberof x.dictionary.Dictionary#
      */
      add: function (key, value) {
        if (arguments.length === 1) {
          var keyArr = key.split(';');

          for (var i = 0; i < keyArr.length; i++) {
            var valueArr = keyArr[i].split('#');

            this.innerArray.push({ key: valueArr[0], value: valueArr[1] });
          }
        }
        else {
          if (this.exist(key)) {
            throw 'hashtable aleardy exist same key[' + key + ']';
          }
          else {
            this.innerArray.push({ key: key, value: value });
          }
        }
      },
      /*#endregion*/

      /*#region 函数:find(key)*/
      /**
      * @method find
      * @memberof x.dictionary.Dictionary#
      */
      find: function (key) {
        for (var i = 0; i < this.innerArray.length; i++) {
          if (this.innerArray[i].key === key) {
            return this.innerArray[i].value;
          }
        }

        return null;
      },
      /*#endregion*/

      /*#region 函数:size()*/
      /**
      * 获取哈希表的当前大小
      * @method size
      * @memberof x.dictionary.Dictionary#
      */
      size: function () {
        return this.innerArray.length;
      }
      /*#endregion*/
    };

    return dictionary;
  }
  /*#endregion*/
};

export = self;
