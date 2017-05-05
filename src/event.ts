// -*- ecoding=utf-8 -*-

import * as x from "./base";

/**
* 事件
* @namespace event
* @memberof x
*/
let self = {

    /*#region 函数:getEvent(event)*/
    /**
    * 获取事件对象
    * @method getEvent
    * @memberof x.event
    * @param {event} event 事件对象
    */
    getEvent: function (event) {
      return window.event ? window.event : event;
    },
    /*#endregion*/

    /*#region 函数:getTarget(event)*/
    /**
    * 获取事件的目标对象
    * @method getTarget
    * @memberof x.event
    * @param {event} event 事件对象
    */
    getTarget: function (event) {
      return window.event ? window.event.srcElement : (event ? event.target : null);
    },
    /*#endregion*/

    /*#region 函数:getPosition(event)*/
    /**
    * 获取事件的光标坐标
    * @method getPosition
    * @memberof x.event
    * @param {event} event 事件对象
    */
    getPosition: function (event) {
      var docElement = document.documentElement;

      var body = document.body || { scrollLeft: 0, scrollTop: 0 };

      return {
        x: event.pageX || (event.clientX + (docElement.scrollLeft || body.scrollLeft) - (docElement.clientLeft || 0)),
        y: event.pageY || (event.clientY + (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0))
      };
    },
    /*#endregion*/

    /*#region 函数:preventDefault(event)*/
    /**
    * 取消事件的默认动作
    * @method preventDefault
    * @memberof x.event
    * @param {event} event 事件对象
    */
    preventDefault: function (event) {
      // 如果提供了事件对象，则这是一个非IE浏览器
      if (event && event.preventDefault) {
        //阻止默认浏览器动作(W3C)
        event.preventDefault();
      }
      else {
        //IE中阻止函数器默认动作的方式
        window.event.returnValue = false;
      }
    },
    /*#endregion*/

    /*#region 函数:stopPropagation(event)*/
    /**
    * 停止事件传播
    * @method stopPropagation
    * @memberof x.event
    * @param {event} event 事件对象
    */
    stopPropagation: function (event) {
      // 判定是否支持触摸
      //            suportsTouch = ("createTouch" in document);

      //            var touch = suportsTouch ? event.touches[0] : event;

      //            if (suportsTouch)
      //            {
      //                touch.stopPropagation();
      //                touch.preventDefault();
      //            }
      //            else
      //            {

      //如果提供了事件对象，则这是一个非IE浏览器
      if (event && event.stopPropagation) {
        //因此它支持W3C的stopPropagation()方法
        event.stopPropagation();
      }
      else {
        //否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
      }

      return false;
    },
    /*#endregion*/

    /*#region 函数:add(target, type, listener, useCapture)*/
    /**
    * 添加事件监听器
    * @method add
    * @memberof x.event
    * @param {string} target 监听对象
    * @param {string} type 监听事件
    * @param {string} listener 处理函数
    * @param {string} [useCapture] 监听顺序方式
    */
    add: function (target, type, listener, useCapture?) {
      if (target == null) return;

      if (target.addEventListener) {
        target.addEventListener(type, listener, useCapture);
      }
      else if (target.attachEvent) {
        target.attachEvent('on' + type, listener);
      }
      else {
        target['on' + type] = listener;
      }
    },
    /*#endregion*/

    /*#region 函数:remove(target, type, listener, useCapture)*/
    /**
    * 移除事件监听器
    * @method remove
    * @memberof x.event
    * @param {string} target 监听对象
    * @param {string} type 监听事件
    * @param {string} listener 处理函数
    * @param {string} [useCapture] 监听顺序方式
    */
    remove: function (target, type, listener, useCapture?) {
      if (target == null) return;

      if (target.removeEventListener) {
        target.removeEventListener(type, listener, useCapture);
      }
      else if (target.detachEvent) {
        target.detachEvent('on' + type, listener);
      }
      else {
        target['on' + type] = null;
      }
    }
    /*#endregion*/
};

export = self;
