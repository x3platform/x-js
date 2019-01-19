define("src/base/lang", ["require", "exports"], function (require, exports) {
    "use strict";
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
                if (typeof (object) === 'undefined') {
                    return 'undefined';
                }
                // 处理 Null 类型;
                if (object === null) {
                    return 'null';
                }
                // 通用类型处理
                return /\[object ([A-Za-z]+)\]/.exec(Object.prototype.toString.call(object))[1].toLowerCase();
            }
            catch (ex) {
                if (ex instanceof RangeError) {
                    return '...';
                }
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
        extend: function (destination) {
            var source = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                source[_i - 1] = arguments[_i];
            }
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
                    }
                    else {
                        this.eventListeners[type].push(listener);
                    }
                }
                return this;
            };
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
                    }
                    else if (listener instanceof Array) {
                        for (var lis = 0, lenkey = listener.length; lis < lenkey; lis += 1) {
                            this.unbind(type, listener[lenkey]);
                        }
                    }
                    else {
                        delete this.eventListeners[type];
                    }
                }
                return this;
            };
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
    var types = ["Array", "Function", "String", "Number", "Undefined"];
    var _loop_1 = function (i) {
        self['is' + types[i]] = function (object) {
            return self.type(object) === types[i].toLowerCase();
        };
    };
    for (var i = 0; i < types.length; i++) {
        _loop_1(i);
    }
    return self;
});
define("src/base/StringBuilder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
      * 高效字符串构建器<br />
      * 注: 现在的主流浏览器都针对字符串连接作了优化，所以性能要好于StringBuilder类，不推荐使用，仅作字符串算法研究。
      * @class StringBuilder
      * @constructor StringBuilder
      * @memberof x
      */
    var StringBuilder = /** @class */ (function () {
        /**
        * 构造函数
        */
        function StringBuilder() {
            // 内部数组对象
            this.innerArray = [];
            // this.innerArray = [];
        }
        // #region 函数:append(text)
        /**
        * 附加文本信息
        * @method append
        * @memberof x.StringBuilder#
        * @param {String} text 文本信息
        */
        StringBuilder.prototype.append = function (text) {
            this.innerArray[this.innerArray.length] = text;
        };
        // #endregion
        // #region 函数:toString()
        /**
        * 转换为字符串
        * @method toString
        * @memberof x.StringBuilder#
        * @returns {String}
        */
        StringBuilder.prototype.toString = function () {
            return this.innerArray.join('');
        };
        return StringBuilder;
    }());
    exports.StringBuilder = StringBuilder;
});
define("src/base/Timer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var timers = {};
    var namePrefix = 'timer$';
    /**
      * 计时器
      * @class Timer 计时器
      * @constructor Timer
      * @memberof x
      * @param {Number} interval 时间间隔(单位:秒)
      * @param {function} callback 回调函数
      * @example
      * // 初始化一个计时器
      * var timer = new x.Timer(5, function(timer) {
      *   console.log(new Date());
      *   // 停止计时器
      *   timer.stop();
      * });
      * // 启动计时器
      * timer.start();
      */
    var Timer = /** @class */ (function () {
        /**
         * 构造函数
         * @param {Number} interval 时间间隔
         * @param {Function} callback 每隔一段时间执行的函数
         */
        function Timer(interval, callback) {
            // 定时器标识
            this.timerId = -1;
            this.name = namePrefix + Math.ceil(Math.random() * 900000000 + 100000000);
            this.interval = interval * 1000;
            this.callback = callback;
        }
        // #region 函数:run()
        /**
        * 执行回调函数
        * @private
        * @method run
        * @memberof x.Timer#
        */
        Timer.prototype.run = function () {
            this.callback(this);
        };
        // #endregion
        // #region 函数:start()
        /**
        * 启动计时器
        * @method start
        * @memberof x.Timer#
        */
        Timer.prototype.start = function () {
            var that = (timers[this.name] = this);
            this.timerId = setInterval(function () {
                timers[that.name].run();
            }, this.interval);
        };
        // #endregion
        // #region 函数:stop()
        /**
        * 停止计时器
        * @method stop
        * @memberof x.Timer#
        */
        Timer.prototype.stop = function () {
            clearInterval(this.timerId);
        };
        return Timer;
    }());
    exports.Timer = Timer;
});
// import { Promise } from 'es6-promise';
define("src/base/kernel", ["require", "exports", "src/base/lang", "src/base/StringBuilder", "src/base/Timer"], function (require, exports, lang, StringBuilder_1, Timer_1) {
    "use strict";
    // 支持的本地化配置
    var locales = { "en-us": "en-us", "zh-cn": "zh-cn", "zh-tw": "zh-tw" };
    var defaultLocaleName = 'zh-cn';
    var self = {
        /**
         * 获取全局对象
         * @private
         */
        global: function () {
            // 处理全局对象
            // Web  环境 获取 Window 对象
            // Node 环境 获取 Global 对象
            return typeof window !== 'undefined' ? window : global;
        },
        isBrower: function () {
            return lang.type(self.global()) === 'window';
        },
        isNode: function () {
            return lang.type(self.global()) === 'global';
        },
        /**
         * 抛出错误信息
         * @private
         */
        error: function (msg) {
            throw new Error(msg);
        },
        // 脚本代码片段
        scriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
        // 脚本代码片段
        jsonFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
        // 一种简单的方法来检查HTML字符串或ID字符串
        quickExpr: /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
        // Is it a simple selector
        isSimple: /^.[^:#\[\.,]*$/,
        // #region 函数:noop()
        /**
        * 空操作
        */
        noop: function () { },
        // #endregion
        // #region 函数:register(value)
        /**
        * 注册对象信息
        * @method register
        * @memberof x
        */
        register: function (value) {
            var parts = value.split(".");
            // var root = window;
            var root = self.global();
            for (var i = 0; i < parts.length; i++) {
                if (lang.isUndefined(root[parts[i]])) {
                    root[parts[i]] = {};
                }
                root = root[parts[i]];
            }
            return root;
        },
        // #endregion
        // #region 函数:invoke(object, fn)
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
        // #endregion
        // #region 函数:call(anything)
        /*
        * 调用方法或者代码文本
        * @method call
        * @memberof x
        */
        call: function (anything) {
            if (!lang.isUndefined(anything)) {
                try {
                    if (lang.isFunction(anything)) {
                        var args = Array.prototype.slice.call(arguments).slice(1);
                        return anything.apply(this, args);
                    }
                    else if (lang.type(anything) === 'string') {
                        if (anything !== '') {
                            return eval(anything);
                        }
                    }
                }
                catch (ex) {
                    console.error(ex);
                    // debug.error(ex);
                }
            }
        },
        // #endregion
        // promise: function (fn) {
        //  return new Promise(fn);
        // },
        /**
        * Guid 格式文本
        * @namespace guid
        * @memberof x
        */
        guid: {
            // #region 函数:create(format, isUpperCase)
            /**
            * 创建 Guid 格式文本
            * @method create
            * @memberof x.guid
            * @param {String} [format] 分隔符格式(如果填空白字符串则不显示)
            * @param {bool} [isUpperCase] 是否是大写格式(true|false)
            * @example
            * // 输出格式 aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
            * console.log(x.guid.create());
            * @example
            * // 输出格式 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            * console.log(x.guid.create(''));
            * @example
            * // 输出格式 XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
            * console.log(x.guid.create('-', true));
            */
            create: function (format, isUpperCase) {
                if (format === void 0) { format = '-'; }
                var text = '';
                // 格式限制
                format = format.toLowerCase();
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
            // #endregion
        },
        /**
        * 随机文本
        * @namespace randomText
        * @memberof x
        */
        randomText: {
            // #region 函数:create(length)
            /**
            * 创建随机文本信息
            * @method create
            * @memberof x.randomText
            * @param {Number} length 返回的文本长度
            * @example
            * // 输出格式 00000000
            * console.log(x.randomText.create(8));
            */
            create: function (length, buffer) {
                if (length === void 0) { length = 8; }
                if (buffer === void 0) { buffer = "0123456789abcdefghijklmnopqrstuvwyzx"; }
                var result = '';
                for (var i = 0; i < length; i++) {
                    result += buffer.charAt(Math.ceil(Math.random() * 100000000) % buffer.length);
                }
                return result;
            }
            // #endregion
        },
        // #region 函数:nonce(length)
        /**
        * 创建随机数
        * @method nonce
        * @memberof x
        * @param {length} 随机数长度
        */
        nonce: function (length) {
            if (length === void 0) { length = 6; }
            return Number(self.randomText.create(1, '123456789') + self.randomText.create(length - 1, '0123456789'));
        },
        // #endregion
        // #region 函数:serialize(data)
        /**
        * 返回数据串行化后的字符串
        * @method serialize
        * @memberof x
        * @param {Object} data 表单输入元素的数组或键/值对的散列表
        */
        serialize: function (data) {
            var buffer = [], length = data.length;
            if (lang.isArray(data)) {
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
        // #endregion
        // #region 函数:each(data, callback)
        /**
        * 遍历元素对象, 如果需要退出返回 false
        * @method each
        * @memberof x
        * @param {Object} data 对象
        * @param {Function} callback 回调函数
        */
        each: function (data, callback) {
            var name, i = 0, length = data.length;
            if (lang.isArray(data) || lang.type(data) == 'nodelist') {
                // 数组对象 NodeList
                for (var value = data[0]; i < length && callback.call(value, i, value) != false; value = data[++i]) { }
            }
            else {
                // 键/值对的散列表
                for (name in data) {
                    if (callback.call(data[name], name, data[name]) === false) {
                        break;
                    }
                }
            }
            return data;
        },
        // #endregion
        // #region 函数:toXML(text)
        /**
        * 将字符串转换为XML对象
        * @method toXML
        * @memberof x
        * @param {String} text XML对象的文本格式
        */
        toXML: function (text, hideError) {
            if (hideError === void 0) { hideError = false; }
            if (lang.type(text) === 'xmldocument') {
                return text;
            }
            // 类型为 undefined 时或者字符串内容为空时, 返回 undefined 值.
            if (lang.isUndefined(text) || text === '') {
                return undefined;
            }
            var global = self.global();
            var doc;
            // Firefox, Mozilla, Opera, etc.
            try {
                if (global["DOMParser"]) {
                    var parser = new DOMParser();
                    doc = parser.parseFromString(text, "text/xml");
                }
                else if (global["ActiveXObject"]) {
                    doc = new ActiveXObject("Microsoft.XMLDOM");
                    doc.async = "false";
                    doc.loadXML(text);
                }
            }
            catch (ex) {
                doc = undefined;
                if (!hideError)
                    self.debug.error('{"method":"x.toXML(text)", "arguments":{"text":"' + text + '"}');
            }
            if (!doc || doc.getElementsByTagName("parsererror").length) {
                doc = undefined;
                if (!hideError)
                    self.debug.error('{"method":"x.toXML(text)", "arguments":{"text":"' + text + '"}');
            }
            return doc;
        },
        // #endregion
        // #region 函数:toJSON(text)
        /**
        * 将字符串转换为JSON对象
        * @method toJSON
        * @memberof x
        * @param {String} text JSON对象的文本格式
        */
        toJSON: function (text) {
            if (lang.type(text) === 'object') {
                return text;
            }
            // 类型为 undefined 时或者字符串内容为空时, 返回 undefined 值.
            if (lang.isUndefined(text) || text === '') {
                return undefined;
            }
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
                    if (!hideError)
                        self.debug.error('{"method":"x.toJSON(text)", "arguments":{"text":"' + text + '"}');
                    return undefined;
                }
            }
        },
        // #endregion
        // #region 函数:toSafeJSON(text)
        /**
        * 将普通文本信息转换为安全的符合JSON格式规范的文本信息
        * @method toSafeJSON
        * @memberof x
        * @param {String} text 文本信息
        */
        toSafeJSON: function (text) {
            var outString = '';
            for (var i = 0; i < text.length; i++) {
                var ch = text.substr(i, 1);
                if (ch === '"' || ch === '\'' || ch === '\\' || ch === '\/') {
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
                else if (ch === '\r') {
                    outString += '\\r';
                }
                else if (ch === '\t') {
                    outString += '\\t';
                }
                else {
                    outString += ch;
                }
            }
            return outString;
        },
        // #endregion
        // #region 函数:toSafeLike(text)
        /**
        * 将字符串中特殊字符([%_)转换为可识别的Like内容.
        * @method toSafeLike
        * @memberof x
        * @param {String} text 文本信息
        */
        toSafeLike: function (text) {
            return text.replace(/\[/g, '[[]').replace(/%/g, '[%]').replace(/_/g, '[_]');
        },
        // #endregion
        // #region 函数:cdata(text)
        /**
        * 将普通文本信息转为为Xml不解析的文本信息
        * @method cdata
        * @memberof x
        * @param {String} text 文本信息
        */
        cdata: function (text) {
            return '<![CDATA[' + text + ']]>';
        },
        // #endregion
        // #region 函数:camelCase(text)
        /**
        * 将短划线文字(name1-name2-name3)转换至驼峰格式(name1Name2Name3)
        * @method camelCase
        * @memberof x
        * @param {String} text 文本信息
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
        // #endregion
        // #region 函数:paddingZero(number, length)
        /**
        * 数字补零
        * @method paddingZero
        * @memberof x
        * @param {Number} number 数字
        * @param {Number} length 需要补零的位数
        */
        paddingZero: function (number, length) {
            return (Array(length).join('0') + number).slice(-length);
        },
        // #endregion
        // #region 函数:formatLocale(text)
        /**
        * 将字符串统一转换为本地标识标识
        * @method formatLocale
        * @memberof x
        * @param {String} text 文本信息
        */
        formatLocale: function (text) {
            var locale = locales[text.toLowerCase()];
            return locale ? locale : defaultLocaleName;
        },
        // #endregion
        // #region 函数:getFriendlyName(name)
        /**
        * 将不规范的标识名称转换为友好的名称.
        * @method getFriendlyName
        * @memberof x
        * @param {String} name 名称
        * @example
        * // 将路径中的[$./\:?=]符号替换为[_]符号
        * console.log(x.getFriendlyName(location.pathname));
        */
        getFriendlyName: function (name) {
            return self.camelCase(('x_' + name).replace(/[\#\$\.\/\\\:\?\=]/g, '_').replace(/[-]+/g, '_'));
        },
        // #endregion
        // 字符串构建器
        StringBuilder: StringBuilder_1.StringBuilder,
        // 定时器
        Timer: Timer_1.Timer,
        // 缓存
        timers: {},
        // #region 类:Timer(interval, callback)
        /**
        * 计时器
        * @class Timer 计时器
        * @constructor Timer
        * @memberof x
        * @param {Number} interval 时间间隔(单位:秒)
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
                // #region 函数:run()
                /**
                * 执行回调函数
                * @private
                * @method run
                * @memberof x.Timer#
                */
                run: function () {
                    this.callback(this);
                },
                // #endregion
                // #region 函数:start()
                /**
                * 启动计时器
                * @method start
                * @memberof x.Timer#
                */
                start: function () {
                    // 旧版
                    // eval('x.timers.' + this.name + ' = this;');
                    // this.timerId = setInterval('x.timers.' + this.name + '.run()', this.interval);
                    var that = self.timers[this.name] = this;
                    this.timerId = setInterval(function () { self.timers[that.name].run(); }, this.interval);
                },
                // #endregion
                // #region 函数:stop()
                /**
                * 停止计时器
                * @method stop
                * @memberof x.Timer#
                */
                stop: function () {
                    clearInterval(this.timerId);
                }
                // #endregion
            };
            return timer;
        },
        // #endregion
        /**
        * @namespace debug
        * @memberof x
        * @description 基于 Console 对象的调试跟踪函数
        */
        debug: {
            // 相关链接
            // http://getfirebug.com/wiki/index.php/Console_API
            // https://developers.google.com/chrome-developer-tools/docs/console?hl=zh-CN#using_the_console_api
            // #region 函数:log(object)
            /**
            * 记录普通的日志消息
            * @method log
            * @memberof x.debug
            * @param {Object} object 对象
            */
            log: function (object) {
                // firebug
                if (!lang.isUndefined(console)) {
                    console.log(object);
                }
            },
            // #endregion
            // #region 函数:warn(object)
            /**
            * 记录警告的日志消息
            * @method warn
            * @memberof x.debug
            * @param {Object} object 对象
            */
            warn: function (object) {
                // console
                if (!lang.isUndefined(console)) {
                    console.warn(object);
                }
            },
            // #endregion
            // #region 函数:error(object)
            /**
            * 记录错误的日志消息
            * @method error
            * @memberof x.debug
            * @param {Object} object 对象
            */
            error: function (object) {
                // console
                if (!lang.isUndefined(console)) {
                    console.error(object);
                }
            },
            // #endregion
            // #region 函数:assert(expression)
            /**
            * 断言
            * @method assert
            * @memberof x.debug
            * @param {String} expression 表达式
            */
            assert: function (expression) {
                // console
                if (!lang.isUndefined(console)) {
                    console.assert(expression);
                }
            },
            // #endregion
            // #region 函数:time(name)
            /**
            * 计时器
            * @method time
            * @memberof x.debug
            * @param {String} name 计时器名称
            */
            time: function (name) {
                // console
                if (!lang.isUndefined(console)) {
                    console.time(name);
                }
            },
            // #endregion
            // #region 函数:timeEnd(name)
            /**
            * 停止计时器
            * @method timeEnd
            * @memberof x.debug
            * @param {String} name 计时器名称
            */
            timeEnd: function (name) {
                // console
                if (!lang.isUndefined(console)) {
                    console.timeEnd(name);
                }
            },
            // #endregion
            // #region 函数:timestamp()
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
            // #endregion
        }
    };
    return self;
});
define("src/base/declare", ["require", "exports", "src/base/lang", "src/base/kernel"], function (require, exports, lang, kernel) {
    "use strict";
    // 此方法来源与 dojo.declare
    // declare
    var xtor = function () { };
    var op = Object.prototype, opts = op.toString, cname = "constructor";
    // forceNew(ctor)
    // 返回一个新的对象
    // return a new object that inherits from ctor.prototype but
    // without actually running ctor on the object.
    function forceNew(ctor) {
        // create object with correct prototype using a do-nothing
        // constructor
        xtor.prototype = ctor.prototype;
        var t = new xtor;
        xtor.prototype = null; // clean up
        return t;
    }
    // applyNew(args)
    // just like 'new ctor()' except that the constructor and its arguments come
    // from args, which must be an array or an arguments object
    function applyNew(args) {
        // create an object with ctor's prototype but without
        // calling ctor on it.
        var ctor = args.callee, t = forceNew(ctor);
        // execute the real constructor on the new object
        ctor.apply(t, args);
        return t;
    }
    // chained constructor compatible with the legacy declare()
    function chainedConstructor(bases, ctorSpecial) {
        return function () {
            var a = arguments, args = a, a0 = a[0], f, i, m, l = bases.length, preArgs;
            if (!(this instanceof a.callee)) {
                // not called via new, so force it
                return applyNew(a);
            }
            //this._inherited = {};
            // perform the shaman's rituals of the original declare()
            // 1) call two types of the preamble
            if (ctorSpecial && (a0 && a0.preamble || this.preamble)) {
                // full blown ritual
                preArgs = new Array(bases.length);
                // prepare parameters
                preArgs[0] = a;
                for (i = 0;;) {
                    // process the preamble of the 1st argument
                    a0 = a[0];
                    if (a0) {
                        f = a0.preamble;
                        if (f) {
                            a = f.apply(this, a) || a;
                        }
                    }
                    // process the preamble of this class
                    f = bases[i].prototype;
                    f = f.hasOwnProperty("preamble") && f.preamble;
                    if (f) {
                        a = f.apply(this, a) || a;
                    }
                    // one peculiarity of the preamble:
                    // it is called if it is not needed,
                    // e.g., there is no constructor to call
                    // let's watch for the last constructor
                    // (see ticket #9795)
                    if (++i == l) {
                        break;
                    }
                    preArgs[i] = a;
                }
            }
            // 2) call all non-trivial constructors using prepared arguments
            for (i = l - 1; i >= 0; --i) {
                f = bases[i];
                m = f._meta;
                f = m ? m.ctor : f;
                if (f) {
                    f.apply(this, preArgs ? preArgs[i] : a);
                }
            }
            // 3) continue the original ritual: call the postscript
            f = this.postscript;
            if (f) {
                f.apply(this, args);
            }
        };
    }
    // chained constructor compatible with the legacy declare()
    function singleConstructor(ctor, ctorSpecial) {
        return function () {
            var a = arguments, t = a, a0 = a[0], f;
            //if (!(this instanceof a.callee)) {
            //if (true) {
            // not called via new, so force it
            //  return applyNew(a);
            //}
            //this._inherited = {};
            // perform the shaman's rituals of the original declare()
            // 1) call two types of the preamble
            if (ctorSpecial) {
                // full blown ritual
                if (a0) {
                    // process the preamble of the 1st argument
                    f = a0.preamble;
                    if (f) {
                        t = f.apply(this, t) || t;
                    }
                }
                f = this.preamble;
                if (f) {
                    // process the preamble of this class
                    f.apply(this, t);
                    // one peculiarity of the preamble:
                    // it is called even if it is not needed,
                    // e.g., there is no constructor to call
                    // let's watch for the last constructor
                    // (see ticket #9795)
                }
            }
            // 2) call a constructor
            if (ctor) {
                ctor.apply(this, a);
            }
            // 3) continue the original ritual: call the postscript
            f = this.postscript;
            if (f) {
                f.apply(this, a);
            }
        };
    }
    // plain vanilla constructor (can use inherited() to call its base constructor)
    function simpleConstructor(bases) {
        return function () {
            var a = arguments, i = 0, f, m;
            if (!(this instanceof a.callee)) {
                // not called via new, so force it
                return applyNew(a);
            }
            //this._inherited = {};
            // perform the shaman's rituals of the original declare()
            // 1) do not call the preamble
            // 2) call the top constructor (it can use this.inherited())
            for (; f = bases[i]; ++i) {
                m = f._meta;
                f = m ? m.ctor : f;
                if (f) {
                    f.apply(this, a);
                    break;
                }
            }
            // 3) call the postscript
            f = this.postscript;
            if (f) {
                f.apply(this, a);
            }
        };
    }
    function chain(name, bases, reversed) {
        return function () {
            var b, m, f, i = 0, step = 1;
            if (reversed) {
                i = bases.length - 1;
                step = -1;
            }
            for (; b = bases[i]; i += step) {
                m = b._meta;
                f = (m ? m.hidden : b.prototype)[name];
                if (f) {
                    f.apply(this, arguments);
                }
            }
        };
    }
    // #region 函数:declare(object)
    /**
     * 声明对象
     * @method declare
     * @memberof x
     * @param {String} [className] 类名称
     * @param {Class} [superclass] 父类
     * @param {Object} [props] 属性信息
     * @returns {Object} 声明的对象
     * @example
     * // 定义一个类
     * var A = x.declare(5, function(timer) {
     *   console.log(new Date());
     *   // 停止计时器
     *   timer.stop();
     * });
     * // 初始化一个类
     * var obj = new A();
    */
    var declare = function (className, superclass, props) {
        // 处理参数
        var className, superclass, props;
        if (arguments.length == 1) {
            // 一个参数
            className = null;
            superclass = null;
            props = arguments[0] || {};
        }
        else if (arguments.length == 2) {
            // 两个参数
            if (lang.isString(arguments[0])) {
                className = arguments[0] || {};
                superclass = null;
                props = arguments[1] || {};
            }
            else {
                className = null;
                superclass = arguments[0] || {};
                props = arguments[1] || {};
            }
        }
        else if (arguments.length == 3) {
            className = arguments[0];
            superclass = arguments[1] || {};
            props = arguments[2] || {};
        }
        // 定义变量
        var proto, t, ctor;
        // 定义一个空的对象
        ctor = function () { };
        // 定义 prototype
        proto = {};
        if (lang.isArray(superclass)) {
            // 多个类继承
            for (var i = 0; i < superclass.length; i++) {
                lang.extend(proto, superclass[i]);
            }
        }
        else if (superclass != null) {
            lang.extend(proto, superclass);
        }
        // target = lang.ext(target, props);
        for (var property in props) {
            ctor.prototype[property] = props[property];
            lang.extend(proto, props);
        }
        // add constructor
        // 添加构造函数
        t = props.constructor;
        if (t !== op.constructor) {
            t.nom = cname;
            proto.constructor = t;
        }
        // collect chains and flags
        //build ctor
        // 构建类的构造函数
        // ctor.prototype.constructor = props.constructor ? props.constructor : lang.noop;
        // t = !chains || !chains.hasOwnProperty(cname);
        // bases[0] = ctor = (chains && chains.constructor === "manual") ? simpleConstructor(bases) :
        //  (bases.length == 1 ? singleConstructor(props.constructor, t) : chainedConstructor(bases, t));
        ctor = singleConstructor(props.constructor, t);
        // add meta information to the constructor
        ctor._meta = {
            // bases: bases,
            hidden: props,
            // chains: chains,
            // parents: parents,
            ctor: props.constructor
        };
        ctor.superclass = superclass && superclass.prototype;
        // ctor.extend = extend;
        // ctor.createSubclass = createSubclass;
        ctor.prototype = proto;
        proto.constructor = ctor;
        if (className) {
            // props.declaredClass = className;
            ctor.prototype.declaredClass = className;
            // 设置对象到注册的位置
            var parts = className.split(".");
            var name_1 = parts.pop();
            var context = parts.length == 0 ? kernel.global() : kernel.register(parts.join('.'));
            context[name_1] = ctor;
        }
        return ctor;
    };
    return declare;
});
define("src/collections/Hashtable", ["require", "exports", "src/base/declare"], function (require, exports, declare) {
    "use strict";
    // #region 类:Dict()
    /**
    * 字典
    * @class Hashtable 字典
    * @constructor Hashtable
    * @memberof x.collections
    * @example
    * // returns Dict
    * var dict = x.collections.Hashtable();
    */
    var self = declare({
        // 内部数组对象
        // innerArray: [],
        constructor: function () {
            this.innerArray = [];
        },
        // #region 函数:clear()
        /**
        * 清空字典
        * @method clear
        * @memberof x.Dict#
        */
        clear: function () {
            this.innerArray = [];
        },
        // #endregion
        // #region 函数:exist(key)
        /**
        * 判断是否已存在相同键的对象
        * @method exist
        * @memberof x.Dict#
        * @returns {bool}
        */
        exist: function (key) {
            for (var i = 0; i < this.innerArray.length; i++) {
                if (this.innerArray[i].key === key) {
                    return true;
                }
            }
            return false;
        },
        // #endregion
        // #region 函数:index(key)
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
        // #endregion
        // #region 函数:add(key, value)
        /**
        * @method add
        * @memberof x.Dict#
        */
        add: function (key, value) {
            if (arguments.length === 1) {
                var list = key.split('&');
                for (var i = 0; i < list.length; i++) {
                    var values = list[i].split('=');
                    this.innerArray.push({ key: values[0], value: values[1] });
                }
            }
            else {
                if (this.exist(key)) {
                    throw 'aleardy exist same key[' + key + ']';
                }
                else {
                    this.innerArray.push({ key: key, value: value });
                }
            }
        },
        // #endregion
        // #region 函数:remove(key)
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
        // #region 函数:get(key)
        /**
         * 获取值
        * @method get
        * @memberof x.Dict#
        */
        get: function (key) {
            for (var i = 0; i < this.innerArray.length; i++) {
                if (this.innerArray[i].key === key) {
                    return this.innerArray[i].value;
                }
            }
            return null;
        },
        // #endregion
        // #region 函数:get(key)
        /**
         * 设置值
        * @method set
        * @memberof x.Dict#
        */
        set: function (key, value) {
            for (var i = 0; i < this.innerArray.length; i++) {
                if (this.innerArray[i].key === key) {
                    this.innerArray[i].value = value;
                }
            }
        },
        // #endregion
        // #region 函数:size()
        /**
        * 获取字典的当前大小
        * @method size
        * @memberof x.Dict#
        */
        size: function () {
            return this.innerArray.length;
        }
        // #endregion
    });
    return self;
});
define("src/collections/Queue", ["require", "exports", "src/base/declare"], function (require, exports, declare) {
    "use strict";
    /**
     * 队列
     * @namespace queue
     * @memberof x
     */
    var self = declare({
        // #region 类:constructor()
        /**
         * 队列
         * @description Queue 对象
         * @class Queue 队列
         * @constructor Queue
         * @memberof x.collections
         */
        constructor: function () {
            // 内部数组对象
            this.innerArray = [];
        },
        /**
             * 插入队列顶部元素
             * @method push
             * @memberof x.collections.Queue#
             */
        push: function (targetObject) {
            this.innerArray.push(targetObject);
        },
        // #endregion
        /**
         * 弹出队列顶部元素
         * @method pop
         * @memberof x.collections.Queue#
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
        // #endregion
        /**
         * 取出队列底部元素(并不删除队列底部元素)
         */
        peek: function () {
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
        clear: function () {
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
        size: function () {
            return this.innerArray.length;
        },
        // #endregion
        // #region 函数:isEmpty()
        /**
         * 判断一个线性队列是否为空
         * @method isEmpty
         * @memberof x.collections.Queue#
         */
        isEmpty: function () {
            return this.innerArray.length === 0 ? true : false;
        }
        // #endregion
    });
    return self;
});
define("src/collections/Stack", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
    * 栈
    * @namespace stack
    * @memberof x
    */
    var self = {
        // #region 类:newStack()
        /**
         * 栈
         * @description 创建 Stack 对象
         * @memberof x.stack
         * @returns {Object} {@link x.stack.Stack|Stack} 对象
         * @example
         * // 初始化一个 Stack 对象
         * var stack = x.stack.create();
         */
        create: function () {
            return self.constructor();
        },
        // #region 类:newStack()
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
                /**
                 * 插入栈顶元素
                 *
                 */
                push: function (element) {
                    this.innerArray[this.innerArray.length] = element;
                },
                // #endregion
                /*
                * 弹出栈顶元素(并删除栈顶元素)
                */
                pop: function () {
                    if (this.innerArray.length === 0) {
                        return null;
                    }
                    else {
                        var element = this.innerArray[this.innerArray.length - 1];
                        this.innerArray.length--;
                        return element;
                    }
                },
                // #endregion
                /*
                * 取出栈顶元素(并不删除栈顶元素)
                */
                peek: function () {
                    if (this.innerArray.length === 0) {
                        return null;
                    }
                    return this.innerArray[this.innerArray.length - 1];
                },
                // #endregion
                /**
                 * 清空堆栈
                 */
                clear: function () {
                    //将元素的个数清零即可
                    this.innerArray.length = 0;
                },
                // #endregion
                // #region 函数:size()
                /**
                * 获得线性堆栈的当前大小
                * @method size
                * @memberof x.newStack#
                */
                size: function () {
                    return this.innerArray.length;
                },
                // #endregion
                /*
                * 判断一个线性堆栈是否为空
                */
                isEmpty: function () {
                    return (this.innerArray.length === 0) ? true : false;
                }
                // #endregion
            };
            return stack;
        }
        // #endregion
    };
    return self;
});
define("src/base", ["require", "exports", "src/base/lang", "src/base/kernel", "src/base/declare", "src/collections/Hashtable", "src/collections/Queue", "src/collections/Stack"], function (require, exports, lang, kernel, declare, Hashtable, Queue, Stack) {
    "use strict";
    /**
     * X JavaScript Library
     * @namespace x
     */
    var self = lang.extend({}, lang, kernel, {
        // 声明对象方法
        declare: declare,
        // #region 函数:query(selector)
        /**
        * 精确查询单个表单元素。
        * @method query
        * @memberof x
        * @param {String} selector 选择表达式
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
        // #endregion
        // #region 函数:queryAll(selector)
        /**
        * 精确查询单个表单元素。
        * @method queryAll
        * @memberof x
        * @param {String} selector 选择表达式
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
        // #endregion
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
    };
    lang.extend(self.collections, collections);
    return self;
});
// -*- ecoding=utf-8 -*-
define("src/event", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
    * 事件
    * @namespace event
    * @memberof x
    */
    var self = {
        // #region 函数:getEvent(event)
        /**
        * 获取事件对象
        * @method getEvent
        * @memberof x.event
        * @param {event} event 事件对象
        */
        getEvent: function (event) {
            return window.event ? window.event : event;
        },
        // #endregion
        // #region 函数:getTarget(event)
        /**
        * 获取事件的目标对象
        * @method getTarget
        * @memberof x.event
        * @param {event} event 事件对象
        */
        getTarget: function (event) {
            return window.event ? window.event.srcElement : event ? event.target : null;
        },
        // #endregion
        // #region 函数:getPosition(event)
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
                x: event.pageX || event.clientX + (docElement.scrollLeft || body.scrollLeft) - (docElement.clientLeft || 0),
                y: event.pageY || event.clientY + (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0)
            };
        },
        // #endregion
        // #region 函数:preventDefault(event)
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
        // #endregion
        // #region 函数:stopPropagation(event)
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
        // #endregion
        // #region 函数:add(target, type, listener, useCapture)
        /**
         * 添加事件监听器
         * x.event.add(target, type, listener, useCapture) 的快捷方法
         * @method on
         * @memberof x
         * @param {String} target 监听对象
         * @param {String} type 监听事件
         * @param {String} listener 处理函数
         * @param {String} [useCapture] 监听顺序方式
         */
        /**
         * 添加事件监听器
         * @method add
         * @memberof x.event
         * @param {String} target 监听对象
         * @param {String} type 监听事件
         * @param {String} listener 处理函数
         * @param {String} [useCapture] 监听顺序方式
         */
        add: function (target, type, listener, useCapture) {
            if (target == null)
                return;
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
        // #endregion
        // #region 函数:remove(target, type, listener, useCapture)
        /**
         * 移除事件监听器
         * x.event.remove(target, type, listener, useCapture) 的快捷方法
         * @method off
         * @memberof x
         * @param {String} target 监听对象
         * @param {String} type 监听事件
         * @param {String} listener 处理函数
         * @param {String} [useCapture] 监听顺序方式
         */
        /**
         * 移除事件监听器
         * @method remove
         * @memberof x.event
         * @param {String} target 监听对象
         * @param {String} type 监听事件
         * @param {String} listener 处理函数
         * @param {String} [useCapture] 监听顺序方式
         */
        remove: function (target, type, listener, useCapture) {
            if (target == null)
                return;
            if (target.removeEventListener) {
                target.removeEventListener(type, listener, useCapture);
            }
            else if (target.detachEvent) {
                target.detachEvent('on' + type, listener);
            }
            else {
                target['on' + type] = null;
            }
        },
        // #endregion
        fire: function (target, type) {
            var events = target._listeners[type];
            if (events instanceof Array) {
                for (var i = 0, length = events.length; i < length; i++) {
                    if (typeof events[i] === 'function') {
                        events[i]({ type: type });
                    }
                }
            }
            return target;
        }
    };
    return self;
});
// -*- ecoding=utf-8 -*-
define("src/color", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
    * 颜色编码
    * @namespace color
    * @memberof x
    */
    var self = {
        // 正则规则
        // reg: /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
        /**
        * RGB 颜色转为十六进制格式
        */
        hex: function (colorRgbCode) {
            if (/^(rgb|RGB)/.test(colorRgbCode)) {
                var colorBuffer = colorRgbCode.replace(/(?:\(|\)|rgb|RGB)/g, "").split(",");
                var strHex = "#";
                for (var i = 0; i < colorBuffer.length; i++) {
                    var hex = Number(colorBuffer[i]).toString(16);
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = colorRgbCode;
                }
                return strHex;
            }
            else if (/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(colorRgbCode)) {
                var colorBuffer = colorRgbCode.replace(/#/, "").split("");
                if (colorBuffer.length === 6) {
                    return colorRgbCode;
                }
                else if (colorBuffer.length === 3) {
                    var numHex = "#";
                    for (var i = 0; i < colorBuffer.length; i += 1) {
                        numHex += (colorBuffer[i] + colorBuffer[i]);
                    }
                    return numHex;
                }
            }
            else {
                return colorRgbCode;
            }
        },
        /**
        * 十六进制颜色转为 RGB 格式
        */
        rgb: function (colorHexCode) {
            var color = colorHexCode.toLowerCase();
            if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
                // 处理简写的颜色
                if (color.length === 4) {
                    var originalColor = "#";
                    for (var i = 1; i < 4; i += 1) {
                        originalColor += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                    }
                    color = originalColor;
                }
                // 处理六位的颜色值
                var colorBuffer = [];
                for (var i = 1; i < 7; i += 2) {
                    colorBuffer.push(parseInt("0x" + color.slice(i, i + 2)));
                }
                return 'rgb(' + colorBuffer.join(', ') + ')';
            }
            else {
                return color;
            }
        }
    };
    return self;
});
define("src/cookies", ["require", "exports", "src/base/lang"], function (require, exports, lang) {
    "use strict";
    /**
    * @namespace cookies
    * @memberof x
    * @description Cookies 管理
    */
    var self = {
        /*#region 函数:query(name)*/
        /**
        * 根据 Cookie 名称查找相关的值
        * @method query
        * @memberof x.cookies
        * @param {string} name 名称
        */
        query: function (name) {
            var value = '';
            var search = name + '=';
            if (document.cookie.length > 0) {
                var offset = document.cookie.indexOf(search);
                if (offset != -1) {
                    offset += search.length;
                    var end = document.cookie.indexOf(';', offset);
                    if (end == -1) {
                        end = document.cookie.length;
                    }
                    value = unescape(document.cookie.substring(offset, end));
                }
            }
            return value;
        },
        /*#endregion*/
        /*#region 函数:add(name, value, options)*/
        /**
        * 新增 Cookie 的值
        * @method add
        * @memberof x.cookies
        * @param {string} name 名称
        * @param {string} value 值
        * @param {object} [options] 选项<br />
        * 可选键值范围:
        * <table class="param-options" >
        * <thead>
        * <tr><th>名称</th><th>类型</th><th class="last" >描述</th></tr>
        * </thead>
        * <tbody>
        * <tr><td class="name" >expire</td><td>string</td><td>过期时间</td></tr>
        * <tr><td class="name" >path</td><td>string</td><td>所属的路径</td></tr>
        * <tr><td class="name" >domain</td><td>string</td><td>所属的域</td></tr>
        * </tbody>
        * </table>
        * @example
        * // 新增一条 Cookie 记录,
        * // 名称为 CookieName1, 值为 CookieValue1
        * x.cookie.add('CookieName1', 'CookieValue1');
        * @example
        * // 新增一条 Cookie 记录,
        * // 名称为 CookieName2, 值为 CookieValue2,
        * // 过期时间为 2050-1-1 10:30:00
        * x.cookie.add('cookieName2', 'cookieValue2', {'expire': new (2050, 1, 1, 10, 30, 00)});
        * @example
        * // 新增一条 Cookie 记录,
        * // 名称为 CookieName3, 值为 CookieValue3,
        * // 过期时间为 2050-1-1 10:30:00 , 所属路径为 /help/
        * x.cookies.add('cookieName3', 'cookieValue3', {'expire': new (2050,1,1,10,30,00), path: '/help/'});
        * @example
        * // 新增一条 Cookie 记录,
        * // 名称为 CookieName4, 值为 CookieValue4,
        * // 过期时间为 2050-1-1 10:30:00, 所属的域为 github.com
        * x.cookies.add('cookieName4', 'cookieValue4', {'expire': new (2050,1,1,10,30,00), path: '/', domain: 'github.com');
        */
        add: function (name, value, options) {
            options = lang.extend({ path: '/' }, options || {});
            document.cookie = escape(name) + '=' + escape(value)
                + ((!options.expire) ? '' : ('; expires=' + options.expire.toUTCString()))
                + '; path=' + options.path
                + ((!options.domain) ? '' : ('; domain=' + options.domain));
        },
        /*#endregion*/
        /*#region 函数:remove(name, options)*/
        /**
        * 移除 Cookie 的值
        * @method remove
        * @memberof x.cookies
        * @param {string} name 名称
        * @param {object} [options] 选项<br />
        * 可选键值范围:
        * <table class="param-options" >
        * <thead>
        * <tr><th>名称</th><th>类型</th><th class="last" >描述</th></tr>
        * </thead>
        * <tbody>
        * <tr><td class="name" >path</td><td>string</td><td>所属的路径</td></tr>
        * <tr><td class="name" >domain</td><td>string</td><td>所属的域</td></tr>
        * </tbody>
        * </table>
        * @example
        * // 移除一条 Cookie 记录, 名称为 CookieName1
        * x.cookies.remove('CookieName1');
        * @example
        * // 移除一条 Cookie 记录, 名称为 CookieName2
        * x.cookies.remove('CookieName2', {path: '/help/'});
        */
        remove: function (name, options) {
            options = lang.extend({ path: '/' }, options || {});
            if (!!this.query(name)) {
                document.cookie = escape(name) + '=; path=' + options.path
                    + '; expires=' + new Date(0).toUTCString()
                    + ((!options.domain) ? '' : ('; domain=' + options.domain));
            }
        }
        /*#endregion*/
    };
    return self;
});
// -*- ecoding=utf-8 -*-
define("src/string", ["require", "exports", "src/base"], function (require, exports, x) {
    "use strict";
    // 字符两侧空格
    // \uFEFF 表示 BOM(Byte Order Mark) 即字节序标记 相关链接:http://zh.wikipedia.org/wiki/字节顺序记号
    // \xA0   表示 NBSP = CHAR(160) 即字节序标记 相关链接:http://zh.wikipedia.org/wiki/不换行空格
    var trimExpr = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    /**
     * @namespace string
     * @memberof x
     * @description 字符串
     */
    var self = {
        // #region 函数:stringify(value)
        /**
         * 将其他类型的值转换成字符串
         * x.event.remove(target, type, listener, useCapture) 的快捷方法
         * @method stringify
         * @memberof x
         * @param {anything} value 值
         */
        /**
         * 将其他类型的值转换成字符串
         * @method stringify
         * @memberof x.string
         * @param {anything} value 值
         */
        stringify: function (value) {
            var outString = '';
            var type = x.type(value);
            // console.log(value + ' type:' + type);
            if (type !== 'string') {
                if (type === 'number' || type === 'boolean' || type === 'date') {
                    outString = value + '';
                }
                else if (type === 'array') {
                    outString = '[';
                    x.each(value, function (index, node) {
                        outString += self.stringify(value) + ',';
                    });
                    outString = self.rtrim(outString, ',');
                    outString += ']';
                }
                else if (type === 'function') {
                    outString = self.stringify(value.call(value));
                }
                else {
                    // undefined or null
                    outString = '';
                }
            }
            else {
                outString = value;
            }
            return outString;
        },
        // #endregion
        // #region 函数:trim(text, trimText)
        /**
         * 去除字符串两端空白或其他文本信息
         * @method trim
         * @memberof x.string
         * @param {String} text 文本信息.
         * @param {Number} [trimText] 需要去除的文本信息(默认为空白).
         */
        trim: function (text, trimText) {
            if (trimText === void 0) { trimText = undefined; }
            if (x.isUndefined(trimText)) {
                return text.replace(trimExpr, '');
            }
            else {
                return self.rtrim(self.ltrim(text, trimText), trimText);
            }
        },
        // #endregion
        // #region 函数:ltrim(text, trimText)
        /**
         * 去除字符串左侧空白
         * @method ltrim
         * @memberof x.string
         * @param {String} text 文本信息.
         * @param {Number} [trimText] 需要去除的文本信息(默认为空白).
         */
        ltrim: function (text, trimText) {
            if (trimText === void 0) { trimText = undefined; }
            if (x.isUndefined(trimText)) {
                return text.replace(/(^[\s\uFEFF\xA0]+)/g, '');
            }
            else {
                return text.replace(RegExp('(^' + trimText.replace(/\\/g, '\\\\') + ')', 'gi'), '');
            }
        },
        // #endregion
        // #region 函数:rtrim(text, trimText)
        /**
         * 去除字符串右侧空白
         * @method rtrim
         * @memberof x.string
         * @param {String} text 文本信息.
         * @param {Number} [trimText] 需要去除的文本信息(默认为空白).
         */
        rtrim: function (text, trimText) {
            if (trimText === void 0) { trimText = undefined; }
            if (x.isUndefined(trimText)) {
                return text.replace(/([\s\uFEFF\xA0]+$)/g, '');
            }
            else {
                return text.replace(RegExp('(' + trimText.replace(/\\/g, '\\\\') + '$)', 'gi'), '');
                // return (text.substr(text.length - trimText.length, trimText.length) === trimText) ? text.substr(0, text.length - trimText.length) : text;
            }
        },
        // #endregion
        // #region 函数:format(text, args)
        /**
         * 字符串格式化
         * @method format
         * @memberof x.string
         * @param {String} text 文本信息.
         * @param {Number} [args] 参数.
         */
        format: function (text) {
            if (arguments.length == 0) {
                // throw new ReferenceError('Hello');
                return null;
            }
            var text = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                text = text.replace(re, arguments[i]);
            }
            return text;
        },
        // #endregion
        // #region 函数:ellipsis(text, length, hasEllipsis)
        /**
         * 字符串长度超过规定长度时, 左侧多余的字符显示省略号
         * @method left
         * @memberof x.string
         * @param {String} text 需要处理的字符串
         * @param {Number} length 长度范围
         * @param {bool} [hasEllipsis] 是否显示...
         * @example
         * // 返回 'java...'
         * x.string.ellipsis('javascript', 4);
         * @example
         * // 返回 'java'
         * x.string.ellipsis('javascript', 4, false);
         */
        ellipsis: function (text, length, hasEllipsis) {
            if (hasEllipsis === void 0) { hasEllipsis = true; }
            if (text.length === 0) {
                return text;
            }
            if (text.length > length) {
                return text.substr(0, length) + (hasEllipsis ? '...' : '');
            }
            else {
                return text;
            }
        }
        // #endregion
    };
    return self;
});
// -*- ecoding=utf-8 -*-
define("src/encoding", ["require", "exports", "src/base", "src/string"], function (require, exports, x, string) {
    "use strict";
    /**
    * @namespace encoding
    * @memberof x
    * @description 编码
    */
    var self = {
        /**
        * @namespace html
        * @memberof x.encoding
        * @description html 编码管理
        */
        html: {
            // http://www.w3.org/MarkUp/html-spec/html-spec_13.html
            dict: {
                '&': '&#32;',
                ' ': '&#38;',
                '<': '&#60;',
                '>': '&#62;',
                '"': '&#34;',
                '\'': '&#39;'
            },
            // #region 函数:encode(text)
            /**
            * html 编码
            * @method encode
            * @memberof x.encoding.html
            * @param {String} text 文本信息
            * @example
            * // 输出格式 &#60;p&#62;hello&#60;/p&#62;
            * console.log(x.encoding.html.encode('<p>hello</p>'));
            */
            encode: function (text) {
                // 空值判断
                if (text.length === 0) {
                    return '';
                }
                text = string.stringify(text);
                return text.replace(/&(?![\w#]+;)|[<>"']/g, function (s) {
                    return self.html.dict[s];
                });
                //            var outString = text.replace(/&/g, '&amp;');
                //            outString = outString.replace(/</g, '&lt;');
                //            outString = outString.replace(/>/g, '&gt;');
                //            outString = outString.replace(/ /g, '&nbsp;');
                //            outString = outString.replace(/\'/g, '&#39;');
                //            outString = outString.replace(/\"/g, '&quot;');
                //            return outString;
            },
            // #endregion
            // #region 函数:decode(text)
            /**
            * html 解码
            * @method decode
            * @memberof x.encoding.html
            * @param {String} text 文本信息
            */
            decode: function (text) {
                // 空值判断
                if (text.length === 0) {
                    return '';
                }
                text = string.stringify(text);
                var outString = '';
                outString = text.replace(/&amp;/g, "&");
                outString = outString.replace(/&lt;/g, "<");
                outString = outString.replace(/&gt;/g, ">");
                outString = outString.replace(/&nbsp;/g, " ");
                outString = outString.replace(/&#39;/g, "\'");
                outString = outString.replace(/&quot;/g, "\"");
                return outString;
            }
            // #endregion
        },
        /**
        * @namespace unicode
        * @memberof x.encoding
        * @description unicode 编码管理
        */
        unicode: {
            // 注意
            // html 的 unicode 编码格式是&#888888;, javascript 的 unicode 编码格式\u000000
            // #region 函数:encode(text)
            /**
            * unicode 编码
            * @method encode
            * @memberof x.encoding.unicode
            * @param {String} text 文本信息
            */
            encode: function (text, prefix) {
                if (text.length === 0) {
                    return '';
                }
                prefix = prefix || '\\u';
                text = string.stringify(text);
                var outString = '';
                for (var i = 0; i < text.length; i++) {
                    var temp = (prefix === '&#') ? text.charCodeAt(i).toString(10) : text.charCodeAt(i).toString(16);
                    if (temp.length < 4) {
                        while (temp.length < 4) {
                            temp = '0'.concat(temp);
                        }
                    }
                    outString = outString.concat(prefix + temp);
                    if (prefix.indexOf('&#') == 0) {
                        outString += ';';
                    }
                }
                return outString.toLowerCase();
            },
            // #endregion
            // #region 函数:decode(text)
            /**
            * unicode 解码
            * @method decode
            * @memberof x.encoding.unicode
            * @param {String} text 文本信息
            */
            decode: function (text, prefix) {
                if (text.length === 0) {
                    return '';
                }
                prefix = prefix || '\\u';
                text = string.stringify(text);
                var outString = '';
                var list = text.match(/([\w]+)|(\\u([\w]{4}))/g);
                if (list != null) {
                    x.each(list, function (index, node) {
                        if (node.indexOf(prefix) == 0) {
                            outString += String.fromCharCode(parseInt(node.slice(2, 6), 16));
                        }
                        else {
                            outString += node;
                        }
                    });
                }
                return outString;
            }
            // #endregion
        }
    };
    return self;
});
// -*- ecoding=utf-8 -*-
define("src/regexp", ["require", "exports", "src/base", "src/string"], function (require, exports, x, string) {
    "use strict";
    /**
    * @namespace regexp
    * @memberof x
    * @description 正则表达式管理
    */
    var self = {
        /**
        * 规则集合
        * @member {Object} rules
        * @memberof x.regexp
        * @example
        * // 返回邮箱地址的正则表达式
        * self.rules['email'];
        */
        rules: {
            // -----------------------------------------------------------------------------
            // 正则表达式全部符号解释
            // -----------------------------------------------------------------------------
            // \            将下一个字符标记为一个特殊字符、或一个原义字符、或一个 向后引用、或一个八进制转义符。
            //              例如，'n' 匹配字符 "n"。'\n' 匹配一个换行符。序列 '\\' 匹配 "\" 而 "\(" 则匹配 "("。
            // ^            匹配输入字符串的开始位置。如果设置了 RegExp 对象的 Multiline 属性，^ 也匹配 '\n' 或 '\r' 之后的位置。
            // $            匹配输入字符串的结束位置。如果设置了RegExp 对象的 Multiline 属性，$ 也匹配 '\n' 或 '\r' 之前的位置。
            // *            匹配前面的子表达式零次或多次。例如，zo* 能匹配 "z" 以及 "zoo"。* 等价于{0,}。
            // +            匹配前面的子表达式一次或多次。例如，'zo+' 能匹配 "zo" 以及 "zoo"，但不能匹配 "z"。+ 等价于 {1,}。
            // ?            匹配前面的子表达式零次或一次。例如，"do(es)?" 可以匹配 "do" 或 "does" 中的"do" 。? 等价于 {0,1}。
            // {n}          n 是一个非负整数。匹配确定的 n 次。例如，'o{2}' 不能匹配 "Bob" 中的 'o'，但是能匹配 "food" 中的两个 o。
            // {n,}         n 是一个非负整数。至少匹配n 次。例如，'o{2,}' 不能匹配 "Bob" 中的 'o'，但能匹配 "foooood" 中的所有 o。
            //              'o{1,}' 等价于 'o+'。'o{0,}' 则等价于 'o*'。
            // {n,m}        m 和 n 均为非负整数，其中n <= m。最少匹配 n 次且最多匹配 m 次。例如，"o{1,3}" 将匹配 "fooooood" 中的前三个 o。
            //              'o{0,1}' 等价于 'o?'。请注意在逗号和两个数之间不能有空格。
            // ?	        当该字符紧跟在任何一个其他限制符 (*, +, ?, {n}, {n,}, {n,m}) 后面时，匹配模式是非贪婪的。非贪婪模式尽可能少的匹配所搜索的字符串，而默认的贪婪模式则尽可能多的匹配所搜索的字符串。例如，对于字符串 "oooo"，'o+?' 将匹配单个 "o"，而 'o+' 将匹配所有 'o'。
            // .	        匹配除 "\n" 之外的任何单个字符。要匹配包括 '\n' 在内的任何字符，请使用象 '[.\n]' 的模式。
            // (pattern)	匹配 pattern 并获取这一匹配。所获取的匹配可以从产生的 Matches 集合得到，在VBScript 中使用 SubMatches 集合，在JScript 中则使用 $0…$9 属性。要匹配圆括号字符，请使用 '\(' 或 '\)'。
            // (?:pattern)	匹配 pattern 但不获取匹配结果，也就是说这是一个非获取匹配，不进行存储供以后使用。这在使用 "或" 字符 (|) 来组合一个模式的各个部分是很有用。例如， 'industr(?:y|ies) 就是一个比 'industry|industries' 更简略的表达式。
            // (?=pattern)	正向预查，在任何匹配 pattern 的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如，'Windows (?=95|98|NT|2000)' 能匹配 "Windows 2000" 中的 "Windows" ，但不能匹配 "Windows 3.1" 中的 "Windows"。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。
            // (?!pattern)	负向预查，在任何不匹配 pattern 的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如'Windows (?!95|98|NT|2000)' 能匹配 "Windows 3.1" 中的 "Windows"，但不能匹配 "Windows 2000" 中的 "Windows"。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始
            // x|y	        匹配 x 或 y。例如，'z|food' 能匹配 "z" 或 "food"。'(z|f)ood' 则匹配 "zood" 或 "food"。
            // [xyz]	    字符集合。匹配所包含的任意一个字符。例如， '[abc]' 可以匹配 "plain" 中的 'a'。
            // [^xyz]	    负值字符集合。匹配未包含的任意字符。例如， '[^abc]' 可以匹配 "plain" 中的'p'。
            // [a-z]	    字符范围。匹配指定范围内的任意字符。例如，'[a-z]' 可以匹配 'a' 到 'z' 范围内的任意小写字母字符。
            // [^a-z]	    负值字符范围。匹配任何不在指定范围内的任意字符。例如，'[^a-z]' 可以匹配任何不在 'a' 到 'z' 范围内的任意字符。
            // \b	        匹配一个单词边界，也就是指单词和空格间的位置。例如， 'er\b' 可以匹配"never" 中的 'er'，但不能匹配 "verb" 中的 'er'。
            // \B	        匹配非单词边界。'er\B' 能匹配 "verb" 中的 'er'，但不能匹配 "never" 中的 'er'。
            // \cx	        匹配由 x 指明的控制字符。例如， \cM 匹配一个 Control-M 或回车符。x 的值必须为 A-Z 或 a-z 之一。否则，将 c 视为一个原义的 'c' 字符。
            // \d	        匹配一个数字字符。等价于 [0-9]。
            // \D	        匹配一个非数字字符。等价于 [^0-9]。
            // \f	        匹配一个换页符。等价于 \x0c 和 \cL。
            // \n	        匹配一个换行符。等价于 \x0a 和 \cJ。
            // \r	        匹配一个回车符。等价于 \x0d 和 \cM。
            // \s	        匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。
            // \S	        匹配任何非空白字符。等价于 [^ \f\n\r\t\v]。
            // \t	        匹配一个制表符。等价于 \x09 和 \cI。
            // \v	        匹配一个垂直制表符。等价于 \x0b 和 \cK。
            // \w	        匹配包括下划线的任何单词字符。等价于'[A-Za-z0-9_]'。
            // \W	        匹配任何非单词字符。等价于 '[^A-Za-z0-9_]'。
            // \xn	        匹配 n，其中 n 为十六进制转义值。十六进制转义值必须为确定的两个数字长。例如，'\x41' 匹配 "A"。'\x041' 则等价于 '\x04' & "1"。正则表达式中可以使用 ASCII 编码。.
            // \num	        匹配 num，其中 num 是一个正整数。对所获取的匹配的引用。例如，'(.)\1' 匹配两个连续的相同字符。
            // \n	        标识一个八进制转义值或一个向后引用。如果 \n 之前至少 n 个获取的子表达式，则 n 为向后引用。否则，如果 n 为八进制数字 (0-7)，则 n 为一个八进制转义值。
            // \nm	        标识一个八进制转义值或一个向后引用。如果 \nm 之前至少有 nm 个获得子表达式，则 nm 为向后引用。如果 \nm 之前至少有 n 个获取，则 n 为一个后跟文字 m 的向后引用。如果前面的条件都不满足，若 n 和 m 均为八进制数字 (0-7)，则 \nm 将匹配八进制转义值 nm。
            // \nml	        如果 n 为八进制数字 (0-3)，且 m 和 l 均为八进制数字 (0-7)，则匹配八进制转义值 nml。
            // \un	        匹配 n，其中 n 是一个用四个十六进制数字表示的 Unicode 字符。例如， \u00A9 匹配版权符号 (?)。
            // -----------------------------------------------------------------------------
            // 正则表达式的标准写法
            // -----------------------------------------------------------------------------
            // regexp = new RegExp(pattern[, flag]);
            // pattern  : 模板的用法是关键，也是本章的主要内容。
            // flag     : "i"(ignore)、"g"(global)、"m"(multiline)的组合
            //            i-忽略大小写，g-反复检索，m-多行检索     flag中没有g时，返回字符串，有g时返回字符串数组
            // 字符两侧空格
            // \uFEFF 表示 BOM(Byte Order Mark) 即字节序标记 相关链接:http://zh.wikipedia.org/wiki/字节顺序记号
            // \xA0   表示 NBSP = CHAR(160) 即字节序标记 相关链接:http://zh.wikipedia.org/wiki/不换行空格
            'trim': /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            // 日期
            'date': /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/g,
            // 链接地址
            //        var re = '^((https|http|ftp|rtsp|mms)?://)'
            //            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
            //            + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            //            + "|" // 允许IP和DOMAIN（域名）
            //            + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
            //            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
            //            + "[a-z]{2,6})" // first level domain- .com or .museum
            //            + "(:[0-9]{1,4})?" // 端口- :80
            //            + "((/?)|" // a slash isn't required if there is no file name
            //            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            'url': "^((https|http|ftp|rtsp|mms)?://)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$",
            // 电话号码
            'telephone': /(^\d+$)|((^\d+)([\d|\-]+)((\d+)$))|((^\+)([\d|\-]+)((\d+)$))/g,
            // 非电话号码
            'non-telephone': /[^\d\-\+]/g,
            // 电子邮箱
            'email': /^\w+((-\w+)|(\_\w+)|(\'\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g,
            // QQ号
            'qq': /^\w+((-\w+)|(\_\w+)|(\'\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g,
            // 数字
            'number': /(^-?\d+$)|(^-?\d+[\.?]\d+$)/g,
            // 非数字
            'non-number': /[^\d\.\-]/g,
            // 整数
            'integer': /^-?\d+$/g,
            // 正整数
            'positive-integer': /^\d+$/g,
            // 非整数
            'non-integer': /[^\d\-]/g,
            // 安全字符
            'safeText': /A-Za-z0-9_\-/g,
            // 非安全字符
            'non-safeText': /[^A-Za-z0-9_\-]/g,
            // 安全文件扩展名
            'fileExt': 'jpg,gif,jpeg,png,bmp,psd,sit,tif,tiff,eps,png,ai,qxd,pdf,cdr,zip,rar',
            // 其他规则
            'en-us': {
                // 美国邮编规则
                'zipcode': /^\d{5}-\d{4}$|^\d{5}$/g
            },
            'zh-cn': {
                'identityCard': /(^\d{15}$)|(^\d{18}$)|(^\d{17}[X|x]$)/g,
                // 中国邮编规则
                'zipcode': /^\d{6}$/g
            }
        },
        // #region 函数:match(options)
        /**
        * 匹配
        * @method match
        * @memberof x.regexp
        * @param {JSON} options 选项信息
        * @example
        * // 输出 匹配的对象
        * console.log(x.regexp.match({text:'abc',regexp:/^\d{6}$/g}));
        */
        match: function (options) {
            // 文本信息
            var text = String(options.text);
            // 忽略大小写
            var ignoreCase = options.ignoreCase;
            // 规则名称
            var regexpName = options.regexpName;
            // 规则
            var regexp = typeof (options.regexp) === 'undefined' ? undefined : new RegExp(options.regexp);
            if (ignoreCase === 1) {
                text = text.toLowerCase();
            }
            // 如果没有填写规则，并且填写了内置规则名称，则使用内置规则。
            if (typeof (regexp) === 'undefined' && typeof (regexpName) !== 'undefined') {
                regexp = self.rules[regexpName];
            }
            return text.match(regexp);
        },
        // #endregion
        // #region 函数:exists(options)
        /**
        * 利用正则表达式验证字符串规则
        * @method exists
        * @memberof x.regexp
        * @param {Object} options 选项信息
        * @example
        * // result = false;
        * var result = self.exists({
        *   text:'12345a',
        *   regexpName: 'number',
        *   ignoreCase: ture
        * });
        *
        * @example
        * // result = false;
        * var result = self.exists({
        *   text:'12345a',
        *   regexp: /^\d+$/g,
        *   ignoreCase: ture
        * });
        */
        exists: function (options) {
            var text = String(options.text);
            // 忽略大小写
            var ignoreCase = options.ignoreCase;
            // 规则名称
            var regexpName = options.regexpName;
            // 规则
            var regexp = typeof (options.regexp) === 'undefined' ? undefined : new RegExp(options.regexp);
            if (ignoreCase) {
                text = text.toLowerCase();
            }
            // 如果没有填写规则，并且填写了内置规则名称，则使用内置规则。
            if (typeof (regexp) === 'undefined' && typeof (regexpName) !== 'undefined') {
                regexp = self.rules[regexpName];
            }
            return text.match(regexp) !== null;
        },
        // #endregion
        // #region 函数:isFileExt(path, allowFileExt)
        /**
        * 验证文件的扩展名.
        * @method isFileExt
        * @memberof x.regexp
        * @param {String} path 文件路径
        * @param {String} allowFileExt 允许的扩展名, 多个以半角逗号隔开
        */
        isFileExt: function (path, allowFileExt) {
            var result = false;
            var ext = path.substr(path.lastIndexOf('.'), path.length - path.lastIndexOf('.'));
            var extValue = ((allowFileExt) ? allowFileExt : self.rules['fileExt']);
            ext = ext.replace('.', '');
            if (extValue.indexOf(',') != -1) {
                var list = extValue.split(',');
                for (var i = 0; i < list.length; i++) {
                    if (ext.toLowerCase() == list[i]) {
                        result = true;
                        break;
                    }
                }
            }
            else {
                if (ext.toLowerCase() == extValue) {
                    result = true;
                }
            }
            return result;
        },
        // #endregion
        // #region 函数:isUrl(text)
        /**
        * 验证URL地址格式
        * @method isUrl
        * @memberof x.regexp
        * @param {String} text 文本信息
        */
        isUrl: function (text) {
            return text.toLowerCase().exists(self.rules['url']);
        },
        // #endregion
        // #region 函数:isEmail(text)
        /*
        * 验证Email地址格式
        * @method isEmail
        * @memberof x.regexp
        * @param {String} text 文本信息
        */
        isEmail: function (text) {
            return text.toLowerCase().exists(self.rules['email']);
        },
        // #endregion
        // #region 函数:isZipcode(text, nature))
        /*
        * 验证邮编
        * @method isZipcode
        * @memberof x.regexp
        * @param {String} text 文本信息
        * @param {String} nature 区域信息
        */
        isZipcode: function (text, nature) {
            nature = x.formatLocale(nature);
            return text.exists(self.rules[nature]['zipcode']);
        },
        // #endregion
        // #region 函数:isSafeText(text)
        /**
        * 验证输入的字符串是否为安全字符, 即只允许字母、数字、下滑线。
        * @method isSafeText
        * @memberof x.regexp
        * @param {String} text 文本信息
        */
        isSafeText: function (text) {
            return text.exists(self.rules['safeText']);
        },
        // #endregion
        // #region 函数:formatTelephone(text)
        /**
        * 格式化输入的输入的文本为电话号码.
        * @method formatTelephone
        * @memberof x.regexp
        * @param {String} text 文本信息
        */
        formatTelephone: function (text) {
            return text.replace(self.rules['non-telephone'], '');
        },
        // #endregion
        // #region 函数:formatInteger(value, removePaddingZero)
        /**
        * 格式化输入的输入的文本为整数.
        * @method formatInteger
        * @memberof x.regexp
        * @param {String} value 文本信息
        * @param {bool} [removePaddingZero] 移除两侧多余的零
        * @example
        * var value = '12345a';
        * // return value = '12345'
        * value = self.formatInteger(value);
        * @example
        * var value = '012345';
        * // return value = '12345'
        * value = self.formatInteger(value, true);
        */
        formatInteger: function (value, removePaddingZero) {
            // number : ^\d
            value = String(value).replace(self.rules['non-integer'], '');
            if (string.trim(value) === '') {
                value = '0';
            }
            // 去除两侧多余的零
            if (removePaddingZero) {
                value = String(parseInt(value, 10));
            }
            return value;
        },
        // #endregion
        // #region 函数:formatNumber(value, removePaddingZero)
        /**
        * 格式化输入的输入的文本为数字.
        * @method formatInteger
        * @memberof x.regexp
        * @param {String} value 文本信息
        * @param {bool} [removePaddingZero] 移除两侧多余的零
        * @example
        * var value = '12345.00a';
        * // return value = '12345'
        * value = self.formatInteger(value);
        * @example
        * var value = '012345.00';
        * // return value = '12345'
        * value = self.formatInteger(value, true);
        */
        formatNumber: function (value, removePaddingZero) {
            if (removePaddingZero === void 0) { removePaddingZero = true; }
            value = String(value).replace(self.rules['non-number'], '');
            // 检测空字符串
            value = (value.trim() === '') ? '0' : value;
            // 去除两侧多余的零
            if (removePaddingZero) {
                value = String(parseFloat(value));
            }
            return value;
        },
        // #endregion
        // #region 函数:formatNumberRound2(value, removePaddingZero)
        /**
        * 格式化输入的文本统一为保留小数点后面两位的数字。
        * 小数点右侧两位之后的数字采用四舍五入的规则取舍。
        * @method formatNumberRound2
        * @memberof x.regexp
        * @param {String} value 文本信息
        * @param {bool} [removePaddingZero] 移除两侧多余的零
        * @example
        * var value = '12345';
        * // return value = '12345.00'
        * value = self.formatNumberRound2(value);
        */
        formatNumberRound2: function (value, removePaddingZero) {
            if (removePaddingZero === void 0) { removePaddingZero = true; }
            var text = '' + Math.round(Number(self.formatNumber(value)) * 100) / 100;
            var index = text.indexOf('.');
            if (index < 0) {
                return text + '.00';
            }
            var text = text.substring(0, index + 1) + text.substring(index + 1, index + 3);
            if (index + 2 == text.length) {
                text += '0';
            }
            // 去除两侧多余的零
            if (removePaddingZero) {
                value = parseFloat(text);
            }
            return value;
        },
        // #endregion
        // #region 函数:formatNumberRound2(value, removePaddingZero)
        /**
        * 格式化输入的文本统一为保留小数点后面两位的数字。
        * 小数点右侧N位之后的数字采用四舍五入的规则取舍。
        * @method formatNumberRound2
        * @memberof x.regexp
        * @param {String} value 文本信息
        * @param {Number} [length] 小数点右侧保留的位数
        * @param {bool} [removePaddingZero] 移除两侧多余的零
        * @example
        * var value = '12345';
        * // return value = '12345.00'
        * value = self.formatNumberRound(value);
        */
        formatNumberRound: function (value, length, removePaddingZero) {
            if (length === void 0) { length = 2; }
            if (removePaddingZero === void 0) { removePaddingZero = true; }
            // 设置倍数
            var multiple = 10;
            var count = 0;
            while (count < length) {
                multiple *= 10;
                count++;
            }
            var text = '' + Math.round(Number(self.formatNumber(value)) * multiple) / multiple;
            var index = text.indexOf('.');
            if (index < 0) {
                return text + '.00';
            }
            var text = text.substring(0, index + 1) + text.substring(index + 1, index + length + 1);
            while ((index + length) > text.length) {
                text += '0';
            }
            // 去除两侧多余的零
            if (removePaddingZero) {
                text = parseFloat(text).toString();
            }
            return text;
        },
        // #endregion
        // #region 函数:formatSafeText(text)
        /**
        * 格式化输入的文本为安全字符(常用于登录名和拼音字母的检测)
        * @method formatSafeText
        * @memberof x.regexp
        * @param {String} text 文本信息
        * @example
        * var text = 'abcd-$1234';
        * // return value = 'abcd1234'
        * text = self.formatSafeText(text);
        */
        formatSafeText: function (text) {
            return text.replace(self.rules['non-safeText'], '');
        }
        // #endregion
    };
    return self;
});
// -*- ecoding=utf-8 -*-
define("src/date", ["require", "exports", "src/base"], function (require, exports, x) {
    "use strict";
    var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    /**
     * @namespace date
     * @memberof x
     * @description 日期时间
     */
    var self = {
        /**
         * 当前时间对象
         * @method now
         * @memberof x.date
         */
        now: function () {
            return self.create();
        },
        /**
        * 创建时间对象
        * @method create
        * @memberof x.date
        * @param {Object} timeValue 符合时间规则的日期, 数组, 字符串
        */
        create: function (timeValue) {
            return self.newDateTime(timeValue);
        },
        /**
        * 时间间隔简写表
        * @method shortIntervals
        * @memberof x.date
        * @private
        */
        shortIntervals: {
            'y': 'year',
            'q': 'quarter',
            'M': 'month',
            'w': 'week',
            'd': 'day',
            'h': 'hour',
            'm': 'minute',
            's': 'second',
            'ms': 'msecond'
        },
        /**
        * 格式化时间间隔参数
        * @method formatInterval
        * @memberof x.date
        * @private
        */
        formatInterval: function (interval) {
            return self.shortIntervals[interval] || interval;
        },
        /**
        * 比较两个时间差异
        * @method diff
        * @memberof x.date
        */
        diff: function (begin, end, interval) {
            var timeBegin = self.newDateTime(begin);
            var timeEnd = self.newDateTime(end);
            return timeBegin.diff(self.formatInterval(interval), timeEnd);
        },
        /**
        * 比较两个时间差异
        * @method add
        * @memberof x.date
        */
        add: function (timeValue, interval, number) {
            var time = self.newDateTime(timeValue);
            return time.add(self.formatInterval(interval), number);
        },
        /**
        * 时间格式化
        * @method format
        * @memberof x.date
        * @param {Object} timeValue 符合时间规则的日期, 数组, 字符串
        * @param {String} formatValue 时间格式
        * @example
        * self.format('2000-01-01 00:00:00', 'yyyy/MM/dd hh:mm:ss');
        */
        format: function (timeValue, formatValue) {
            var time = self.create(timeValue);
            return time.toString(formatValue);
        },
        /**
        * 显示某个时间之前的格式
        * @method format
        * @memberof x.date
        * @param {Object} timeValue 符合时间规则的日期, 数组, 字符串
        * @param {Object} suffix 后缀配置
        * @example
        * self.ago('2000-01-01 00:00:00');
        * @example
        * self.ago('2000-01-01 00:00:00',{y});
        */
        ago: function (timeValue, suffix) {
            suffix = x.ext({
                minute: '分钟前',
                hour: '小时前',
                day: '天前'
            }, suffix);
            var time = self.create(timeValue);
            var now = self.create();
            if (time.diff('m', now) < 1) {
                return '1' + suffix.minute;
            }
            else if (time.diff('m', now) < 60) {
                return time.diff('m', now) + suffix.minute;
            }
            else if (time.diff('h', now) < 24) {
                return time.diff('h', now) + suffix.hour;
            }
            else if (time.diff('d', now) < 4) {
                return time.diff('d', now) + suffix.day;
            }
            else {
                return time.toString();
            }
        },
        /**
        * 时间对象
        * @class Time 时间对象
        * @constructor DateTime
        * @memberof x.date
        * @param {Date} timeValue 符合时间规则的Date对象, 数组对象, 字符串对象
        */
        newDateTime: function (timeValue) {
            var date = new Date();
            if (!x.isUndefined(timeValue)) {
                if (x.type(timeValue) === 'date') {
                    // Date 对象
                    date = timeValue;
                }
                else if (x.isNumber(timeValue)) {
                    date = new Date(timeValue);
                }
                else if (x.isArray(timeValue)) {
                    // Array 对象
                    var keys = timeValue;
                    for (var i = 0; i < 6; i++) {
                        keys[i] = isNaN(keys[i]) ? (i < 3 ? 1 : 0) : Number(keys[i]);
                    }
                    date = new Date(keys[0], Number(keys[1]) - 1, keys[2], keys[3], keys[4], keys[5]);
                }
                else if (/\/Date\((-?\d+)\)\//.test(timeValue)) {
                    // .NET 日期对象
                    date = new Date(Math.floor(timeValue.replace(/\/Date\((-?\d+)\)\//, '$1')));
                }
                else if (/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/.test(timeValue)) {
                    // ISO 8601 日期格式
                    date = new Date(timeValue);
                }
                else {
                    // 处理规则 年 月 日 时 分 秒 顺序规则时间
                    var keys = timeValue.replace(/[-|:|\/| |年|月|日]/g, ',').replace(/,,/g, ',').split(',');
                    for (var i = 0; i < 6; i++) {
                        // 处理默认值
                        keys[i] = isNaN(keys[i]) ? (i < 3 ? 1 : 0) : Number(keys[i]);
                    }
                    date = new Date(keys[0], Number(keys[1]) - 1, keys[2], keys[3], keys[4], keys[5]);
                }
            }
            var time = {
                year: date.getFullYear(),
                // year2: date.getYear(),
                month: date.getMonth(),
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds(),
                msecond: date.getMilliseconds(),
                weekDay: date.getDay(),
                /**
                * 比较与另一个时间对象的时间差
                * @method diff
                * @memberof x.date.DateTime#
                * @param {String} interval 时间间隔
                * @param {Time} time 时间对象
                */
                diff: function (interval, time) {
                    var timeBegin = Number(this.toNativeDate());
                    var timeEnd = Number(time.toNativeDate());
                    interval = self.formatInterval(interval);
                    switch (interval) {
                        case 'year': return time.year - this.year;
                        case 'quarter': return Math.ceil((((time.year - this.year) * 12) + (time.month - this.month)) / 3);
                        case 'month': return ((time.year - this.year) * 12) + (time.month - this.month);
                        case 'week': return Math.floor((timeEnd - timeBegin) / (86400000 * 7));
                        case 'day': return Math.floor((timeEnd - timeBegin) / 86400000);
                        case 'hour': return Math.floor((timeEnd - timeBegin) / 3600000);
                        case 'minute': return Math.floor((timeEnd - timeBegin) / 60000);
                        case 'second': return Math.floor((timeEnd - timeBegin) / 1000);
                        case 'msecond': return Math.floor((timeEnd - timeBegin));
                    }
                },
                /**
                * 时间对象的属性相加
                * @method add
                * @memberof x.date.DateTime#
                * @param {String} interval 时间间隔
                * @param {Number} number 数字
                */
                add: function (interval, number) {
                    var date = Number(this.toNativeDate());
                    // 此毫秒表示的是需要创建的时间 和 GMT时间1970年1月1日 之间相差的毫秒数。
                    var ms = 0;
                    var monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    interval = self.formatInterval(interval);
                    // 格式化数字类型
                    number = Number(number);
                    switch (interval) {
                        case 'year':
                            if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
                                && !((this.year + number) % 4 == 0 && (((this.year + number) % 100 != 0) || ((this.year + number) % 400 == 0)))) {
                                // 闰年的二月二十九日并且目标年不为闰年
                                ms = Number(new Date(this.year + number, this.month, 28, this.hour, this.minute, this.second));
                            }
                            else {
                                ms = Number(new Date(this.year + number, this.month, this.day, this.hour, this.minute, this.second));
                            }
                            break;
                        case 'quarter':
                            if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
                                && !((this.year + Math.floor((this.month + number * 3) / 12)) % 4 == 0 && (((this.year + Math.floor((this.month + number * 3) / 12)) % 100 != 0) || ((this.year + Math.floor((this.month + number * 3) / 12)) % 400 == 0)))) {
                                // 闰年的二月二十九日并且目标年不为闰年
                                ms = Number(new Date(this.year, (this.month + number * 3), 28, this.hour, this.minute, this.second));
                            }
                            else {
                                if (this.day == monthMaxDays[this.month]) {
                                    // 月份最后一天的处理
                                    ms = Number(new Date(this.year, (this.month + number * 3), monthMaxDays[(this.month + number * 3) % 12], this.hour, this.minute, this.second));
                                }
                                else {
                                    ms = Number(new Date(this.year, (this.month + number * 3), this.day, this.hour, this.minute, this.second));
                                }
                            }
                            break;
                        case 'month':
                            if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
                                && !((this.year + Math.floor((this.month + number) / 12)) % 4 == 0 && (((this.year + Math.floor((this.month + number) / 12)) % 100 != 0) || ((this.year + Math.floor((this.month + number) / 12)) % 400 == 0)))) {
                                // 闰年的二月二十九日并且目标年不为闰年
                                ms = Number(new Date(this.year, (this.month + number), 28, this.hour, this.minute, this.second));
                            }
                            else {
                                if (this.day == monthMaxDays[this.month]) {
                                    // 月份最后一天的处理
                                    ms = Number(new Date(this.year, (this.month + number), monthMaxDays[(this.month + number) % 12], this.hour, this.minute, this.second));
                                }
                                else {
                                    //ms = Number(this.toNativeDate().setMonth(this.month + number));
                                    ms = Number(new Date(this.year, (this.month + number), this.day, this.hour, this.minute, this.second));
                                }
                            }
                            break;
                        case 'week':
                            ms = date + ((86400000 * 7) * number);
                            break;
                        case 'day':
                            ms = date + (86400000 * number);
                            break;
                        case 'hour':
                            ms = date + (3600000 * number);
                            break;
                        case 'minute':
                            ms = date + (60000 * number);
                            break;
                        case 'second':
                            ms = date + (1000 * number);
                            break;
                        case 'msecond':
                            ms = date + number;
                            break;
                    }
                    return self.create(new Date(ms));
                },
                /*
                * 取得日期数据信息
                * 参数 interval 表示数据类型
                * y 年 M月 d日 w星期 ww周 h时 n分 s秒
                */
                getDatePart: function (interval) {
                    // var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                    interval = self.formatInterval(interval);
                    switch (interval) {
                        case 'year':
                            return this.year;
                        case 'quarter':
                            return this.getQuarterOfYear();
                        case 'month':
                            return this.month;
                        case 'day':
                            return this.day;
                        case 'week':
                            return weekDays[this.weekDay];
                        case 'W':
                        case 'weekOfYear':
                            return this.getWeekOfYear();
                        case 'hour':
                            return this.hour;
                        case 'minute':
                            return this.minute;
                        case 'second':
                            return this.second;
                        default:
                            return 'Unkown Interval';
                    }
                },
                /**
                * 取得当前日期所在月的最大天数
                * @method getMaxDayOfMonth
                * @memberof x.date.DateTime#
                */
                getMaxDayOfMonth: function () {
                    var date1 = self.create(this.toString('yyyy-MM-01'));
                    var date2 = self.create(this.add('month', 1).toString('yyyy-MM-01'));
                    return date1.diff('day', date2);
                },
                /**
                * 取得当前日期所在季度是一年中的第几季度
                * @method getQuarterOfYear
                * @memberof x.date.DateTime#
                */
                getQuarterOfYear: function () {
                    return Math.ceil(this.month / 3);
                },
                /*
                * 取得当前日期是一年中的第几周
                */
                getWeekOfYear: function () {
                    var week = 0;
                    var day = this.getDayOfYear();
                    // 判断是否为星期日
                    // 如果一年中的第一天不是星期日, 则减去相差的天数以最近的星期日开始计算
                    if (self.create(this.toString('yyyy-01-01')).weekDay > 0) {
                        day = day - (7 - self.create(this.toString('yyyy-01-01')).weekDay);
                    }
                    if (day > 0) {
                        week = Math.ceil(day / 7);
                    }
                    return week;
                },
                /*
                * 取得当前日期是一年中的第几天
                */
                getDayOfYear: function () {
                    var date1 = this.toNativeDate();
                    var date2 = new Date(date1.getFullYear(), 0, 1);
                    return Math.ceil(Number(Number(date1) - Number(date2)) / (24 * 60 * 60 * 1000)) + 1;
                },
                /**
                 * 判断闰年
                 */
                isLeapYear: function () {
                    // 闰年的计算方法：
                    // 公元纪年的年数可以被四整除，即为闰年；
                    // 被100整除而不能被400整除为平年；
                    // 被100整除也可被400整除的为闰年。
                    // 如2000年是闰年，而1900年不是。
                    return (this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0)));
                },
                /**
                 * 转换为数组格式
                 * @method toArray
                 * @memberof x.date.DateTime#
                 * @returns {Array}
                 */
                toArray: function () {
                    return [this.year, this.month, this.day, this.hour, this.minute, this.second, this.msecond];
                },
                /**
                * 转换为内置 Date 对象
                * @method toNativeDate
                * @memberof x.date.DateTime#
                * @returns {Date}
                */
                toNativeDate: function () {
                    return new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
                },
                /**
                 * 日期格式化
                 * 格式
                 * yyyy/yy 表示年份
                 * MM 月份
                 * w 星期
                 * dd/d 日期
                 * hh/h 时间
                 * mm/m 分钟
                 * ss/s 秒
                 * @method toString
                 * @memberof x.date.DateTime#
                 * @param {String} format 时间格式
                 * @returns {String}
                 */
                toString: function (format) {
                    if (format === void 0) { format = 'yyyy-MM-dd HH:mm:ss'; }
                    return format.replace(/yyyy|YYYY/g, this.year)
                        .replace(/yy|YY/g, x.paddingZero((this.year2 % 100), 2))
                        .replace(/Y/g, this.year)
                        .replace(/MM/g, x.paddingZero((this.month + 1), 2))
                        .replace(/M/g, (this.month + 1))
                        .replace(/w|W/g, weekDays[this.weekDay])
                        .replace(/dd|DD/g, x.paddingZero(this.day, 2))
                        .replace(/d|D/g, this.day)
                        .replace(/hh|HH/g, x.paddingZero(this.hour, 2))
                        .replace(/h|H/g, this.hour)
                        .replace(/mm/g, x.paddingZero(this.minute, 2))
                        .replace(/m/g, this.minute)
                        .replace(/ss|SS/g, x.paddingZero(this.second, 2))
                        .replace(/s|S/g, this.second)
                        .replace(/fff/g, x.paddingZero(this.msecond, 3));
                }
            };
            return time;
        },
        /**
        * 时间间隔对象
        * @class TimeSpan
        * @constructor TimeSpan
        * @memberof x.date
        * @param {Number} timespanValue 符合时间规则的值(允许Date对象|数组对象|字符串对象)
        */
        timespan: function (timespanValue, format) {
            if (format === void 0) { format = 'second'; }
            // 小时转化成秒
            if (format == 'day' || format == 'd') {
                timespanValue = timespanValue * 24 * 60 * 60;
            }
            // 小时转化成秒
            if (format == 'hour' || format == 'h') {
                timespanValue = timespanValue * 60 * 60;
            }
            // 分钟转化成秒
            if (format == 'minute' || format == 'm') {
                timespanValue = timespanValue * 60;
            }
            // 秒不需要转化
            if (format == 'second' || format == 's') {
                timespanValue = timespanValue * 1000;
            }
            var timespan = {
                // 时间间隔(单位:毫秒)
                timespanValue: timespanValue,
                // 天
                day: timespanValue / (24 * 60 * 60 * 1000),
                // 小时
                hour: timespanValue / (60 * 60 * 1000),
                // 分钟
                minute: timespanValue / (60 * 1000),
                // 秒
                second: timespanValue / 1000,
                // 毫秒
                millisecond: timespanValue % 1000,
                toString: function (format) {
                    var outString = '';
                    switch (format) {
                        case 'MM天dd小时mm分钟ss秒fff毫秒':
                            outString = x.paddingZero(this.day, 2) + "天" + x.paddingZero(this.hour, 2) + "小时" + x.paddingZero(this.minute, 2) + "分钟" + x.paddingZero(this.second, 2) + "秒" + x.paddingZero(this.millisecond, 3) + "毫秒";
                            break;
                        case 'MM天dd小时mm分钟ss秒':
                            outString = x.paddingZero(this.day, 2) + "天" + x.paddingZero(this.hour, 2) + "小时" + x.paddingZero(this.minute, 2) + "分钟" + x.paddingZero(this.second, 2) + "秒";
                            break;
                        default:
                            outString = x.paddingZero(this.day, 2) + "天" + x.paddingZero(this.hour, 2) + "小时" + x.paddingZero(this.minute, 2) + "分钟" + x.paddingZero(this.second, 2) + "秒";
                            break;
                    }
                    return outString;
                }
            };
            return timespan;
        }
    };
    return self;
});
// -*- ecoding=utf-8 -*-
define("src/net", ["require", "exports", "src/base", "src/event"], function (require, exports, x, event) {
    "use strict";
    /**
    * 默认配置信息
    */
    var defaults = {
        // 返回类型
        returnType: 'json',
        // 异步请求的数据键值
        xhrDataKey: 'xhr-xml',
        // 获取访问令牌信息
        getAccessToken: function () {
            // return localStorage['session-access-token'] || (x.dom('#session-access-token').size() == 0 ? null : x.dom('#session-access-token').val()) || '';
        },
        // 获取客户端标识信息
        getClientId: function () {
            // return localStorage['session-client-id'] || (x.dom('#session-client-id').size() == 0 ? null : x.dom('#session-client-id').val()) || '';
        },
        // 获取客户端签名信息
        getClientSignature: function () {
            // return localStorage['session-client-signature'] || (x.dom('#session-client-signature').size() == 0 ? null : x.dom('#session-client-signature').val()) || '';
        },
        // 获取时间信息
        getTimestamp: function () {
            // return localStorage['session-timestamp'] || (x.dom('#session-timestamp').size() == 0 ? null : x.dom('#session-timestamp').val()) || '';
        },
        // 获取随机数信息
        getNonce: function () {
            // return localStorage['session-nonce'] || (x.dom('#session-nonce').size() == 0 ? null : x.dom('#session-nonce').val()) || '';
        },
        // 获取等待窗口
        getWaitingWindow: function (options) {
            // 设置默认选项参数
            options = x.extend({
                type: 'default',
                text: i18n.net.waiting.commitTipText // 提示信息
            }, options || {});
            if (x.isUndefined(options.name)) {
                options.name = x.getFriendlyName(location.pathname + '$' + options.type + '$waiting$window');
            }
            var name = options.name;
            if (x.isUndefined(window[name])) {
                if (options.type == 'mini') {
                    window[name] = {
                        // 名称
                        name: name,
                        // 选项
                        options: options,
                        // 容器
                        container: null,
                        // 消息框
                        message: null,
                        // #region 函数:create(text)
                        create: function (text) {
                            if (document.getElementById(this.name + '-text') == null) {
                                $(document.body).append('<div id="' + this.name + '-container" class="x-ui-dialog-waiting-mini-window-container" ><div id="' + this.name + '-text" class="x-ui-dialog-waiting-mini-window-text" >' + text + '</div></div>');
                            }
                            else {
                                x.query('[id="' + this.name + '-text"]').innerHTML = text;
                            }
                            if (this.container === null) {
                                this.container = document.getElementById(this.name + '-container');
                            }
                        },
                        // #endregion
                        // #region 函数:show(text)
                        /*
                        * 显示
                        */
                        show: function () {
                            if (!x.isUndefined(arguments[0])) {
                                this.options.text = arguments[0];
                            }
                            this.create(this.options.text);
                            // 设置弹出窗口的位置
                            x.css.style(this.container, {
                                display: '',
                                position: 'fixed',
                                left: '4px',
                                bottom: '4px'
                            });
                        },
                        // #endregion
                        // #region 函数:hide()
                        /*
                        * 隐藏
                        */
                        hide: function () {
                            if (this.container != null) {
                                x.css.style(this.container, { display: 'none' });
                                // this.container.style.display = 'none';
                                // $(this.container).css({ display: '', opacity: this.maxOpacity });
                                // (this.container).fadeOut((this.maxDuration * 2000), function()
                                // {
                                //    $(this.container).css({ display: 'none' });
                                // });
                            }
                        }
                        // #endregion
                    };
                }
                else if (options.type == 'plus') {
                    // html5plus 默认等待框
                    window[name] = {
                        // 名称
                        name: name,
                        // 选项
                        options: options,
                        // 容器
                        container: null,
                        // #region 函数:create(text)
                        create: function (text) {
                            this.options.text = text;
                        },
                        // #endregion
                        // #region 函数:show(text)
                        /*
                        * 显示
                        */
                        show: function () {
                            if (!x.isUndefined(arguments[0])) {
                                this.options.text = arguments[0];
                            }
                            this.create(this.options.text);
                            this.container = plus.nativeUI.showWaiting(this.options.text);
                        },
                        // #endregion
                        // #region 函数:hide()
                        /*
                        * 隐藏
                        */
                        hide: function () {
                            if (this.container != null) {
                                this.container.close();
                            }
                        }
                        // #endregion
                    };
                }
                else {
                    window[name] = {
                        // 实例名称
                        name: name,
                        // 配置信息
                        options: options,
                        // 遮罩
                        maskWrapper: null,
                        // 容器
                        container: null,
                        // 消息框
                        message: null,
                        // 等待窗口的锁
                        lock: 0,
                        // 延迟显示等待窗口
                        // lazy: options.lazy ? options.lazy : 0,
                        maxOpacity: options.maxOpacity ? options.maxOpacity : 0.4,
                        maxDuration: options.maxDuration ? options.maxDuration : 0.2,
                        height: options.height ? options.height : 50,
                        width: options.width ? options.width : 200,
                        // #region 函数:setPosition()
                        setPosition: function () {
                            // 弹出窗口的位置
                            var range = x.page.getRange();
                            var pointX = (range.width - this.width) / 2;
                            var pointY = (range.height - this.height) / 3;
                            x.dom.fixed(this.container, pointX, pointY);
                        },
                        // #endregion
                        // #region 函数:createMaskWrapper()
                        createMaskWrapper: function () {
                            var wrapper = document.getElementById(this.name + '-maskWrapper');
                            if (wrapper === null) {
                                $(document.body).append('<div id="' + this.name + '-maskWrapper" style="display:none;" ></div>');
                                wrapper = document.getElementById(this.name + '-maskWrapper');
                            }
                            wrapper.className = 'x-ui-dialog-mask-wrapper';
                            wrapper.style.height = x.page.getRange().height + 'px';
                            wrapper.style.width = x.page.getRange().width + 'px';
                            if (wrapper.style.display === 'none') {
                                $('#' + this.name + '-maskWrapper').css({ display: '', opacity: 0.1 });
                                $('#' + this.name + '-maskWrapper').fadeTo((this.maxDuration * 1000), this.maxOpacity, function () {
                                    // var mask = window[this.id];
                                    // $(document.getElementById(mask.popupWindowName)).css({ display: '' });
                                });
                            }
                        },
                        // #endregion
                        // #region 函数:create(text)
                        create: function (text) {
                            if (document.getElementById(this.name + '-text') == null) {
                                $(document.body).append('<div id="' + this.name + '-container" class="x-ui-dialog-waiting-window-container" ><div id="' + this.name + '-text" class="x-ui-dialog-waiting-window-text" >' + text + '</div></div>');
                                this.createMaskWrapper();
                            }
                            else {
                                document.getElementById(this.name + '-text').innerHTML = text;
                            }
                            if (this.container === null) {
                                this.container = document.getElementById(this.name + '-container');
                                this.maskWrapper = document.getElementById(this.name + '-maskWrapper');
                            }
                        },
                        // #endregion
                        // #region 函数:show(text)
                        /*
                        * 显示
                        */
                        show: function (text) {
                            this.lock++;
                            var that = this;
                            //var timer = x.newTimer(this.lazy, function(timer)
                            //{
                            if (that.lock > 0) {
                                // x.debug.log('self.waitingWindow.lock:【' + that.lock + '】');
                                if (that.maskWrapper === null) {
                                    that.maskWrapper = x.ui.mask.newMaskWrapper(that.name + '-maskWrapper');
                                }
                                if (typeof (text) !== 'undefined') {
                                    that.options.text = text;
                                }
                                that.create(that.options.text);
                                // 设置弹出窗口的位置
                                var range = x.page.getRange();
                                var pointX = (range.width - that.width) / 2;
                                //var pointY = (range.height - this.height) / 3;
                                var pointY = 120;
                                x.dom.fixed(that.container, pointX, pointY);
                                // 设置弹出窗口的位置
                                that.container.style.display = '';
                                that.maskWrapper.style.display = '';
                            }
                            //timer.stop();
                            //});
                            //timer.start();
                        },
                        // #endregion
                        // #region 函数:hide()
                        /*
                        * 隐藏
                        */
                        hide: function () {
                            this.lock--;
                            // x.debug.log('self.waitingWindow.lock:【' + this.lock + '】');
                            if (this.lock === 0) {
                                if (this.container != null) {
                                    this.container.style.display = 'none';
                                }
                                if (this.maskWrapper != null && x.dom('#' + this.name + '-maskWrapper').css('display') !== 'none') {
                                    var that = this;
                                    x.dom('#' + that.name + '-maskWrapper').css({ display: 'none' });
                                    /*
                                    $(document.getElementById(this.name + '-maskWrapper')).css({ display: '', opacity: this.maxOpacity });
                                    $(document.getElementById(this.name + '-maskWrapper')).fadeOut((this.maxDuration * 2000), function()
                                    {
                                        $(document.getElementById(that.name + '-maskWrapper')).css({ display: 'none' });
                                    });*/
                                }
                            }
                        }
                        // #endregion
                    };
                }
            }
            else {
                window[name].options = options;
            }
            return window[name];
        },
        // #endregion
        /**
         * 捕获异常
         */
        catchException: function (response, outputType) {
            try {
                var result = x.toJSON(response);
                if (!x.isUndefined(result) && !x.isUndefined(result.success) && result.success == 0) {
                    if (outputType == 'console') {
                        x.debug.error(result.msg);
                    }
                    else {
                        x.msg(result.msg);
                    }
                }
            }
            catch (ex) {
                x.debug.error(ex);
            }
        }
    };
    // #endregion
    // Nonce ClientId ClientSignature Timestamp Nonce
    var keys = ["access-token", "client-id", "client-signature", "timestamp", "nonce"];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var camelName = x.camelCase(key);
        camelName = camelName[0].toUpperCase() + camelName.substr(1);
        defaults['get' + camelName] = function () {
            return localStorage['session-' + key] || (x.query('session-' + key) == null ? null : x.query('session-' + key).value) || '';
        };
    }
    /**
    * @namespace string
    * @memberof x
    * @description 字符串
    */
    var self = {
        getWaitingWindow: function (options) {
            return defaults.getWaitingWindow(options);
        },
        // #endregion
        /**
        * 发起网络请求
        * @method xhr
        * @memberof x.net
        * @param {Object} [options] 选项<br />
        * 可选值范围:
        * <table class="param-options" >
        * <thead>
        * <tr><th>名称</th><th>类型</th><th class="last" >描述</th></tr>
        * </thead>
        * <tbody>
        * <tr><td class="name" >type</td><td>string</td><td>HTTP请求类型(GET|POST)</td></tr>
        * <tr><td class="name" >url</td><td>string</td><td>地址</td></tr>
        * <tr><td class="name" >data</td><td>object</td><td>数据</td></tr>
        * <tr><td class="name" >async</td><td>boolean</td><td>是否是异步请求</td></tr>
        * </tbody>
        * </table>
        */
        xhr: function () {
            // -------------------------------------------------------
            // 可选择参数
            // waitingMessage   等待窗口显示的文本信息。
            // popCorrectValue  弹出正确回调结果。
            // popIncorrectValue  弹出错误回调结果。
            // callback         回调函数。
            // -------------------------------------------------------
            var url, xhrDataValue, options;
            if (arguments.length == 2 && x.type(arguments[1]) === 'object') {
                // 支持没有Xml数据，只有地址和回调函数的调用。
                url = arguments[0];
                options = arguments[1];
                xhrDataValue = '';
            }
            else if (arguments.length == 2 && x.type(arguments[1]) === 'string') {
                // 支持没有回调函数，只有地址和Xml数据的调用。
                url = arguments[0];
                options = {};
                xhrDataValue = arguments[1];
            }
            else if (arguments.length == 3 && x.type(arguments[1]) === 'string' && x.isFunction(arguments[2])) {
                // 支持没有回调函数，只有地址和Xml数据的调用。
                url = arguments[0];
                options = { callback: arguments[2] };
                xhrDataValue = arguments[1];
            }
            else {
                url = arguments[0];
                xhrDataValue = arguments[1];
                options = arguments[2];
            }
            options = x.extend({}, defaults, options);
            // 判断是否启用等待窗口
            var enableWaitingWindow = x.isFunction(options.getWaitingWindow)
                && !x.isUndefined(options.waitingMessage)
                && options.waitingMessage !== '';
            if (enableWaitingWindow) {
                // 开启等待窗口
                options.getWaitingWindow({ text: options.waitingMessage, type: x.isUndefined(options.waitingType, 'default') }).show();
            }
            var type = options.type || 'POST';
            var contentType = options.contentType || 'text/html';
            var async = options.async || true;
            // 设置 data 值
            var data = x.extend({}, options.data || {});
            if (x.type(xhrDataValue) === 'object') {
                // JSON 格式数据
                data = x.extend(data, xhrDataValue);
            }
            else {
                var xml = x.toXML(xhrDataValue, 1);
                if (xhrDataValue != '' && xml) {
                    data[options.xhrDataKey] = xhrDataValue;
                }
                else if (!xml && xhrDataValue.indexOf('=') > 0) {
                    // 非Xml字符格式, 普通的POST数据
                    var list = xhrDataValue.split('&');
                    x.each(list, function (index, node) {
                        var items = node.split('=');
                        if (items.length == 2) {
                            data[items[0]] = decodeURIComponent(items[1]);
                        }
                    });
                }
            }
            if (x.isFunction(options.getAccessToken) && options.getAccessToken() != '') {
                data.accessToken = options.getAccessToken();
            }
            else if (x.isFunction(options.getClientId) && options.getClientId() != '') {
                data.clientId = options.getClientId();
                if (x.isFunction(options.getClientId) && options.getClientSignature() != '') {
                    data.clientSignature = options.getClientSignature();
                    data.timestamp = options.getTimestamp();
                    data.nonce = options.getNonce();
                }
            }
            // net.ajax
            self.ajax({
                type: type,
                url: url,
                contentType: contentType,
                data: data,
                async: async,
                success: function (response) {
                    if (enableWaitingWindow) {
                        // 关闭等待窗口
                        options.getWaitingWindow({ type: x.isUndefined(options.waitingType, 'default') }).hide();
                    }
                    if (options.returnType == 'json') {
                        // 捕获处理异常
                        options.catchException(response, options.outputException);
                        var result = x.toJSON(response);
                        if (x.isUndefined(result) || x.isUndefined(result.message)) {
                            x.call(options.callback, x.toJSON(response));
                        }
                        else {
                            var message = result.message;
                            // 支持内置 message 对象的处理
                            switch (Number(message.returnCode)) {
                                case -1:
                                    // -1:异常信息
                                    x.msg(message.value);
                                    break;
                                case 0:
                                    // 0:正确操作
                                    if (!!options.popCorrectValue) {
                                        x.msg(message.value);
                                    }
                                    x.call(options.callback, x.toJSON(response));
                                    break;
                                default:
                                    // 其他错误操作
                                    if (!!options.popIncorrectValue) {
                                        x.msg(message.value);
                                    }
                                    x.call(options.callback, x.toJSON(response));
                                    break;
                            }
                        }
                    }
                    else {
                        x.call(options.callback, response);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    x.debug.log(XMLHttpRequest.responseText);
                    if (x.isFunction(options.error)) {
                        options.error(XMLHttpRequest, textStatus, errorThrown);
                    }
                    else {
                        if (XMLHttpRequest.status == 401) {
                            x.msg(i18n.net.errors['401']);
                        }
                        else if (XMLHttpRequest.status == 404) {
                            x.msg(i18n.net.errors['404']);
                        }
                        else if (XMLHttpRequest.status == 500) {
                            x.msg(i18n.net.errors['500']);
                        }
                        else if (XMLHttpRequest.status != 0) {
                            x.debug.error(i18n.net.errors['unkown'].format(XMLHttpRequest.status + (XMLHttpRequest.statusText != '' ? (' ' + XMLHttpRequest.statusText) : '')));
                        }
                    }
                }
            });
        },
        // #endregion
        // 已加载的文件标识
        requireLoaded: {},
        /**
        * 通过Ajax方式加载样式和脚本
        */
        require: function (options) {
            options = x.extend({
                fileType: 'script',
                id: '',
                path: '',
                type: 'GET',
                async: true
            }, options || {});
            if (options.id != '' && self.requireLoaded[options.id]) {
                x.debug.log(x.string.format('require file {"id":"{0}", path:"{1}"} exist. [ajax]', options.id, options.path));
                x.call(options.callback);
                return true;
            }
            x.debug.log(x.string.format('require file {"id":"{0}", path:"{1}"} loading. [ajax]', options.id, options.path));
            self.ajax({
                type: options.type,
                url: options.path,
                async: options.async,
                success: function (responseText) {
                    x.debug.log(x.string.format('require file {"id":"{0}", path:"{1}"} finished. [ajax]', options.id, options.path));
                    var node;
                    var head = document.getElementsByTagName("HEAD").item(0);
                    if (options.fileType == 'template') {
                        node = document.createElement("script");
                        node.type = "text/template";
                        node.src = options.path;
                    }
                    else if (options.fileType == 'css') {
                        node = document.createElement("style");
                        node.type = "text/css";
                        node.href = options.path;
                    }
                    else {
                        node = document.createElement("script");
                        node.language = "javascript";
                        node.type = "text/javascript";
                        node.src = options.path;
                    }
                    try {
                        // IE8以及以下不支持这种方式，需要通过text属性来设置
                        node.appendChild(document.createTextNode(responseText));
                    }
                    catch (ex) {
                        node.text = responseText;
                    }
                    if (options.id != '') {
                        node.id = options.id;
                        self.requireLoaded[options.id] = true;
                    }
                    head.appendChild(node);
                    x.call(options.callback);
                }
            });
        },
        ajax: function (options) {
            var request = self.newHttpRequest(options);
            request.send();
        },
        // #endregion
        newHttpRequest: function (options) {
            var request = {
                xhr: null,
                // 数据
                data: null,
                // 超时设置
                timeout: 90,
                // 是否已完成
                done: false,
                // 发送
                send: function () {
                    if (this.xhr == null) {
                        this.xhr = self.newXmlHttpRequest();
                        if (!this.xhr) {
                            x.debug.error('create xhr failed');
                            return false;
                        }
                    }
                    this.xhr.open(this.type, this.url, this.async);
                    var me = this;
                    event.add(this.xhr, "readystatechange", function () {
                        var xhr = me.xhr;
                        // 监听状态
                        // x.debug.log('{0} readyState:{1} status:{2} done:{3}'.format(x.debug.timestamp(), xhr.readyState, xhr.status, me.done));
                        // 保持等待，直到数据完全加载，并保证请求未超时
                        if (xhr.readyState == 4 && !me.done) {
                            // 0 为访问的本地，200 到 300 代表访问服务器成功，304 代表没做修改访问的是缓存
                            if (xhr.status == 0 || (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                                // 成功则调用回调函数，并传入xhr对象
                                x.call(me.success, xhr.responseText);
                            }
                            else {
                                // 失败则调用error回调函数
                                x.call(me.error, xhr, xhr.status);
                            }
                            // 避免内存泄漏，清理文档
                            xhr = null;
                        }
                    });
                    // 如果请求超过 timeout 设置的时间没有响应, 则取消请求（如果尚未完成的话）
                    setTimeout(function () { me.done = true; }, me.timeout * 1000);
                    if (this.type == 'POST') {
                        this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        this.xhr.send(x.serialize(this.data));
                    }
                    else {
                        // 发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错
                        this.xhr.send(null);
                    }
                },
                create: function (options) {
                    options = x.extend({
                        type: 'GET',
                        url: '',
                        data: {},
                        async: true,
                        timeout: 90
                    }, options || {});
                    this.type = options.type.toUpperCase();
                    this.url = options.url;
                    this.data = options.data;
                    this.async = options.async;
                    this.timeout = options.timeout;
                    this.success = options.success;
                    this.error = options.error;
                }
            };
            // 初始化对象
            request.create(options);
            return request;
        },
        // #region 函数:newXmlHttpRequest()
        /**
        * 创建 XMLHttpRequest 对象
        * @private
        */
        newXmlHttpRequest: function () {
            var xhr = null;
            var global = x.global();
            if (global["ActiveXObject"]) {
                try {
                    // IE6 以及以后版本中可以使用
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch (ex) {
                    //IE5.5 以及以后版本可以使用
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            else if (global["XMLHttpRequest"]) {
                // Firefox，Opera 8.0+，Safari，Chrome
                xhr = new XMLHttpRequest();
            }
            return xhr;
        },
        // #endregion
        /**
        * 请求信息
        * @namespace request
        * @memberof self
        */
        request: {
            // #region 函数:find(key)
            /**
            * 获取请求地址中某个参数的值
            * @method find
            * @memberof self.request
            * @param {String} 参数的键
            * @returns {String} 参数的值
            */
            find: function (key) {
                var resultValue = '';
                var list = location.search.substr(1).split('&');
                for (var i = 0; i < list.length; i++) {
                    if (list[i].indexOf(key) === 0) {
                        resultValue = decodeURIComponent(list[i].replace(key + '=', ''));
                        break;
                    }
                }
                return resultValue;
            },
            // #endregion
            // #region 函数:findAll()
            /**
            * 查找请求的全部信息, 返回的值是个JSON格式.
            * 获取请求地址中所有参数的值
            * @method findAll
            * @memberof self.request
            * @returns {Object} JSON格式的对象
            */
            findAll: function () {
                var outString = '';
                var list = location.search.substr(1).split('&');
                if (list.length = 0) {
                    return {};
                }
                var temp;
                outString = '{';
                for (var i = 0; i < list.length; i++) {
                    temp = list[i].split('=');
                    outString += '"' + temp[0] + '":"' + decodeURIComponent(temp[1]) + '"';
                    if (i < list.length - 1)
                        outString += ',';
                }
                outString += '}';
                return x.evalJSON(outString);
            },
            // #endregion
            // #region 函数:getRawUrl()
            /**
            * 获取附加了查询字符串的 URL 路径
            */
            getRawUrl: function () {
                return location.href.replace(location.origin, '');
            },
            // #endregion
            // #region 函数:hash(key)
            /*
            * 判断锚点
            */
            hash: function (key) {
                return location.hash === ('#' + key) ? true : false;
            }
            // #endregion
        }
    };
    // #region 私有函数:request_callback(response)
    /**
    * 网络请求的默认回调函数
    * @private
    */
    var request_callback = function (response) {
        var result = x.toJSON(response).message;
        switch (Number(result.returnCode)) {
            case 0:
                // 0:正确操作
                // alert(result.value);
                break;
            case -1:
            case 1:
                // -1:异常信息 | 1:错误信息
                x.msg(result.value);
                break;
            default:
                // 其他信息
                x.msg(result.value);
                break;
        }
    };
    return self;
});
define("x", ["require", "exports", "src/base", "src/event", "src/collections/Queue", "src/collections/Stack", "src/color", "src/cookies", "src/encoding", "src/regexp", "src/string", "src/date", "src/net"], function (require, exports, base, event, Queue, Stack, color, cookies, encoding, regexp, string, date, net) {
    "use strict";
    var x = base.extend({}, base, {
        // 事件
        event: event,
        // 字典
        // Hashtable: Hashtable,
        // 队列
        queue: Queue,
        // 栈
        stack: Stack,
        // 颜色
        color: color,
        // 颜色
        cookies: cookies,
        // 编码
        encoding: encoding,
        // 正则表达式
        regexp: regexp,
        // 字符串
        string: string,
        // 时间
        date: date,
        // 添加事件方法的别名
        on: event.add,
        // 网络
        net: net
    });
    // 设置快捷方法
    base.extend(x, {
        /*
         * @method on
         * @memberof x
         */
        on: event.add,
        off: event.remove,
        /*
         * @method xhr
         * @memberof x
         */
        xhr: net.xhr
    });
    return x;
});
