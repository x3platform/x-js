// -*- ecoding=utf-8 -*-

/**
* @namespace debug
* @memberof x
* @description 基于 Console 对象的调试跟踪工具
*/
var debug = {

    // 相关链接
    // http://getfirebug.com/wiki/index.php/Console_API
    // https://developers.google.com/chrome-developer-tools/docs/console?hl=zh-CN#using_the_console_api

    /*#region 函数:log(object)*/
    /**
    * 记录普通的日志消息
    * @method log
    * @memberof x.debug
    * @param {object} object 对象
    */
    log: function(object)
    {
        // firebug
        if (!x.isUndefined(console))
        {
            console.log(object);
        }
    },
    /*#endregion*/

    /*#region 函数:warn(object)*/
    /**
    * 记录警告的日志消息
    * @method warn
    * @memberof x.debug
    * @param {object} object 对象
    */
    warn: function(object)
    {
        // firebug
        if (!x.isUndefined(console))
        {
            console.warn(object);
        }
    },
    /*#endregion*/

    /*#region 函数:error(object)*/
    /**
    * 记录错误的日志消息
    * @method error
    * @memberof x.debug
    * @param {object} object 对象
    */
    error: function(object)
    {
        // firebug
        if (!x.isUndefined(console))
        {
            console.error(object);
        }
    },
    /*#endregion*/

    /*#region 函数:assert(expression)*/
    /**
    * 断言
    * @method assert
    * @memberof x.debug
    * @param {string} expression 表达式
    */
    assert: function(expression)
    {
        // firebug
        if (!x.isUndefined(console))
        {
            console.assert(expression);
        }
    },
    /*#endregion*/

    /*#region 函数:time(name)*/
    /**
    * 计时器
    * @method time
    * @memberof x.debug
    * @param {string} name 计时器名称
    */
    time: function(name)
    {
        // firebug
        if (!x.isUndefined(console))
        {
            console.time(name);
        }
    },
    /*#endregion*/

    /*#region 函数:timeEnd(name)*/
    /**
    * 停止计时器
    * @method timeEnd
    * @memberof x.debug
    * @param {string} name 计时器名称
    */
    timeEnd: function(name)
    {
        // firebug
        if (!x.isUndefined(console))
        {
            console.timeEnd(name);
        }
    },
    /*#endregion*/

    /*#region 函数:timestamp()*/
    /**
    * 获取当前时间信息
    * @method timestamp
    * @memberof x.debug
    */
    timestamp: function()
    {
        // 显示时间格式
        var format = '{yyyy-MM-dd HH:mm:ss.fff}';
        // 当前时间戳
        var timestamp = new Date();

        return format.replace(/yyyy/, timestamp.getFullYear())
                     .replace(/MM/, (timestamp.getMonth() + 1) > 9 ? (timestamp.getMonth() + 1).toString() : '0' + (timestamp.getMonth() + 1))
                     .replace(/dd|DD/, timestamp.getDate() > 9 ? timestamp.getDate() : '0' + timestamp.getDate())
                     .replace(/hh|HH/, timestamp.getHours() > 9 ? timestamp.getHours() : '0' + timestamp.getHours())
                     .replace(/mm/, timestamp.getMinutes() > 9 ? timestamp.getMinutes() : '0' + timestamp.getMinutes())
                     .replace(/ss|SS/, timestamp.getSeconds() > 9 ? timestamp.getSeconds() : '0' + timestamp.getSeconds())
                     .replace(/fff/g, ((timestamp.getMilliseconds() > 99) ? timestamp.getMilliseconds() : (timestamp.getMilliseconds() > 9) ? '0' + timestamp.getMilliseconds() : '00' + timestamp.getMilliseconds()));
    }
    /*#endregion*/
};
