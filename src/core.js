"use strict";
function getGlobal() {
    return typeof window !== 'undefined' ? window : global;
}
;
var x = {
    type: function (object) {
        try {
            if (typeof (object) === 'undefined') {
                return 'undefined';
            }
            if (object === null) {
                return 'null';
            }
            return /\[object ([A-Za-z]+)\]/.exec(Object.prototype.toString.call(object))[1].toLowerCase();
        }
        catch (ex) {
            if (ex instanceof RangeError) {
                return '...';
            }
            throw ex;
        }
    },
    isArray: function (object) {
        return x.type(object) === 'array';
    },
    isFunction: function (object) {
        return x.type(object) === 'function';
    },
    isString: function (object) {
        return x.type(object) === 'string';
    },
    isNumber: function (object) {
        return x.type(object) === 'number';
    },
    isUndefined: function (object) {
        return x.type(object) === 'undefined';
    },
    scriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
    jsonFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    quickExpr: /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
    isSimple: /^.[^:#\[\.,]*$/,
    noop: function () { },
    register: function (value) {
        var parts = value.split(".");
        var root = getGlobal();
        for (var i = 0; i < parts.length; i++) {
            if (x.isUndefined(root[parts[i]])) {
                root[parts[i]] = {};
            }
            root = root[parts[i]];
        }
        return root;
    },
    ext: function (destination, source) {
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
    clone: function (object) {
        return x.ext({}, object);
    },
    invoke: function (object, fn) {
        var args = Array.prototype.slice.call(arguments).slice(2);
        return fn.apply(object, args);
    },
    call: function (anything) {
        if (!x.isUndefined(anything)) {
            try {
                if (x.isFunction(anything)) {
                    var args = Array.prototype.slice.call(arguments).slice(1);
                    return anything.apply(this, args);
                }
                else if (x.type(anything) === 'string') {
                    if (anything !== '') {
                        return eval(anything);
                    }
                }
            }
            catch (ex) {
                console.error(ex);
            }
        }
    },
    query: function (selector) {
        if (x.type(selector).indexOf('html') == 0) {
            return selector;
        }
        else if (x.type(selector) == 'string') {
            return document.querySelector(selector);
        }
    },
    queryAll: function (selector) {
        if (x.type(selector).indexOf('html') == 0) {
            var results = [];
            results.push(selector);
            return results;
        }
        else if (x.type(selector) == 'string') {
            return document.querySelectorAll(selector);
        }
    },
    serialize: function (data) {
        var buffer = [], length = data.length;
        if (x.isArray(data)) {
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
    each: function (data, callback) {
        var name, i = 0, length = data.length;
        if (x.isArray(data)) {
            for (var value = data[0]; i < length && callback.call(value, i, value) != false; value = data[++i]) { }
        }
        else {
            for (name in data) {
                if (callback.call(data[name], name, data[name]) === false) {
                    break;
                }
            }
        }
        return data;
    },
    toJSON: function (text) {
        if (x.type(text) === 'object') {
            return text;
        }
        if (x.isUndefined(text) || text === '') {
            return undefined;
        }
        var hideError = arguments[1];
        try {
            return (JSON) ? JSON.parse(text) : (Function("return " + text))();
        }
        catch (ex) {
            try {
                return (Function("return " + text))();
            }
            catch (ex1) {
                if (!hideError)
                    x.debug.error('{"method":"x.toJSON(text)", "arguments":{"text":"' + text + '"}');
                return undefined;
            }
        }
    },
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
    toSafeLike: function (text) {
        return text.replace(/\[/g, '[[]').replace(/%/g, '[%]').replace(/_/g, '[_]');
    },
    cdata: function (text) {
        return '<![CDATA[' + text + ']]>';
    },
    camelCase: function (text) {
        var rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi;
        return text.replace(rmsPrefix, "ms-").replace(rdashAlpha, function (all, letter) {
            return letter.toUpperCase();
        });
    },
    paddingZero: function (number, length) {
        return (Array(length).join('0') + number).slice(-length);
    },
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
    getFriendlyName: function (name) {
        return x.camelCase(('x-' + name).replace(/[\#\$\.\/\\\:\?\=]/g, '-').replace(/[-]+/g, '-'));
    },
    newHashTable: function () {
        var hashTable = {
            innerArray: [],
            clear: function () {
                this.innerArray = [];
            },
            exist: function (key) {
                for (var i = 0; i < this.innerArray.length; i++) {
                    if (this.innerArray[i].name === key) {
                        return true;
                    }
                }
                return false;
            },
            get: function (index) {
                return this.innerArray[index];
            },
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
            find: function (key) {
                for (var i = 0; i < this.innerArray.length; i++) {
                    if (this.innerArray[i].name === key) {
                        return this.innerArray[i].value;
                    }
                }
                return null;
            },
            size: function () {
                return this.innerArray.length;
            }
        };
        return hashTable;
    },
    newQueue: function () {
        var queue = {
            innerArray: [],
            push: function (targetObject) {
                this.innerArray.push(targetObject);
            },
            pop: function () {
                if (this.innerArray.length === 0) {
                    return null;
                }
                else {
                    var targetObject = this.innerArray[0];
                    for (var i = 0; i < this.innerArray.length - 1; i++) {
                        this.innerArray[i] = this.innerArray[i + 1];
                    }
                    this.innerArray.length = this.innerArray.length - 1;
                    return targetObject;
                }
            },
            peek: function () {
                if (this.innerArray.length === 0) {
                    return null;
                }
                return this.innerArray[0];
            },
            clear: function () {
                this.innerArray.length = 0;
            },
            size: function () {
                return this.innerArray.length;
            },
            isEmpty: function () {
                return (this.innerArray.length === 0) ? true : false;
            }
        };
        return queue;
    },
    newStack: function () {
        var stack = {
            innerArray: [],
            push: function (targetObject) {
                this.innerArray[this.innerArray.length] = targetObject;
            },
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
            peek: function () {
                if (this.innerArray.length === 0) {
                    return null;
                }
                return this.innerArray[this.innerArray.length - 1];
            },
            clear: function () {
                this.innerArray.length = 0;
            },
            size: function () {
                return this.innerArray.length;
            },
            isEmpty: function () {
                return (this.innerArray.length === 0) ? true : false;
            }
        };
        return stack;
    },
    newStringBuilder: function () {
        var stringBuilder = {
            innerArray: [],
            append: function (text) {
                this.innerArray[this.innerArray.length] = text;
            },
            toString: function () {
                return this.innerArray.join('');
            }
        };
        return stringBuilder;
    },
    timers: {},
    newTimer: function (interval, callback) {
        var timer = {
            name: 'timer$' + Math.ceil(Math.random() * 900000000 + 100000000),
            interval: interval * 1000,
            callback: callback,
            run: function () {
                this.callback(this);
            },
            start: function () {
                var that = x.timers[this.name] = this;
                this.timerId = setInterval(function () { x.timers[that.name].run(); }, this.interval);
            },
            stop: function () {
                clearInterval(this.timerId);
            }
        };
        return timer;
    },
    event: {
        getEvent: function (event) {
            return window.event ? window.event : event;
        },
        getTarget: function (event) {
            return window.event ? window.event.srcElement : (event ? event.target : null);
        },
        getPosition: function (event) {
            var docElement = document.documentElement;
            var body = document.body || { scrollLeft: 0, scrollTop: 0 };
            return {
                x: event.pageX || (event.clientX + (docElement.scrollLeft || body.scrollLeft) - (docElement.clientLeft || 0)),
                y: event.pageY || (event.clientY + (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0))
            };
        },
        preventDefault: function (event) {
            if (event && event.preventDefault) {
                event.preventDefault();
            }
            else {
                window.event.returnValue = false;
            }
        },
        stopPropagation: function (event) {
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            else {
                window.event.cancelBubble = true;
            }
            return false;
        },
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
        }
    },
    guid: {
        create: function (format, isUpperCase) {
            if (format === void 0) { format = '-'; }
            var text = '';
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
    },
    randomText: {
        create: function (length, buffer) {
            if (length === void 0) { length = 8; }
            if (buffer === void 0) { buffer = "0123456789abcdefghijklmnopqrstuvwyzx"; }
            var result = '';
            for (var i = 0; i < length; i++) {
                result += buffer.charAt(Math.ceil(Math.random() * 100000000) % buffer.length);
            }
            return result;
        }
    },
    nonce: function (length) {
        if (length === void 0) { length = 6; }
        return Number(x.randomText.create(1, '123456789') + x.randomText.create(length - 1, '0123456789'));
    },
    debug: {
        log: function (object) {
            if (!x.isUndefined(console)) {
                console.log(object);
            }
        },
        warn: function (object) {
            if (!x.isUndefined(console)) {
                console.warn(object);
            }
        },
        error: function (object) {
            if (!x.isUndefined(console)) {
                console.error(object);
            }
        },
        assert: function (expression) {
            if (!x.isUndefined(console)) {
                console.assert(expression);
            }
        },
        time: function (name) {
            if (!x.isUndefined(console)) {
                console.time(name);
            }
        },
        timeEnd: function (name) {
            if (!x.isUndefined(console)) {
                console.timeEnd(name);
            }
        },
        timestamp: function () {
            var format = '{yyyy-MM-dd HH:mm:ss.fff}';
            var timestamp = new Date();
            return format.replace(/yyyy/, timestamp.getFullYear().toString())
                .replace(/MM/, (timestamp.getMonth() + 1) > 9 ? (timestamp.getMonth() + 1).toString() : '0' + (timestamp.getMonth() + 1))
                .replace(/dd|DD/, timestamp.getDate() > 9 ? timestamp.getDate().toString() : '0' + timestamp.getDate())
                .replace(/hh|HH/, timestamp.getHours() > 9 ? timestamp.getHours().toString() : '0' + timestamp.getHours())
                .replace(/mm/, timestamp.getMinutes() > 9 ? timestamp.getMinutes().toString() : '0' + timestamp.getMinutes())
                .replace(/ss|SS/, timestamp.getSeconds() > 9 ? timestamp.getSeconds().toString() : '0' + timestamp.getSeconds())
                .replace(/fff/g, ((timestamp.getMilliseconds() > 99) ? timestamp.getMilliseconds().toString() : (timestamp.getMilliseconds() > 9) ? '0' + timestamp.getMilliseconds() : '00' + timestamp.getMilliseconds()));
        }
    }
};
module.exports = x;
