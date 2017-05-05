// -*- ecoding=utf-8 -*-

// import * as x from "./core";
import * as declare from "./base/declare";

/*#region 类:Dict()*/
/**
* 字典
* @class Dict 字典
* @constructor Dict
* @memberof x
* @example
* // returns Dict
* var dict = x.Dict();
*/
let self = declare({

  // 内部数组对象
  // innerArray: [],
  constructor: function () {
    this.innerArray = [];
  },
  /*#region 函数:clear()*/
  /**
  * 清空字典
  * @method clear
  * @memberof x.Dict#
  */
  clear: function () {
    this.innerArray = [];
  },
  /*#endregion*/

  /*#region 函数:exist(key)*/
  /**
  * 判断是否已存在相同键的对象
  * @method exist
  * @memberof x.Dict#
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

  /*#region 函数:index(key)*/
  /**
  * @method index
  * @memberof x.Dict#
  */
  index: function (key) {
    for (var i = 0; i < this.innerArray.length; i++) {
      if (this.innerArray[i].key === key) {
        return i;
      }
    }
    return -1;
  },
  /*#endregion*/

  /*#region 函数:add(key, value)*/
  /**
  * @method add
  * @memberof x.Dict#
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
        throw 'dict aleardy exist same key[' + key + ']';
      }
      else {
        this.innerArray.push({ key: key, value: value });
      }
    }
  },
  /*#endregion*/

  /*#region 函数:remove(key)*/
  /**
  * @method remove
  * @memberof x.Dict#
  */
  remove: function (key) {
    var i = this.index(key);
    if (i > -1) {
      this.innerArray.splice(i, 1);
    }
  },

  // remove
  // ke

  /*#region 函数:find(key)*/
  /**
  * @method find
  * @memberof x.Dict#
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
  * 获取字典的当前大小
  * @method size
  * @memberof x.Dict#
  */
  size: function () {
    return this.innerArray.length;
  }
  /*#endregion*/
});

export = self;
