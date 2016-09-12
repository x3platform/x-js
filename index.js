// -*- ecoding=utf-8 -*-
// Name     : x-lib 
// Version  : 0.0.1 
// Author   : 
// Date     : 2016-09-12

'use strict'

module.exports = (function()
{
    
    /**
    * @namespace x
    * @description 默认根命名空间
    */
    var x = {
    
        // 默认设置
        defaults: {
            // 默认消息提示方式
            msg: function(text) { if(alert) { alert(text); } else { console.log(text); } }
        },
    
        // 缓存
        cache: {},
    
        msg: function(text) { x.defaults.msg(text); },
    
        /**
        * 检查对象类型
        * @method type
        * @memberof x
        */
        type: function(object)
        {
            try
            {
                if(typeof (object) === 'undefined') { return 'undefined'; }
                if(object === null) { return 'null'; }
    
                return /\[object ([A-Za-z]+)\]/.exec(Object.prototype.toString.call(object))[1].toLowerCase();
            }
            catch(ex)
            {
                if(ex instanceof RangeError) { return '...'; }
    
                throw ex;
            }
        },
    
        /**
        * 判断对象是否是 Array 类型
        * @method isArray
        * @memberof x
        */
        isArray: function(object)
        {
            return x.type(object) === 'array';
        },
    
        /**
        * 判断对象是否是 Function 类型
        * @method isFunction
        * @memberof x
        */
        isFunction: function(object)
        {
            return x.type(object) === 'function';
        },
    
        /**
        * 判断对象是否是 String 类型
        * @method isString
        * @memberof x
        */
        isString: function(object)
        {
            return x.type(object) === 'string';
        },
    
        /**
        * 判断对象是否是 Number 类型
        * @method inspect
        * @memberof Object
        */
        isNumber: function(object)
        {
            return x.type(object) === 'number';
        },
    
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
        isUndefined: function(object, replacementValue)
        {
            if(arguments.length == 2)
            {
                // 如果设置了 replacementValue 值, 则当对象是 undefined 值时, 返回替换值信息
                return (x.type(object) === 'undefined') ? replacementValue : object;
            }
            else
            {
                return x.type(object) === 'undefined';
            }
        },
    
        // 脚本代码片段
        scriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
    
        // 脚本代码片段
        jsonFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    
        // 一种简单的方法来检查HTML字符串或ID字符串
        quickExpr: /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
    
        // Is it a simple selector
        isSimple: /^.[^:#\[\.,]*$/,
    
        /**
        * 空操作
        */
        noop: function() { },
    
        /**
        * 注册对象信息
        * @method register
        * @memberof x3platform
        */
        register: function(value)
        {
            var parts = value.split(".");
    
            var root = window;
    
            for(var i = 0;i < parts.length;i++)
            {
                if(x.isUndefined(root[parts[i]]))
                {
                    root[parts[i]] = {};
                }
    
                root = root[parts[i]];
            }
    
            return root;
        },
    
        /**
        * 将原始对象的属性和方法扩展至目标对象
        * @method ext
        * @memberof x
        * @param destination 目标对象
        * @param source 原始对象
        */
        ext: function(destination, source)
        {
            /*
            for (var property in source)
            {
            destination[property] = source[property];
            }
    
            return destination;
            */
    
            var result = arguments[0] || {};
    
            if(arguments.length > 1)
            {
                for(var i = 1;i < arguments.length;i++)
                {
                    for(var property in arguments[i])
                    {
                        result[property] = arguments[i][property];
                    }
                }
            }
    
            return result;
        },
    
        /**
        * 克隆对象
        * @method clone
        * @memberof x
        * @returns {object} 克隆的对象
        */
        clone: function(object)
        {
            return x.ext({}, object);
        },
    
        /**
        * 执行对象方法
        * @method invoke
        * @memberof x
        */
        invoke: function(object, fn)
        {
            // 注:数组的 slice(start, end) 方法可从已有的数组中返回选定的元素。
            var args = Array.prototype.slice.call(arguments).slice(2);
    
            return fn.apply(object, args);
        },
    
        /*
        * 调用方法或者代码文本
        * @method call
        * @memberof x
        */
        call: function(anything)
        {
            if(!x.isUndefined(anything))
            {
                try
                {
                    if(x.isFunction(anything))
                    {
                        var args = Array.prototype.slice.call(arguments).slice(1);
    
                        return anything.apply(this, args);
                    }
                    else if(x.type(anything) === 'string')
                    {
                        if(anything !== '') { return eval(anything); }
                    }
                }
                catch(ex)
                {
                    x.debug.error(ex);
                }
            }
        },
    
        /**
        * 精确查询单个表单元素。
        * @method query
        * @memberof x
        * @param {string} selector 选择表达式
        */
        query: function(selector)
        {
            if(x.type(selector).indexOf('html') == 0)
            {
                // Html 元素类型 直接返回
                return selector;
            }
            else if(x.type(selector) == 'string')
            {
                var results = Sizzle.apply(window, Array.prototype.slice.call(arguments, 0));
    
                return (results.length == 0) ? null : results[0];
            }
        },
    
        /**
        * 精确查询单个表单元素。
        * @method query
        * @memberof x
        * @param {string} selector 选择表达式
        */
        queryAll: function(selector)
        {
            if(x.type(selector).indexOf('html') == 0)
            {
                // Html 元素类型 直接返回
                var results = [];
                results.push(selector);
    
                return results;
            }
            else if(x.type(selector) == 'string')
            {
                return Sizzle.apply(window, Array.prototype.slice.call(arguments, 0));
            }
        },
    
        /**
        * 返回数据串行化后的字符串
        * @method serialize
        * @memberof x
        * @param {object} data 表单输入元素的数组或键/值对的散列表
        */
        serialize: function(data)
        {
            var buffer = [], length = data.length;
    
            if(x.isArray(data))
            {
                // 数组对象
                for(var i = 0;i < length;i++)
                {
                    buffer.push(data[i].name + '=' + encodeURIComponent(data[i].value));
                }
            }
            else
            {
                for(var name in data)
                {
                    buffer.push(name + '=' + encodeURIComponent(data[name]));
                }
            }
    
            return buffer.join('&');
        },
    
        /**
        * 遍历元素对象, 如果需要退出返回 false
        * @method query
        * @memberof x
        * @param {Object} data 对象
        * @param {Function} callback 回调函数
        */
        each: function(data, callback)
        {
            var name, i = 0, length = data.length;
    
            if(x.isArray(data))
            {
                // 数组对象
                for(var value = data[0];i < length && callback.call(value, i, value) != false;value = data[++i]) { }
            }
            else
            {
                // 键/值对的散列表
                for(name in data)
                {
                    if(callback.call(data[name], name, data[name]) === false) { break; }
                }
            }
    
            return data;
        },
    
        /**
        * 将字符串转换为XML对象
        * @method toXML
        * @memberof x
        * @param {string} text XML对象的文本格式
        */
        toXML: function(text)
        {
            if(x.type(text) === 'xmldocument') { return text; }
    
            // 类型为 undefined 时或者字符串内容为空时, 返回 undefined 值.
            if(x.isUndefined(text) || text === '') { return undefined; }
    
            var hideError = !!arguments[1];
    
            var doc;
    
            // Firefox, Mozilla, Opera, etc.
            try
            {
                if(window.DOMParser)
                {
                    var parser = new DOMParser();
                    doc = parser.parseFromString(text, "text/xml");
                }
                else if(window.ActiveXObject)
                {
                    doc = new ActiveXObject("Microsoft.XMLDOM");
                    doc.async = "false";
                    doc.loadXML(text);
                }
            }
            catch(ex)
            {
                doc = undefined;
    
                if(!hideError) x.debug.error('{"method":"x.toXML(text)", "arguments":{"text":"' + text + '"}');
            }
    
            if(!doc || doc.getElementsByTagName("parsererror").length)
            {
                doc = undefined;
                if(!hideError) x.debug.error('{"method":"x.toXML(text)", "arguments":{"text":"' + text + '"}');
            }
    
            return doc;
        },
    
        /**
        * 将字符串转换为JSON对象
        * @method toJSON
        * @memberof x
        * @param {string} text JSON对象的文本格式
        */
        toJSON: function(text)
        {
            if(x.type(text) === 'object') { return text; }
    
            // 类型为 undefined 时或者字符串内容为空时, 返回 undefined 值.
            if(x.isUndefined(text) || text === '') { return undefined; }
    
            var hideError = arguments[1];
    
            try
            {
                // eval('(' + text + ')')
                return (JSON) ? JSON.parse(text) : (Function("return " + text))();
            }
            catch(ex)
            {
                try
                {
                    return (Function("return " + text))();
                }
                catch(ex1)
                {
                    if(!hideError) x.debug.error('{"method":"x.toJSON(text)", "arguments":{"text":"' + text + '"}');
                    return undefined;
                }
            }
        },
    
        /**
        * 将普通文本信息转换为安全的符合JSON格式规范的文本信息
        * @method toSafeJSON
        * @memberof x
        * @param {string} text 文本信息
        */
        toSafeJSON: function(text)
        {
            var outString = '';
    
            for(var i = 0;i < text.length;i++)
            {
                var ch = text.substr(i, 1);
    
                if(ch === '"' || ch === '\'' || ch === '\\')
                {
                    outString += '\\';
                    outString += ch;
                }
                else if(ch === '\b')
                {
                    outString += '\\b';
                }
                else if(ch === '\f')
                {
                    outString += '\\f';
                }
                else if(ch === '\n')
                {
                    outString += '\\n';
                }
                else if(ch === '\t')
                {
                    outString += '\\t';
                }
                else if(ch === '\r')
                {
                    outString += '\\r';
                }
                else
                {
                    outString += ch;
                }
            }
    
            return outString;
        },
    
        /**
        * 将字符串中特殊字符([%_)转换为可识别的Like内容.
        * @method toSafeLike
        * @memberof x
        * @param {string} text 文本信息
        */
        toSafeLike: function(text)
        {
            return text.replace(/\[/g, '[[]').replace(/%/g, '[%]').replace(/_/g, '[_]');
        },
    
        /**
        * 将普通文本信息转为为Xml不解析的文本信息
        * @method cdata
        * @memberof x
        * @param {string} text 文本信息
        */
        cdata: function(text)
        {
            return '<![CDATA[' + text + ']]>';
        },
    
        /**
        * 将短划线文字转换至驼峰格式
        * @method camelCase
        * @memberof x
        * @param {string} text 文本信息
        */
        camelCase: function(text)
        {
            // jQuery: Microsoft forgot to hump their vendor prefix (#9572)
    
            // 匹配短划线文字转换至驼峰格式
            // Matches dashed string for camelizing
            var rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi;
    
            // camelCase 替换字符串时的回调函数
            return text.replace(rmsPrefix, "ms-").replace(rdashAlpha, function(all, letter)
            {
                return letter.toUpperCase();
            });
        },
    
        /**
        * 数字补零
        * @method paddingZero
        * @memberof x
        * @param {number} number 数字
        * @param {number} length 需要补零的位数
        */
        paddingZero: function(number, length)
        {
            return (Array(length).join('0') + number).slice(-length);
        },
    
        /**
        * 将字符串统一转换为本地标识标识
        * @method formatNature
        * @memberof x
        * @param {string} text 文本信息
        */
        formatNature: function(text)
        {
            switch(text.toLowerCase())
            {
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
    
        /**
        * 将不规范的标识名称转换为友好的名称.
        * @method getFriendlyName
        * @memberof x
        * @param {string} name 名称
        * @example
        * // 将路径中的[$./\:?=]符号替换为[-]符号
        * console.log(x.getFriendlyName(location.pathname));
        */
        getFriendlyName: function(name)
        {
            return x.camelCase(('x-' + name).replace(/[\#\$\.\/\\\:\?\=]/g, '-').replace(/[-]+/g, '-'));
        },
    
        /**
        * 哈希表
        * @class HashTable 哈希表
        * @constructor newHashTable
        * @memberof x
        * @example
        * // returns HashTable
        * var hashtable = x.newHashTable();
        */
        newHashTable: function()
        {
            var hashTable = {
    
                // 内部数组对象
                innerArray: [],
    
                /**
                * 清空哈希表
                * @method clear
                * @memberof x.newHashTable#
                */
                clear: function()
                {
                    this.innerArray = [];
                },
    
                /**
                * 判断是否已存在相同键的对象
                * @method exist
                * @memberof x.newHashTable#
                * @returns {bool}
                */
                exist: function(key)
                {
                    for(var i = 0;i < this.innerArray.length;i++)
                    {
                        if(this.innerArray[i].name === key)
                        {
                            return true;
                        }
                    }
    
                    return false;
                },
    
                /**
                * @method get
                * @memberof x.newHashTable#
                */
                get: function(index)
                {
                    return this.innerArray[index];
                },
    
                /**
                * @method add
                * @memberof x.newHashTable#
                */
                add: function(key, value)
                {
                    if(arguments.length === 1)
                    {
                        var keyArr = key.split(';');
    
                        for(var i = 0;i < keyArr.length;i++)
                        {
                            var valueArr = keyArr[i].split('#');
    
                            this.innerArray.push(x.types.newListItem(valueArr[0], valueArr[1]));
    
                        }
                    }
                    else
                    {
                        if(this.exist(key))
                        {
                            throw 'hashtable aleardy exist same key[' + key + ']';
                        }
                        else
                        {
                            this.innerArray.push(x.types.newListItem(key, value));
                        }
                    }
                },
    
                /**
                * @method find
                * @memberof x.newHashTable#
                */
                find: function(key)
                {
                    for(var i = 0;i < this.innerArray.length;i++)
                    {
                        if(this.innerArray[i].name === key)
                        {
                            return this.innerArray[i].value;
                        }
                    }
    
                    return null;
                },
    
                /**
                * 获取哈希表的当前大小
                * @method size
                * @memberof x.newHashTable#
                */
                size: function()
                {
                    return this.innerArray.length;
                }
            };
    
            return hashTable;
        },
    
        /**
        * 队列
        * @description Queue 对象
        * @class Queue 队列
        * @constructor newQueue
        * @memberof x
        */
        newQueue: function()
        {
            var queue = {
    
                // 内部数组对象
                innerArray: [],
    
                /**
                * 插入队列顶部元素
                * @method push
                * @memberof x.newQueue#
                */
                push: function(targetObject)
                {
                    this.innerArray.push(targetObject);
                },
    
                /**
                * 弹出队列顶部元素
                * @method pop
                * @memberof x.newQueue#
                */
                pop: function()
                {
                    if(this.innerArray.length === 0)
                    {
                        return null;
                    }
                    else
                    {
                        var targetObject = this.innerArray[0];
    
                        // 将队列元素往前移动一个单位
                        for(var i = 0;i < this.innerArray.length - 1;i++)
                        {
                            this.innerArray[i] = this.innerArray[i + 1];
                        }
    
                        this.innerArray.length = this.innerArray.length - 1;
    
                        return targetObject;
                    }
                },
    
                /**
                * 取出队列底部元素(并不删除队列底部元素)
                */
                peek: function()
                {
                    if(this.innerArray.length === 0)
                    {
                        return null;
                    }
    
                    return this.innerArray[0];
                },
    
                /**
                * 清空堆栈
                <<<<<<< HEAD
                * @method clear
                =======
                * @method isEmpty
                >>>>>>> 86d619ad16f6d4840df8ba2f3eaae9c8014fd094
                * @memberof x.newQueue#
                */
                clear: function()
                {
                    this.innerArray.length = 0; //将元素的个数清零即可
                },
    
                /**
                * 获得线性队列当前大小
                * @method size
                * @memberof x.newQueue#
                */
                size: function()
                {
                    return this.innerArray.length;
                },
    
                /*
                * 判断一个线性队列是否为空
                * @method isEmpty
                * @memberof x.newQueue#
                */
                isEmpty: function()
                {
                    return (this.innerArray.length === 0) ? true : false;
                }
            };
    
            return queue;
        },
    
        /**
        * 栈
        * @description 创建 Stack 对象
        * @class Stack
        * @constructor newStack
        * @memberof x
        */
        newStack: function()
        {
            var stack = {
    
                // 内部数组对象
                innerArray: [],
    
                /*
                * 插入栈顶元素
                */
                push: function(targetObject)
                {
                    this.innerArray[this.innerArray.length] = targetObject;
                },
    
                /*
                * 弹出栈顶元素(并删除栈顶元素)
                */
                pop: function()
                {
                    if(this.innerArray.length === 0)
                    {
                        return null;
                    }
                    else
                    {
                        var targetObject = this.innerArray[this.innerArray.length - 1];
    
                        this.innerArray.length--;
    
                        return targetObject;
                    }
                },
    
                /*
                * 取出栈顶元素(并不删除栈顶元素)
                */
                peek: function()
                {
                    if(this.innerArray.length === 0)
                    {
                        return null;
                    }
    
                    return this.innerArray[this.innerArray.length - 1];
                },
    
                /*
                * 清空堆栈
                */
                clear: function()
                {
                    this.innerArray.length = 0; //将元素的个数清零即可
                },
    
                /**
                * 获得线性堆栈的当前大小
                * @method size
                * @memberof x.newStack#
                */
                size: function()
                {
                    return this.innerArray.length;
                },
    
                /*
                * 判断一个线性堆栈是否为空
                */
                isEmpty: function()
                {
                    return (this.innerArray.length === 0) ? true : false;
                }
            };
    
            return stack;
        },
    
        /**
        * 高效字符串构建器<br />
        * 注: 现在的主流浏览器都针对字符串连接作了优化，所以性能要好于StringBuilder类，不推荐使用，仅作字符串算法研究。
        * @class StringBuilder
        * @constructor newStringBuilder
        * @memberof x
        */
        newStringBuilder: function()
        {
            var stringBuilder = {
    
                // 内部数组对象
                innerArray: [],
    
                /**
                * 附加文本信息
                * @method append
                * @memberof x.newStringBuilder#
                * @param {string} text 文本信息
                */
                append: function(text)
                {
                    this.innerArray[this.innerArray.length] = text;
                },
    
                /**
                * 转换为字符串
                * @method toString
                * @memberof x.newStringBuilder#
                * @returns {string}
                */
                toString: function()
                {
                    return this.innerArray.join('');
                }
            };
    
            return stringBuilder;
        },
    
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
        newTimer: function(interval, callback)
        {
            var timer = {
    
                // 定时器的名称
                name: 'timer$' + Math.ceil(Math.random() * 900000000 + 100000000),
                // 定时器的间隔
                interval: interval * 1000,
                // 回调函数
                callback: callback,
    
                /**
                * 执行回调函数
                * @private
                * @method run
                * @memberof x.newTimer#
                */
                run: function()
                {
                    this.callback(this);
                },
    
    
                /**
                * 启动计时器
                * @method start
                * @memberof x.newTimer#
                */
                start: function()
                {
                    eval(this.name + ' = this;');
    
                    this.timerId = setInterval(this.name + '.run()', this.interval);
                },
    
                /**
                * 停止计时器
                * @method stop
                * @memberof x.newTimer#
                */
                stop: function()
                {
                    clearInterval(this.timerId);
                }
            };
    
            return timer;
        },
    
        /**
        * 事件
        * @namespace event
        * @memberof x
        */
        event: {
            /**
            * 获取事件对象
            * @method getEvent
            * @memberof x.event
            * @param {event} event 事件对象
            */
            getEvent: function(event)
            {
                return window.event ? window.event : event;
            },
    
            /**
            * 获取事件的目标对象
            * @method getTarget
            * @memberof x.event
            * @param {event} event 事件对象
            */
            getTarget: function(event)
            {
                return window.event ? window.event.srcElement : (event ? event.target : null);
            },
    
            /**
            * 获取事件的光标坐标
            * @method getPosition
            * @memberof x.event
            * @param {event} event 事件对象
            */
            getPosition: function(event)
            {
                var docElement = document.documentElement;
    
                var body = document.body || { scrollLeft: 0, scrollTop: 0 };
    
                return {
                    x: event.pageX || (event.clientX + (docElement.scrollLeft || body.scrollLeft) - (docElement.clientLeft || 0)),
                    y: event.pageY || (event.clientY + (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0))
                };
            },
    
            /**
            * 取消事件的默认动作
            * @method preventDefault
            * @memberof x.event
            * @param {event} event 事件对象
            */
            preventDefault: function(event)
            {
                // 如果提供了事件对象，则这是一个非IE浏览器
                if(event && event.preventDefault)
                {
                    //阻止默认浏览器动作(W3C)
                    event.preventDefault();
                }
                else
                {
                    //IE中阻止函数器默认动作的方式
                    window.event.returnValue = false;
                }
            },
    
            /**
            * 停止事件传播
            * @method stopPropagation
            * @memberof x.event
            * @param {event} event 事件对象
            */
            stopPropagation: function(event)
            {
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
                if(event && event.stopPropagation)
                {
                    //因此它支持W3C的stopPropagation()方法
                    event.stopPropagation();
                }
                else
                {
                    //否则，我们需要使用IE的方式来取消事件冒泡
                    window.event.cancelBubble = true;
                }
    
                return false;
            },
    
            /**
            * 添加事件监听器
            * @method add
            * @memberof x.event
            * @param {string} target 监听对象
            * @param {string} type 监听事件
            * @param {string} listener 处理函数
            * @param {string} [useCapture] 监听顺序方式
            */
            add: function(target, type, listener, useCapture)
            {
                if(target == null) return;
    
                if(target.addEventListener)
                {
                    target.addEventListener(type, listener, useCapture);
                }
                else if(target.attachEvent)
                {
                    target.attachEvent('on' + type, listener);
                }
                else
                {
                    target['on' + type] = listener;
                }
            },
    
            /**
            * 移除事件监听器
            * @method remove
            * @memberof x.event
            * @param {string} target 监听对象
            * @param {string} type 监听事件
            * @param {string} listener 处理函数
            * @param {string} [useCapture] 监听顺序方式
            */
            remove: function(target, type, listener, useCapture)
            {
                if(target == null) return;
    
                if(target.removeEventListener)
                {
                    target.removeEventListener(type, listener, useCapture);
                }
                else if(target.detachEvent)
                {
                    target.detachEvent('on' + type, listener);
                }
                else
                {
                    target['on' + type] = null;
                }
            }
        },
    
        /**
        * Guid 格式文本
        * @namespace guid
        * @memberof x
        */
        guid: {
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
            create: function(format, isUpperCase)
            {
                var text = '';
    
                // 格式限制
                format = x.isUndefined(format, '-').toLowerCase();
    
                for(var i = 0;i < 8;i++)
                {
                    text += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    
                    if(i > 0 && i < 5)
                    {
                        if(format === '-')
                        {
                            text += '-';
                        }
                    }
                }
    
                text = isUpperCase ? text.toUpperCase() : text.toLowerCase();
    
                return text;
            }
        },
    
        /**
        * 随机文本
        * @namespace randomText
        * @memberof x
        */
        randomText: {
            /**
            * 创建随机文本信息
            * @method create
            * @memberof x.randomText
            * @param {number} length 返回的文本长度
            * @example
            * // 输出格式 00000000
            * console.log(x.randomText.create(8));
            */
            create: function(length, buffer)
            {
                var result = '';
    
                var buffer = x.type(buffer) == 'string' ? buffer : "0123456789abcdefghijklmnopqrstuvwyzx";
    
                for(var i = 0;i < length;i++)
                {
                    result += buffer.charAt(Math.ceil(Math.random() * 100000000) % buffer.length);
                }
    
                return result;
            }
        },
    
        /**
        * 创建随机数
        * @method nonce
        * @memberof x
        * @param {length} 随机数长度
        */
        nonce: function(length)
        {
            length = x.isUndefined(length, 6);
    
            return Number(x.randomText.create(1, '123456789') + x.randomText.create(length - 1, '0123456789'));
        },
    
        /**
        * 字符串
        * @namespace string
        * @memberof x
        */
        string: {
    
            /**
            * 将其他类型的值转换成字符串
            * @method stringify
            * @memberof x.string
            * @param {anything} value 值
            */
            stringify: function(value)
            {
                var type = x.type(value);
    
                if(type !== 'string')
                {
                    if(type === 'number')
                    {
                        value += '';
                    }
                    else if(type === 'function')
                    {
                        value = x.string.stringify(value.call(value));
                    }
                    else
                    {
                        value = '';
                    }
                }
    
                return value;
            },
    
            /**
            * 去除字符串两端空白或其他文本信息
            * @method trim
            * @memberof x.string
            * @param {string} text 文本信息.
            * @param {number} [trimText] 需要去除的文本信息(默认为空白).
            */
            trim: function(text, trimText)
            {
                if(x.isUndefined(trimText))
                {
                    return text.replace(x.expressions.rules['trim'], '');
                }
                else
                {
                    return x.string.rtrim(x.string.ltrim(text, trimText), trimText);
                }
            },
    
            /**
            * 去除字符串左侧空白
            * @method ltrim
            * @memberof x.string
            * @param {string} text 文本信息.
            * @param {number} [trimText] 需要去除的文本信息(默认为空白).
            */
            ltrim: function(text, trimText)
            {
                if(x.isUndefined(trimText))
                {
                    return text.replace(/(^[\s\uFEFF\xA0]+)/g, '');
                }
                else
                {
                    return text.replace(RegExp('(^' + trimText.replace(/\\/g, '\\\\') + ')', 'gi'), '');
                }
            },
    
            /**
            * 去除字符串右侧空白
            * @method rtrim
            * @memberof x.string
            * @param {string} text 文本信息.
            * @param {number} [trimText] 需要去除的文本信息(默认为空白).
            */
            rtrim: function(text, trimText)
            {
                if(x.isUndefined(trimText))
                {
                    return text.replace(/([\s\uFEFF\xA0]+$)/g, '');
                }
                else
                {
                    return text.replace(RegExp('(' + trimText.replace(/\\/g, '\\\\') + '$)', 'gi'), '');
                    // return (text.substr(text.length - trimText.length, trimText.length) === trimText) ? text.substr(0, text.length - trimText.length) : text;
                }
            },
    
            /**
            * 字符串格式化
            * @method format
            * @memberof x.string
            * @param {string} text 文本信息.
            * @param {number} [args] 参数.
            */
            format: function()
            {
                if(arguments.length == 0) { return null; }
    
                var text = arguments[0];
    
                for(var i = 1;i < arguments.length;i++)
                {
                    var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
                    text = text.replace(re, arguments[i]);
                }
    
                return text;
            },
    
            /**
            * 字符串长度超长时, 截取左侧字符
            * @method left
            * @memberof x.string
            * @param {string} text 需要处理的字符串
            * @param {number} length 长度范围
            * @param {bool} [hasEllipsis] 是否显示...
            * @example
            * // 返回 'java...'
            * x.string.left('javascript', 4);
            * @example
            * // 返回 'java'
            * x.string.left('javascript', 4, false);
            */
            left: function(text, length, hasEllipsis)
            {
                if(text.length === 0) { return text; }
    
                if(text.length > length)
                {
                    return text.substr(0, length) + (x.isUndefined(hasEllipsis, true) ? '...' : '');
                }
                else
                {
                    return text;
                }
            }
        },
    
        /**
        * 颜色编码
        * @namespace color
        * @memberof x
        */
        color: {
    
            // 正则规则
            // reg: /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
    
            /**
            * RGB 颜色转为十六进制格式
            */
            hex: function(colorRgbCode)
            {
                if(/^(rgb|RGB)/.test(colorRgbCode))
                {
                    var colorBuffer = colorRgbCode.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                    var strHex = "#";
                    for(var i = 0;i < colorBuffer.length;i++)
                    {
                        var hex = Number(colorBuffer[i]).toString(16);
    
                        if(hex === "0")
                        {
                            hex += hex;
                        }
    
                        strHex += hex;
                    }
    
                    if(strHex.length !== 7)
                    {
                        strHex = colorRgbCode;
                    }
    
                    return strHex;
                }
                else if(/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(colorRgbCode))
                {
                    var colorBuffer = colorRgbCode.replace(/#/, "").split("");
    
                    if(colorBuffer.length === 6)
                    {
                        return colorRgbCode;
                    }
                    else if(colorBuffer.length === 3)
                    {
                        var numHex = "#";
    
                        for(var i = 0;i < colorBuffer.length;i += 1)
                        {
                            numHex += (colorBuffer[i] + colorBuffer[i]);
                        }
    
                        return numHex;
                    }
                }
                else
                {
                    return colorRgbCode;
                }
            },
    
            /**
            * 十六进制颜色转为 RGB 格式
            */
            rgb: function(colorHexCode)
            {
                var color = colorHexCode.toLowerCase();
    
                if(color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color))
                {
                    // 处理简写的颜色
                    if(color.length === 4)
                    {
                        var originalColor = "#";
    
                        for(var i = 1;i < 4;i += 1)
                        {
                            originalColor += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                        }
    
                        color = originalColor;
                    }
    
                    // 处理六位的颜色值
                    var colorBuffer = [];
    
                    for(var i = 1;i < 7;i += 2)
                    {
                        colorBuffer.push(parseInt("0x" + color.slice(i, i + 2)));
                    }
                    return 'rgb(' + colorBuffer.join(', ') + ')';
                }
                else
                {
                    return color;
                }
            }
        }
    };
    
    // 获取脚本文件位置
    var scriptFilePath = '';
    
    x.file = function()
    {
        return scriptFilePath;
    };
    
    x.dir = function()
    {
        if(scriptFilePath.length > 0)
        {
            return scriptFilePath.substring(0, scriptFilePath.lastIndexOf("/") + 1);
        }
        else
        {
            return '';
        }
    };
    
    /**
    * 加载脚本
    * @method require
    * @memberof x
    * @param {object} options 选项
    */
    var require = x.require = function(options)
    {
        if(x.isArray(options.files))
        {
            var file, files = options.files;
    
            if(files.length > 0)
            {
                file = files.shift();
    
                if(files.length == 0)
                {
                    require.newRequire({
                        fileType: file.fileType,
                        id: file.id,
                        async: file.async,
                        path: file.path,
                        data: options.data,
                        callback: options.callback
                    });
                }
                else if(files.length > 0)
                {
                    require.newRequire({
                        fileType: file.fileType,
                        id: file.id,
                        async: file.async,
                        path: file.path,
                        data: options.data,
                        next: { files: files, callback: options.callback },
                        callback: function(context)
                        {
                            require({
                                files: context.next.files,
                                data: context.data,
                                callback: context.next.callback
                            });
                        }
                    });
                }
            }
        }
        else
        {
            require.newRequire({
                fileType: options.fileType,
                id: options.id,
                async: options.async,
                path: options.path,
                data: options.data,
                callback: options.callback
            });
        }
    };
    
    require.newRequire = function(options)
    {
        var context = x.ext({
            fileType: 'script',
            id: '',
            path: ''
        }, options || {});
    
        if(context.fileType == 'template')
        {
            if(context.next)
            {
                x.net.require({
                    fileType: context.fileType,
                    id: context.id,
                    path: context.path,
                    async: false,
                    callback: function()
                    {
                        require({
                            files: context.next.files,
                            data: context.data,
                            callback: context.next.callback
                        });
                    }
                });
            }
            else
            {
                x.net.require({
                    fileType: context.fileType,
                    id: context.id,
                    path: context.path,
                    async: false,
                    callback: context.callback
                });
            }
            return;
        }
    
        var load = function(node, fn)
        {
            //Check if node.attachEvent is artificially added by custom script or
            //natively supported by browser
            //read https://github.com/jrburke/requirejs/issues/187
            //if we can NOT find [native code] then it must NOT natively supported.
            //in IE8, node.attachEvent does not have toString()
            //Note the test for "[native code" with no closing brace, see:
            //https://github.com/jrburke/requirejs/issues/273
    
            if(node.attachEvent
                    && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0)
                    && !x.browser.opera)
            {
                x.event.add(node, 'readystatechange', fn);
            }
            else
            {
                x.event.add(node, 'load', fn);
            }
        };
    
        var onScriptLoad = function(event)
        {
    
            var node = x.event.getTarget(event);
    
            if(event.type === 'load' || /^(complete|loaded)$/.test(node.readyState))
            {
                node.ready = true;
    
    
                if(x.isFunction(context.callback))
                {
                    context.callback(context);
                }
            }
        };
    
        var head = document.getElementsByTagName('head')[0];
    
        var node = document.getElementById(context.id);
    
    
        if(node == null)
        {
            // 未找到相关依赖资源文件
            if(context.fileType == 'css')
            {
                var node = document.createElement("link");
    
                node.id = context.id;
                node.type = "text/css";
                node.rel = "stylesheet";
                node.href = context.path;
                node.ready = false;
            }
            else
            {
                var node = document.createElement("script");
    
                node.id = context.id;
                node.type = "text/javascript";
                node.async = options.async == false ? false : true;
                node.src = context.path;
                node.ready = false;
            }
    
            load(node, onScriptLoad);
    
            head.appendChild(node);
    
        }
        else
        {
            // 存在相关依赖文件
            // if(x.isFunction(context.callback))
            if(node.ready)
            {
                context.callback(context);
            }
            else
            {
                load(node, onScriptLoad);
            }
    
        }
    
        return context;
    };
    
    /**
    * JSONP 函数
    * @method require
    * @memberof x
    * @param {object} options 选项
    */
    x.jsonp = function(options)
    {
        var options = x.ext({
            fileType: 'javascipt',
            id: 'JSONP' + Number(new Date()),
            jsonp: 'callback',
            jsonpCallback: 'jsonpCallback'
        }, options);
    
        options.path = options.url + ((options.url.indexOf('?') == -1) ? '?' : '&') + options.jsonp + '=' + options.jsonpCallback;
    
        x.require(options);
    };
    
    /**
    * @namespace ui
    * @memberof x
    * @description UI 名称空间
    */
    x.ui = {
    
        /**
        * 样式名称默认前缀
        * @member {string} classNamePrefix 样式名称默认前缀
        * @memberof x.ui
        */
        classNamePrefix: 'x-ui',
    
        /**
        * 样式表路径默认前缀
        * @member {string} stylesheetPathPrefix
        * @memberof x.ui
        */
        stylesheetPathPrefix: '/resources/styles/x-ui/',
    
        packagesPathPrefix: null,
    
        /**
        * 组件包根目录
        * @method dir
        * @memberof x.ui.pkg
        */
        dir: function() { return x.dir() + 'ui/'; },
    
        /**
        * 通用 组件包默认名称空间
        * @namespace pkg
        * @memberof x.ui
        */
        pkg: {
    
            /**
            * 触摸组件包默认名称空间
            * @namespace touches
            * @memberof x.ui.pkg
            */
            touches: {},
    
            /**
            * 组件包根目录
            * @method dir
            * @memberof x.ui.pkg
            */
            dir: function() { return x.dir() + 'ui/pkg/'; }
        },
    
        /**
        * 样式名称空间
        * @namespace pkg
        * @memberof x.ui
        */
        styles: {
            dir: function() { return x.ui.stylesheetPathPrefix; }
        }
    };
    
    // 输出对象
    return x;
})();
