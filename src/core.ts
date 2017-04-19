var x = {

    /*#region 函数:type(object)*/
    /**
    * 检查对象类型
    * @method type
    * @memberof x
    */
    type: function (object) {
        try {
            if (typeof (object) === 'undefined') { return 'undefined'; }
            if (object === null) { return 'null'; }

            return /\[object ([A-Za-z]+)\]/.exec(Object.prototype.toString.call(object))[1].toLowerCase();
        }
        catch (ex) {
            if (ex instanceof RangeError) { return '...'; }

            throw ex;
        }
    },
    /*#endregion*/

    /*#region 函数:isArray(object)*/
    /**
    * 判断对象是否是 Array 类型
    * @method isArray
    * @memberof x
    */
    isArray: function (object) {
        return x.type(object) === 'array';
    },
    /*#endregion*/

    /*#region 函数:isFunction(object)*/
    /**
    * 判断对象是否是 Function 类型
    * @method isFunction
    * @memberof x
    */
    isFunction: function (object) {
        return x.type(object) === 'function';
    },
    /*#endregion*/

    /*#region 函数:isString(object)*/
    /**
    * 判断对象是否是 String 类型
    * @method isString
    * @memberof x
    */
    isString: function (object) {
        return x.type(object) === 'string';
    },
    /*#endregion*/

    /*#region 函数:isNumber(object)*/
    /**
    * 判断对象是否是 Number 类型
    * @method inspect
    * @memberof Object
    */
    isNumber: function (object) {
        return x.type(object) === 'number';
    },
    /*#endregion*/

    /*#region 函数:isUndefined(value, replacementValue)*/
    /**
    * 判断是否是 undefined 类型, 如果设置了替换的值, 则当第一个参数为 undefined, 则使用替换的值
    * @method isUndefined
    * @memberof x
    * @param {object} value 值
    * @param {string} [replacementValue] 替换的值
    * @example
    * // return true
    * x.isUndefined(undefinedValue);
    * @example
    * // return ''
    * x.isUndefined(undefinedValue, '');
    */
    isUndefined: function (object) {
        return x.type(object) === 'undefined';
    },
    /*#endregion*/

    // 脚本代码片段
    scriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',

    // 脚本代码片段
    jsonFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,

    // 一种简单的方法来检查HTML字符串或ID字符串
    quickExpr: /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,

    // Is it a simple selector
    isSimple: /^.[^:#\[\.,]*$/,

    /*#region 函数:noop()*/
    /**
    * 空操作
    */
    noop: function () { },
    /*#endregion*/

    /*#region 函数:register(value)*/
    /**
    * 注册对象信息
    * @method register
    * @memberof x3platform
    */
    register: function (value) {
        var parts = value.split(".");

        var root = window;

        for (var i = 0; i < parts.length; i++) {
            if (x.isUndefined(root[parts[i]])) {
                root[parts[i]] = {};
            }

            root = root[parts[i]];
        }

        return root;
    },
    /*#endregion*/

    /*#region 函数:ext(destination, source)*/
    /**
    * 将原始对象的属性和方法扩展至目标对象
    * @method ext
    * @memberof x
    * @param destination 目标对象
    * @param source 原始对象
    */
    ext: function (destination, source) {
        /*
        for (var property in source)
        {
        destination[property] = source[property];
        }

        return destination;
        */

        var result = arguments[0] || {};

        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                for (var property in arguments[i]) {
                    result[property] = arguments[i][property];
                }
            }
        }

        return result;
    },
    /*#endregion*/

    /*#region 函数:clone(object)*/
    /**
    * 克隆对象
    * @method clone
    * @memberof x
    * @returns {object} 克隆的对象
    */
    clone: function (object) {
        return x.ext({}, object);
    },
    /*#endregion*/

    /*#region 函数:invoke(object, fn)*/
    /**
    * 执行对象方法
    * @method invoke
    * @memberof x
    */
    invoke: function (object, fn) {
        // 注:数组的 slice(start, end) 方法可从已有的数组中返回选定的元素。
        var args = Array.prototype.slice.call(arguments).slice(2);

        return fn.apply(object, args);
    },
    /*#endregion*/

    /*#region 函数:call(anything)*/
    /*
    * 调用方法或者代码文本
    * @method call
    * @memberof x
    */
    call: function (anything) {
        if (!x.isUndefined(anything)) {
            try {
                if (x.isFunction(anything)) {
                    var args = Array.prototype.slice.call(arguments).slice(1);

                    return anything.apply(this, args);
                }
                else if (x.type(anything) === 'string') {
                    if (anything !== '') { return eval(anything); }
                }
            }
            catch (ex) {
                console.error(ex);
                // debug.error(ex);
            }
        }
    },
    /*#endregion*/

    /*#region 函数:query(selector)*/
    /**
    * 精确查询单个表单元素。
    * @method query
    * @memberof x
    * @param {string} selector 选择表达式
    */
    query: function (selector) {
        if (x.type(selector).indexOf('html') == 0) {
            // Html 元素类型 直接返回
            return selector;
        }
        else if (x.type(selector) == 'string') {
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
        if (x.type(selector).indexOf('html') == 0) {
            // Html 元素类型 直接返回
            var results = [];
            results.push(selector);

            return results;
        }
        else if (x.type(selector) == 'string') {
            // return Sizzle.apply(window, Array.prototype.slice.call(arguments, 0));
            return document.querySelectorAll(selector);
        }
    },
    /*#endregion*/

    /*#region 函数:serialize(data)*/
    /**
    * 返回数据串行化后的字符串
    * @method serialize
    * @memberof x
    * @param {object} data 表单输入元素的数组或键/值对的散列表
    */
    serialize: function (data) {
        var buffer = [], length = data.length;

        if (x.isArray(data)) {
            // 数组对象
            for (var i = 0; i < length; i++) {
                buffer.push(data[i].name + '=' + encodeURIComponent(data[i].value));
            }
        }
        else {
            for (var name in data) {
                buffer.push(name + '=' + encodeURIComponent(data[name]));
            }
        }

        return buffer.join('&');
    },
    /*#endregion*/

    /*#region 函数:each(data, callback)*/
    /**
    * 遍历元素对象, 如果需要退出返回 false
    * @method each
    * @memberof x
    * @param {Object} data 对象
    * @param {Function} callback 回调函数
    */
    each: function (data, callback) {
        var name, i = 0, length = data.length;

        if (x.isArray(data)) {
            // 数组对象
            for (var value = data[0]; i < length && callback.call(value, i, value) != false; value = data[++i]) { }
        }
        else {
            // 键/值对的散列表
            for (name in data) {
                if (callback.call(data[name], name, data[name]) === false) { break; }
            }
        }

        return data;
    },
    /*#endregion*/

    /*#region 函数:toJSON(text)*/
    /**
    * 将字符串转换为JSON对象
    * @method toJSON
    * @memberof x
    * @param {string} text JSON对象的文本格式
    */
    toJSON: function (text) {
        if (x.type(text) === 'object') { return text; }

        // 类型为 undefined 时或者字符串内容为空时, 返回 undefined 值.
        if (x.isUndefined(text) || text === '') { return undefined; }

        var hideError = arguments[1];

        try {
            // eval('(' + text + ')')
            return (JSON) ? JSON.parse(text) : (Function("return " + text))();
        }
        catch (ex) {
            try {
                return (Function("return " + text))();
            }
            catch (ex1) {
                if (!hideError) x.debug.error('{"method":"x.toJSON(text)", "arguments":{"text":"' + text + '"}');
                return undefined;
            }
        }
    },
    /*#endregion*/

    /*#region 函数:toSafeJSON(text)*/
    /**
    * 将普通文本信息转换为安全的符合JSON格式规范的文本信息
    * @method toSafeJSON
    * @memberof x
    * @param {string} text 文本信息
    */
    toSafeJSON: function (text) {
        var outString = '';

        for (var i = 0; i < text.length; i++) {
            var ch = text.substr(i, 1);

            if (ch === '"' || ch === '\'' || ch === '\\') {
                outString += '\\';
                outString += ch;
            }
            else if (ch === '\b') {
                outString += '\\b';
            }
            else if (ch === '\f') {
                outString += '\\f';
            }
            else if (ch === '\n') {
                outString += '\\n';
            }
            else if (ch === '\t') {
                outString += '\\t';
            }
            else if (ch === '\r') {
                outString += '\\r';
            }
            else {
                outString += ch;
            }
        }

        return outString;
    },
    /*#endregion*/

    /*#region 函数:toSafeLike(text)*/
    /**
    * 将字符串中特殊字符([%_)转换为可识别的Like内容.
    * @method toSafeLike
    * @memberof x
    * @param {string} text 文本信息
    */
    toSafeLike: function (text) {
        return text.replace(/\[/g, '[[]').replace(/%/g, '[%]').replace(/_/g, '[_]');
    },
    /*#endregion*/

    /*#region 函数:cdata(text)*/
    /**
    * 将普通文本信息转为为Xml不解析的文本信息
    * @method cdata
    * @memberof x
    * @param {string} text 文本信息
    */
    cdata: function (text) {
        return '<![CDATA[' + text + ']]>';
    },
    /*#endregion*/

    /*#region 函数:camelCase(text)*/
    /**
    * 将短划线文字转换至驼峰格式
    * @method camelCase
    * @memberof x
    * @param {string} text 文本信息
    */
    camelCase: function (text) {
        // jQuery: Microsoft forgot to hump their vendor prefix (#9572)

        // 匹配短划线文字转换至驼峰格式
        // Matches dashed string for camelizing
        var rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi;

        // camelCase 替换字符串时的回调函数
        return text.replace(rmsPrefix, "ms-").replace(rdashAlpha, function (all, letter) {
            return letter.toUpperCase();
        });
    },
    /*#endregion*/

    /*#region 函数:paddingZero(number, length)*/
    /**
    * 数字补零
    * @method paddingZero
    * @memberof x
    * @param {number} number 数字
    * @param {number} length 需要补零的位数
    */
    paddingZero: function (number, length) {
        return (Array(length).join('0') + number).slice(-length);
    },
    /*#endregion*/

    /*#region 函数:formatNature(text)*/
    /**
    * 将字符串统一转换为本地标识标识
    * @method formatNature
    * @memberof x
    * @param {string} text 文本信息
    */
    formatNature: function (text) {
        switch (text.toLowerCase()) {
            case 'en-us':
                text = 'en-us';
                break;
            case 'zh-cn':
                text = 'zh-cn';
                break;
            default:
                text = 'zh-cn';
                break;
        }

        return text;
    },
    /*#endregion*/

    /*#region 函数:getFriendlyName(name)*/
    /**
    * 将不规范的标识名称转换为友好的名称.
    * @method getFriendlyName
    * @memberof x
    * @param {string} name 名称
    * @example
    * // 将路径中的[$./\:?=]符号替换为[-]符号
    * console.log(x.getFriendlyName(location.pathname));
    */
    getFriendlyName: function (name) {
        return x.camelCase(('x-' + name).replace(/[\#\$\.\/\\\:\?\=]/g, '-').replace(/[-]+/g, '-'));
    },
    /*#endregion*/

    /*#region 类:newHashTable()*/
    /**
    * 哈希表
    * @class HashTable 哈希表
    * @constructor newHashTable
    * @memberof x
    * @example
    * // returns HashTable
    * var hashtable = x.newHashTable();
    */
    newHashTable: function () {
        var hashTable = {

            // 内部数组对象
            innerArray: [],

            /*#region 函数:clear()*/
            /**
            * 清空哈希表
            * @method clear
            * @memberof x.newHashTable#
            */
            clear: function () {
                this.innerArray = [];
            },
            /*#endregion*/

            /*#region 函数:exist(key)*/
            /**
            * 判断是否已存在相同键的对象
            * @method exist
            * @memberof x.newHashTable#
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
            * @memberof x.newHashTable#
            */
            get: function (index) {
                return this.innerArray[index];
            },
            /*#endregion*/

            /*#region 函数:add(key, value)*/
            /**
            * @method add
            * @memberof x.newHashTable#
            */
            add: function (key, value) {
                if (arguments.length === 1) {
                    var keyArr = key.split(';');

                    for (var i = 0; i < keyArr.length; i++) {
                        var valueArr = keyArr[i].split('#');

                        this.innerArray.push({ name: valueArr[0], value: valueArr[1] });
                    }
                }
                else {
                    if (this.exist(key)) {
                        throw 'hashtable aleardy exist same key[' + key + ']';
                    }
                    else {
                        this.innerArray.push({ name: key, value: value });
                    }
                }
            },
            /*#endregion*/

            /*#region 函数:find(key)*/
            /**
            * @method find
            * @memberof x.newHashTable#
            */
            find: function (key) {
                for (var i = 0; i < this.innerArray.length; i++) {
                    if (this.innerArray[i].name === key) {
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
            * @memberof x.newHashTable#
            */
            size: function () {
                return this.innerArray.length;
            }
            /*#endregion*/
        };

        return hashTable;
    },
    /*#endregion*/

    /*#region 类:newQueue()*/
    /**
    * 队列
    * @description Queue 对象
    * @class Queue 队列
    * @constructor newQueue
    * @memberof x
    */
    newQueue: function () {
        var queue = {

            // 内部数组对象
            innerArray: [],

            /**
            * 插入队列顶部元素
            * @method push
            * @memberof x.newQueue#
            */
            push: function (targetObject) {
                this.innerArray.push(targetObject);
            },
            /*#endregion*/

            /**
            * 弹出队列顶部元素
            * @method pop
            * @memberof x.newQueue#
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
            * @memberof x.newQueue#
            */
            clear: function () {
                this.innerArray.length = 0; //将元素的个数清零即可
            },
            /*#endregion*/

            /*#region 函数:size()*/
            /**
            * 获得线性队列当前大小
            * @method size
            * @memberof x.newQueue#
            */
            size: function () {
                return this.innerArray.length;
            },
            /*#endregion*/

            /*#region 函数:isEmpty()*/
            /*
            * 判断一个线性队列是否为空
            * @method isEmpty
            * @memberof x.newQueue#
            */
            isEmpty: function () {
                return (this.innerArray.length === 0) ? true : false;
            }
            /*#endregion*/
        };

        return queue;
    },
    /*#endregion*/

    /*#region 类:newStack()*/
    /**
    * 栈
    * @description 创建 Stack 对象
    * @class Stack
    * @constructor newStack
    * @memberof x
    */
    newStack: function () {
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

            /*
            * 清空堆栈
            */
            clear: function () {
                this.innerArray.length = 0; //将元素的个数清零即可
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
    },
    /*#endregion*/

    /*#region 类:newStringBuilder()*/
    /**
    * 高效字符串构建器<br />
    * 注: 现在的主流浏览器都针对字符串连接作了优化，所以性能要好于StringBuilder类，不推荐使用，仅作字符串算法研究。
    * @class StringBuilder
    * @constructor newStringBuilder
    * @memberof x
    */
    newStringBuilder: function () {
        var stringBuilder = {

            // 内部数组对象
            innerArray: [],

            /*#region 函数:append(text)*/
            /**
            * 附加文本信息
            * @method append
            * @memberof x.newStringBuilder#
            * @param {string} text 文本信息
            */
            append: function (text) {
                this.innerArray[this.innerArray.length] = text;
            },
            /*#endregion*/

            /*#region 函数:toString()*/
            /**
            * 转换为字符串
            * @method toString
            * @memberof x.newStringBuilder#
            * @returns {string}
            */
            toString: function () {
                return this.innerArray.join('');
            }
            /*#endregion*/
        };

        return stringBuilder;
    },
    /*#endregion*/

    // 缓存
    timers:{},

    /*#region 类:newTimer(interval, callback)*/
    /**
    * 计时器
    * @class Timer 计时器
    * @constructor newTimer
    * @memberof x
    * @param {number} interval 时间间隔(单位:秒)
    * @param {function} callback 回调函数
    * @example
    * // 初始化一个计时器
    * var timer = x.newTimer(5, function(timer) {
    *   console.log(new Date());
    *   // 停止计时器
    *   timer.stop();
    * });
    * // 启动计时器
    * timer.start();
    */
    newTimer: function (interval, callback) {
        var timer = {

            // 定时器的名称
            name: 'timer$' + Math.ceil(Math.random() * 900000000 + 100000000),
            // 定时器的间隔
            interval: interval * 1000,
            // 回调函数
            callback: callback,

            /*#region 函数:run()*/
            /**
            * 执行回调函数
            * @private
            * @method run
            * @memberof x.newTimer#
            */
            run: function () {
                this.callback(this);
            },
            /*#endregion*/


            /*#region 函数:start()*/
            /**
            * 启动计时器
            * @method start
            * @memberof x.newTimer#
            */
            start: function () {
                // 旧版
                // eval('x.timers.' + this.name + ' = this;');
                // this.timerId = setInterval('x.timers.' + this.name + '.run()', this.interval);

                var that = x.timers[this.name] = this;
                this.timerId = setInterval(function(){ x.timers[that.name].run() }, this.interval);
            },
            /*#endregion*/

            /*#region 函数:stop()*/
            /**
            * 停止计时器
            * @method stop
            * @memberof x.newTimer#
            */
            stop: function () {
                clearInterval(this.timerId);
            }
            /*#endregion*/
        };

        return timer;
    },
    /*#endregion*/

    /**
    * 事件
    * @namespace event
    * @memberof x
    */
    event: {
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
        add: function (target, type, listener, useCapture) {
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
        remove: function (target, type, listener, useCapture) {
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
    },

    /**
    * Guid 格式文本
    * @namespace guid
    * @memberof x
    */
    guid: {
        /*#region 函数:create(format, isUpperCase)*/
        /**
        * 创建 Guid 格式文本
        * @method create
        * @memberof x.guid
        * @param {string} [format] 分隔符格式(如果填空白字符串则不显示)
        * @param {bool} [isUpperCase] 是否是大写格式(true|false)
        * @example
        * // 输出格式 aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
        * console.log(x.guid.create());
        * @example
        * // 输出格式 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        * console.log(x.guid.create(''));
        * @example
        * // 输出格式 AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA
        * console.log(x.guid.create('-', true));
        */
        create: function (format, isUpperCase) {
            var text = '';

            // 格式限制
            format = (format || '-').toLowerCase();

            for (var i = 0; i < 8; i++) {
                text += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

                if (i > 0 && i < 5) {
                    if (format === '-') {
                        text += '-';
                    }
                }
            }

            text = isUpperCase ? text.toUpperCase() : text.toLowerCase();

            return text;
        }
        /*#endregion*/
    },

    /**
    * 随机文本
    * @namespace randomText
    * @memberof x
    */
    randomText: {
        /*#region 函数:create(length)*/
        /**
        * 创建随机文本信息
        * @method create
        * @memberof x.randomText
        * @param {number} length 返回的文本长度
        * @example
        * // 输出格式 00000000
        * console.log(x.randomText.create(8));
        */
        create: function (length, buffer) {
            var result = '';

            var buffer = x.type(buffer) == 'string' ? buffer : "0123456789abcdefghijklmnopqrstuvwyzx";

            for (var i = 0; i < length; i++) {
                result += buffer.charAt(Math.ceil(Math.random() * 100000000) % buffer.length);
            }

            return result;
        }
        /*#endregion*/
    },

    /*#region 函数:nonce(length)*/
    /**
    * 创建随机数
    * @method nonce
    * @memberof x
    * @param {length} 随机数长度
    */
    nonce: function (length = 6) {
        return Number(x.randomText.create(1, '123456789') + x.randomText.create(length - 1, '0123456789'));
    },
    /*#endregion*/

    /**
    * @namespace debug
    * @memberof x
    * @description 基于 Console 对象的调试跟踪函数
    */
    debug: {

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
        log: function (object) {
            // firebug
            if (!x.isUndefined(console)) {
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
        warn: function (object) {
            // console
            if (!x.isUndefined(console)) {
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
        error: function (object) {
            // console
            if (!x.isUndefined(console)) {
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
        assert: function (expression) {
            // console
            if (!x.isUndefined(console)) {
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
        time: function (name) {
            // console
            if (!x.isUndefined(console)) {
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
        timeEnd: function (name) {
            // console
            if (!x.isUndefined(console)) {
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
        timestamp: function () {
            // 显示时间格式
            var format = '{yyyy-MM-dd HH:mm:ss.fff}';
            // 当前时间戳
            var timestamp = new Date();

            return format.replace(/yyyy/, timestamp.getFullYear().toString())
                .replace(/MM/, (timestamp.getMonth() + 1) > 9 ? (timestamp.getMonth() + 1).toString() : '0' + (timestamp.getMonth() + 1))
                .replace(/dd|DD/, timestamp.getDate() > 9 ? timestamp.getDate().toString() : '0' + timestamp.getDate())
                .replace(/hh|HH/, timestamp.getHours() > 9 ? timestamp.getHours().toString() : '0' + timestamp.getHours())
                .replace(/mm/, timestamp.getMinutes() > 9 ? timestamp.getMinutes().toString() : '0' + timestamp.getMinutes())
                .replace(/ss|SS/, timestamp.getSeconds() > 9 ? timestamp.getSeconds().toString() : '0' + timestamp.getSeconds())
                .replace(/fff/g, ((timestamp.getMilliseconds() > 99) ? timestamp.getMilliseconds().toString() : (timestamp.getMilliseconds() > 9) ? '0' + timestamp.getMilliseconds() : '00' + timestamp.getMilliseconds()));
        }
        /*#endregion*/
    }
};

export = x;
