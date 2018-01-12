/**
 * X JavaScript Library
 * @namespace x
 */
var self = {

  // #region 函数:type(object)
  /**
   * 检查对象类型
   * @method type
   * @memberof x
   * @param {any} object 对象
   */
  type: function (object) {
    try {
      // 处理 Undefined 类型
      if (typeof (object) === 'undefined') { return 'undefined'; }
      // 处理 Null 类型;
      if (object === null) { return 'null'; }
      // 通用类型处理
      return /\[object ([A-Za-z]+)\]/.exec(Object.prototype.toString.call(object))[1].toLowerCase();
    }
    catch (ex) {
      if (ex instanceof RangeError) { return '...'; }

      throw ex;
    }
  },
  // #endregion

  // #region 函数:isArray(object)
  /**
  * 判断对象是否是 Array 类型
  * @method isArray
  * @memberof x
  */
  isArray: function (object) { },
  // #endregion

  // #region 函数:isFunction(object)
  /**
  * 判断对象是否是 Function 类型
  * @method isFunction
  * @memberof x
  */
  isFunction: function (object) { },
  // #endregion

  // #region 函数:isString(object)
  /**
  * 判断对象是否是 String 类型
  * @method isString
  * @memberof x
  */
  isString: function (object) { },
  // #endregion

  // #region 函数:isNumber(object)
  /**
  * 判断对象是否是 Number 类型
  * @method inspect
  * @memberof Object
  */
  isNumber: function (object) { },
  // #endregion

  // #region 函数:isUndefined(value, replacementValue)
  /**
  * 判断是否是 undefined 类型, 如果设置了替换的值, 则当第一个参数为 undefined, 则使用替换的值
  * @method isUndefined
  * @memberof x
  * @param {Object} value 值
  * @param {String} [replacementValue] 替换的值
  * @example
  * // return true
  * x.isUndefined(undefinedValue);
  * @example
  * // return ''
  * x.isUndefined(undefinedValue, '');
  */
  isUndefined: function (object) { },
  // #endregion

  // #region 函数:extend(destination, source)
  /**
  * 将来源对象的属性和方法扩展至目标对象
  * @method extend
  * @memberof x
  * @param destination 目标对象
  * @param source 来源对象
  */
  extend: function (destination, ...source) {
    var result = arguments[0] || {};

    if (arguments.length > 1) {
      for (var i = 1, l = arguments.length; i < l; i++) {
        for (var property in arguments[i]) {
          result[property] = arguments[i][property];
        }
      }
    }

    return result;
  },
  // #endregion

  // #region 函数:clone(object)
  /**
  * 克隆对象
  * @method clone
  * @memberof x
  * @returns {Object} 克隆的对象
  */
  clone: function (object) {
    return self.extend({}, object);
  },
  // #endregion

  /**
   * 定义事件目标
   */
  EventTarget: function () {
    this.eventListeners = {};

    /**
     * 添加事件
     */
    this.addEventListener = function (type, listener) {
      if (typeof type === "string" && typeof listener === "function") {
        if (typeof this.eventListeners[type] === "undefined") {
          this.eventListeners[type] = [listener];
        } else {
          this.eventListeners[type].push(listener);
        }
      }
      return this;
    }

    /**
     * 删除事件
     */
    this.removeEventListener = function (type, listener) {
      var listeners = this.eventListeners[type];
      if (listeners instanceof Array) {
        if (typeof listener === "function") {
          for (var i = 0, length = listeners.length; i < length; i += 1) {
            if (listeners[i] === listener) {
              listeners.splice(i, 1);
              break;
            }
          }
        } else if (listener instanceof Array) {
          for (var lis = 0, lenkey = listener.length; lis < lenkey; lis += 1) {
            this.unbind(type, listener[lenkey]);
          }
        } else {
          delete this.eventListeners[type];
        }
      }
      return this;
    }

    /**
     * 执行事件
     */
    this.fire = function (type) {
      if (type && this.eventListeners[type]) {
        var events = { type: type, target: this };
        for (var length = this._listener[type].length, start = 0; start < length; start += 1) {
          this.eventListeners[type][start].call(this, events);
        }
      }
      return this;
    };
  }
};

// 定义类型判断
let types = ["Array", "Function", "String", "Number", "Undefined"];

for (let i = 0; i < types.length; i++) {
  self['is' + types[i]] = function (object) {
    return self.type(object) === types[i].toLowerCase();
  };
}

export = self;
