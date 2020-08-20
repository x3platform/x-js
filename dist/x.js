(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.x = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var base = require("./lib/base");
var event = require("./lib/event");
var Queue = require("./lib/collections/Queue");
var Stack = require("./lib/collections/Stack");
var color = require("./lib/color");
var cookies = require("./lib/cookies");
var encoding = require("./lib/encoding");
var regexp = require("./lib/regexp");
var string = require("./lib/string");
var date = require("./lib/date");
var net = require("./lib/net");
var x = base.extend({}, base, {
    event: event,
    queue: Queue,
    stack: Stack,
    color: color,
    cookies: cookies,
    encoding: encoding,
    regexp: regexp,
    string: string,
    date: date,
    on: event.add,
    net: net
});
base.extend(x, {
    on: event.add,
    off: event.remove,
    xhr: net.xhr
});
module.exports = x;

},{"./lib/base":2,"./lib/collections/Queue":9,"./lib/collections/Stack":10,"./lib/color":11,"./lib/cookies":12,"./lib/date":13,"./lib/encoding":14,"./lib/event":15,"./lib/net":16,"./lib/regexp":17,"./lib/string":18}],2:[function(require,module,exports){
"use strict";
var lang = require("./base/lang");
var kernel = require("./base/kernel");
var declare = require("./base/declare");
var Hashtable = require("./collections/Hashtable");
var Queue = require("./collections/Queue");
var Stack = require("./collections/Stack");
var self = lang.extend({}, lang, kernel, {
    declare: declare,
    query: function (selector) {
        if (lang.type(selector).indexOf('html') == 0) {
            return selector;
        }
        else if (lang.type(selector) == 'string') {
            return document.querySelector(selector);
        }
    },
    queryAll: function (selector) {
        if (lang.type(selector).indexOf('html') == 0) {
            var results = [];
            results.push(selector);
            return results;
        }
        else if (lang.type(selector) == 'string') {
            return document.querySelectorAll(selector);
        }
    },
    collections: {},
});
var collections = {
    Hashtable: Hashtable,
    Queue: Queue,
    Stack: Stack,
};
lang.extend(self.collections, collections);
module.exports = self;

},{"./base/declare":5,"./base/kernel":6,"./base/lang":7,"./collections/Hashtable":8,"./collections/Queue":9,"./collections/Stack":10}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringBuilder = (function () {
    function StringBuilder() {
        this.innerArray = [];
    }
    StringBuilder.prototype.append = function (text) {
        this.innerArray[this.innerArray.length] = text;
    };
    StringBuilder.prototype.toString = function () {
        return this.innerArray.join('');
    };
    return StringBuilder;
}());
exports.StringBuilder = StringBuilder;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timers = {};
var namePrefix = 'timer$';
var Timer = (function () {
    function Timer(interval, callback) {
        this.timerId = -1;
        this.name = namePrefix + Math.ceil(Math.random() * 900000000 + 100000000);
        this.interval = interval * 1000;
        this.callback = callback;
    }
    Timer.prototype.run = function () {
        this.callback(this);
    };
    Timer.prototype.start = function () {
        var that = (timers[this.name] = this);
        this.timerId = setInterval(function () {
            timers[that.name].run();
        }, this.interval);
    };
    Timer.prototype.stop = function () {
        clearInterval(this.timerId);
    };
    return Timer;
}());
exports.Timer = Timer;

},{}],5:[function(require,module,exports){
"use strict";
var lang = require("./lang");
var kernel = require("./kernel");
var xtor = function () { };
var op = Object.prototype, opts = op.toString, cname = "constructor";
function forceNew(ctor) {
    xtor.prototype = ctor.prototype;
    var t = new xtor;
    xtor.prototype = null;
    return t;
}
function applyNew(args) {
    var ctor = args.callee, t = forceNew(ctor);
    ctor.apply(t, args);
    return t;
}
function chainedConstructor(bases, ctorSpecial) {
    return function () {
        var a = arguments, args = a, a0 = a[0], f, i, m, l = bases.length, preArgs;
        if (!(this instanceof a.callee)) {
            return applyNew(a);
        }
        if (ctorSpecial && (a0 && a0.preamble || this.preamble)) {
            preArgs = new Array(bases.length);
            preArgs[0] = a;
            for (i = 0;;) {
                a0 = a[0];
                if (a0) {
                    f = a0.preamble;
                    if (f) {
                        a = f.apply(this, a) || a;
                    }
                }
                f = bases[i].prototype;
                f = f.hasOwnProperty("preamble") && f.preamble;
                if (f) {
                    a = f.apply(this, a) || a;
                }
                if (++i == l) {
                    break;
                }
                preArgs[i] = a;
            }
        }
        for (i = l - 1; i >= 0; --i) {
            f = bases[i];
            m = f._meta;
            f = m ? m.ctor : f;
            if (f) {
                f.apply(this, preArgs ? preArgs[i] : a);
            }
        }
        f = this.postscript;
        if (f) {
            f.apply(this, args);
        }
    };
}
function singleConstructor(ctor, ctorSpecial) {
    return function () {
        var a = arguments, t = a, a0 = a[0], f;
        if (ctorSpecial) {
            if (a0) {
                f = a0.preamble;
                if (f) {
                    t = f.apply(this, t) || t;
                }
            }
            f = this.preamble;
            if (f) {
                f.apply(this, t);
            }
        }
        if (ctor) {
            ctor.apply(this, a);
        }
        f = this.postscript;
        if (f) {
            f.apply(this, a);
        }
    };
}
function simpleConstructor(bases) {
    return function () {
        var a = arguments, i = 0, f, m;
        if (!(this instanceof a.callee)) {
            return applyNew(a);
        }
        for (; f = bases[i]; ++i) {
            m = f._meta;
            f = m ? m.ctor : f;
            if (f) {
                f.apply(this, a);
                break;
            }
        }
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
var declare = function (className, superclass, props) {
    var className, superclass, props;
    if (arguments.length == 1) {
        className = null;
        superclass = null;
        props = arguments[0] || {};
    }
    else if (arguments.length == 2) {
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
    var proto, t, ctor;
    ctor = function () { };
    proto = {};
    if (lang.isArray(superclass)) {
        for (var i = 0; i < superclass.length; i++) {
            lang.extend(proto, superclass[i]);
        }
    }
    else if (superclass != null) {
        lang.extend(proto, superclass);
    }
    for (var property in props) {
        ctor.prototype[property] = props[property];
        lang.extend(proto, props);
    }
    t = props.constructor;
    if (t !== op.constructor) {
        t.nom = cname;
        proto.constructor = t;
    }
    ctor = singleConstructor(props.constructor, t);
    ctor._meta = {
        hidden: props,
        ctor: props.constructor
    };
    ctor.superclass = superclass && superclass.prototype;
    ctor.prototype = proto;
    proto.constructor = ctor;
    if (className) {
        ctor.prototype.declaredClass = className;
        var parts = className.split(".");
        var name_1 = parts.pop();
        var context = parts.length == 0 ? kernel.global() : kernel.register(parts.join('.'));
        context[name_1] = ctor;
    }
    return ctor;
};
module.exports = declare;

},{"./kernel":6,"./lang":7}],6:[function(require,module,exports){
(function (global){
"use strict";
var lang = require("./lang");
var StringBuilder_1 = require("./StringBuilder");
var Timer_1 = require("./Timer");
var locales = { "en-us": "en-us", "zh-cn": "zh-cn", "zh-tw": "zh-tw" };
var defaultLocaleName = 'zh-cn';
var self = {
    global: function () {
        return typeof window !== 'undefined' ? window : global;
    },
    isBrower: function () {
        return lang.type(self.global()) === 'window';
    },
    isNode: function () {
        return lang.type(self.global()) === 'global';
    },
    error: function (msg) {
        throw new Error(msg);
    },
    scriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
    jsonFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    quickExpr: /^[^<]*(<(.|\s)+>)[^>]*$|^#([\w-]+)$/,
    isSimple: /^.[^:#\[\.,]*$/,
    noop: function () { },
    register: function (value) {
        var parts = value.split(".");
        var root = self.global();
        for (var i = 0; i < parts.length; i++) {
            if (lang.isUndefined(root[parts[i]])) {
                root[parts[i]] = {};
            }
            root = root[parts[i]];
        }
        return root;
    },
    invoke: function (object, fn) {
        var args = Array.prototype.slice.call(arguments).slice(2);
        return fn.apply(object, args);
    },
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
        return Number(self.randomText.create(1, '123456789') + self.randomText.create(length - 1, '0123456789'));
    },
    serialize: function (data) {
        var buffer = [], length = data.length;
        if (lang.isArray(data)) {
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
        if (lang.isArray(data) || lang.type(data) == 'nodelist') {
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
    toXML: function (text, hideError) {
        if (hideError === void 0) { hideError = false; }
        if (lang.type(text) === 'xmldocument') {
            return text;
        }
        if (lang.isUndefined(text) || text === '') {
            return undefined;
        }
        var global = self.global();
        var doc;
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
    toJSON: function (text) {
        if (lang.type(text) === 'object') {
            return text;
        }
        if (lang.isUndefined(text) || text === '') {
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
                    self.debug.error('{"method":"x.toJSON(text)", "arguments":{"text":"' + text + '"}');
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
    formatLocale: function (text) {
        var locale = locales[text.toLowerCase()];
        return locale ? locale : defaultLocaleName;
    },
    getFriendlyName: function (name) {
        return self.camelCase(('x_' + name).replace(/[\#\$\.\/\\\:\?\=]/g, '_').replace(/[-]+/g, '_'));
    },
    StringBuilder: StringBuilder_1.StringBuilder,
    Timer: Timer_1.Timer,
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
                var that = self.timers[this.name] = this;
                this.timerId = setInterval(function () { self.timers[that.name].run(); }, this.interval);
            },
            stop: function () {
                clearInterval(this.timerId);
            }
        };
        return timer;
    },
    debug: {
        log: function (object) {
            if (!lang.isUndefined(console)) {
                console.log(object);
            }
        },
        warn: function (object) {
            if (!lang.isUndefined(console)) {
                console.warn(object);
            }
        },
        error: function (object) {
            if (!lang.isUndefined(console)) {
                console.error(object);
            }
        },
        assert: function (expression) {
            if (!lang.isUndefined(console)) {
                console.assert(expression);
            }
        },
        time: function (name) {
            if (!lang.isUndefined(console)) {
                console.time(name);
            }
        },
        timeEnd: function (name) {
            if (!lang.isUndefined(console)) {
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
module.exports = self;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./StringBuilder":3,"./Timer":4,"./lang":7}],7:[function(require,module,exports){
"use strict";
var self = {
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
    isArray: function (object) { },
    isFunction: function (object) { },
    isString: function (object) { },
    isNumber: function (object) { },
    isUndefined: function (object) { },
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
    clone: function (object) {
        return self.extend({}, object);
    },
    EventTarget: function () {
        this.eventListeners = {};
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
var types = ["Array", "Function", "String", "Number", "Undefined"];
var _loop_1 = function (i) {
    self['is' + types[i]] = function (object) {
        return self.type(object) === types[i].toLowerCase();
    };
};
for (var i = 0; i < types.length; i++) {
    _loop_1(i);
}
module.exports = self;

},{}],8:[function(require,module,exports){
"use strict";
var declare = require("../base/declare");
var self = declare({
    constructor: function () {
        this.innerArray = [];
    },
    clear: function () {
        this.innerArray = [];
    },
    exist: function (key) {
        for (var i = 0; i < this.innerArray.length; i++) {
            if (this.innerArray[i].key === key) {
                return true;
            }
        }
        return false;
    },
    index: function (key) {
        for (var i = 0; i < this.innerArray.length; i++) {
            if (this.innerArray[i].key === key) {
                return i;
            }
        }
        return -1;
    },
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
    remove: function (key) {
        var i = this.index(key);
        if (i > -1) {
            this.innerArray.splice(i, 1);
        }
    },
    get: function (key) {
        for (var i = 0; i < this.innerArray.length; i++) {
            if (this.innerArray[i].key === key) {
                return this.innerArray[i].value;
            }
        }
        return null;
    },
    set: function (key, value) {
        for (var i = 0; i < this.innerArray.length; i++) {
            if (this.innerArray[i].key === key) {
                this.innerArray[i].value = value;
            }
        }
    },
    size: function () {
        return this.innerArray.length;
    }
});
module.exports = self;

},{"../base/declare":5}],9:[function(require,module,exports){
"use strict";
var declare = require("../base/declare");
var self = declare({
    constructor: function () {
        this.innerArray = [];
    },
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
        return this.innerArray.length === 0 ? true : false;
    }
});
module.exports = self;

},{"../base/declare":5}],10:[function(require,module,exports){
"use strict";
var self = {
    create: function () {
        return self.constructor();
    },
    constructor: function () {
        var stack = {
            innerArray: [],
            push: function (element) {
                this.innerArray[this.innerArray.length] = element;
            },
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
    }
};
module.exports = self;

},{}],11:[function(require,module,exports){
"use strict";
var self = {
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
    rgb: function (colorHexCode) {
        var color = colorHexCode.toLowerCase();
        if (color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)) {
            if (color.length === 4) {
                var originalColor = "#";
                for (var i = 1; i < 4; i += 1) {
                    originalColor += color.slice(i, i + 1).concat(color.slice(i, i + 1));
                }
                color = originalColor;
            }
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
module.exports = self;

},{}],12:[function(require,module,exports){
"use strict";
var lang = require("./base/lang");
var self = {
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
    add: function (name, value, options) {
        options = lang.extend({ path: '/' }, options || {});
        document.cookie = escape(name) + '=' + escape(value)
            + ((!options.expire) ? '' : ('; expires=' + options.expire.toUTCString()))
            + '; path=' + options.path
            + ((!options.domain) ? '' : ('; domain=' + options.domain));
    },
    remove: function (name, options) {
        options = lang.extend({ path: '/' }, options || {});
        if (!!this.query(name)) {
            document.cookie = escape(name) + '=; path=' + options.path
                + '; expires=' + new Date(0).toUTCString()
                + ((!options.domain) ? '' : ('; domain=' + options.domain));
        }
    }
};
module.exports = self;

},{"./base/lang":7}],13:[function(require,module,exports){
"use strict";
var x = require("./base");
var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
var self = {
    now: function () {
        return self.create();
    },
    create: function (timeValue) {
        return self.newDateTime(timeValue);
    },
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
    formatInterval: function (interval) {
        return self.shortIntervals[interval] || interval;
    },
    diff: function (begin, end, interval) {
        var timeBegin = self.newDateTime(begin);
        var timeEnd = self.newDateTime(end);
        return timeBegin.diff(self.formatInterval(interval), timeEnd);
    },
    add: function (timeValue, interval, number) {
        var time = self.newDateTime(timeValue);
        return time.add(self.formatInterval(interval), number);
    },
    format: function (timeValue, formatValue) {
        var time = self.create(timeValue);
        return time.toString(formatValue);
    },
    ago: function (timeValue, suffix) {
        suffix = x.extend({
            amoment: "刚刚",
            minute: '分钟前',
            hour: '小时前',
            day: '天前'
        }, suffix);
        var time = self.create(timeValue);
        var now = self.create();
        if (time.diff('m', now) < 1) {
            return suffix.amoment;
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
            return time.toString('yyyy-MM-dd');
        }
    },
    newDateTime: function (timeValue) {
        var date = new Date();
        if (!x.isUndefined(timeValue)) {
            if (x.type(timeValue) === 'date') {
                date = timeValue;
            }
            else if (x.isNumber(timeValue)) {
                date = new Date(timeValue);
            }
            else if (x.isArray(timeValue)) {
                var keys = timeValue;
                for (var i = 0; i < 6; i++) {
                    keys[i] = isNaN(keys[i]) ? (i < 3 ? 1 : 0) : Number(keys[i]);
                }
                date = new Date(keys[0], Number(keys[1]) - 1, keys[2], keys[3], keys[4], keys[5]);
            }
            else if (/\/Date\((-?\d+)\)\//.test(timeValue)) {
                date = new Date(Math.floor(timeValue.replace(/\/Date\((-?\d+)\)\//, '$1')));
            }
            else if (/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/.test(timeValue)
                || /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/.test(timeValue)) {
                date = new Date(timeValue);
            }
            else {
                var keys = timeValue.replace(/[-|:|\/| |年|月|日]/g, ',').replace(/,,/g, ',').split(',');
                for (var i = 0; i < 6; i++) {
                    keys[i] = isNaN(keys[i]) ? (i < 3 ? 1 : 0) : Number(keys[i]);
                }
                date = new Date(keys[0], Number(keys[1]) - 1, keys[2], keys[3], keys[4], keys[5]);
            }
        }
        var time = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            msecond: date.getMilliseconds(),
            weekDay: date.getDay(),
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
            add: function (interval, number) {
                var date = Number(this.toNativeDate());
                var ms = 0;
                var monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                interval = self.formatInterval(interval);
                number = Number(number);
                switch (interval) {
                    case 'year':
                        if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
                            && !((this.year + number) % 4 == 0 && (((this.year + number) % 100 != 0) || ((this.year + number) % 400 == 0)))) {
                            ms = Number(new Date(this.year + number, this.month, 28, this.hour, this.minute, this.second));
                        }
                        else {
                            ms = Number(new Date(this.year + number, this.month, this.day, this.hour, this.minute, this.second));
                        }
                        break;
                    case 'quarter':
                        if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
                            && !((this.year + Math.floor((this.month + number * 3) / 12)) % 4 == 0 && (((this.year + Math.floor((this.month + number * 3) / 12)) % 100 != 0) || ((this.year + Math.floor((this.month + number * 3) / 12)) % 400 == 0)))) {
                            ms = Number(new Date(this.year, (this.month + number * 3), 28, this.hour, this.minute, this.second));
                        }
                        else {
                            if (this.day == monthMaxDays[this.month]) {
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
                            ms = Number(new Date(this.year, (this.month + number), 28, this.hour, this.minute, this.second));
                        }
                        else {
                            if (this.day == monthMaxDays[this.month]) {
                                ms = Number(new Date(this.year, (this.month + number), monthMaxDays[(this.month + number) % 12], this.hour, this.minute, this.second));
                            }
                            else {
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
            getDatePart: function (interval) {
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
            getMaxDayOfMonth: function () {
                var date1 = self.create(this.toString('yyyy-MM-01'));
                var date2 = self.create(this.add('month', 1).toString('yyyy-MM-01'));
                return date1.diff('day', date2);
            },
            getQuarterOfYear: function () {
                return Math.ceil(this.month / 3);
            },
            getWeekOfYear: function () {
                var week = 0;
                var day = this.getDayOfYear();
                if (self.create(this.toString('yyyy-01-01')).weekDay > 0) {
                    day = day - (7 - self.create(this.toString('yyyy-01-01')).weekDay);
                }
                if (day > 0) {
                    week = Math.ceil(day / 7);
                }
                return week;
            },
            getDayOfYear: function () {
                var date1 = this.toNativeDate();
                var date2 = new Date(date1.getFullYear(), 0, 1);
                return Math.ceil(Number(Number(date1) - Number(date2)) / (24 * 60 * 60 * 1000)) + 1;
            },
            isLeapYear: function () {
                return (this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0)));
            },
            toArray: function () {
                return [this.year, this.month, this.day, this.hour, this.minute, this.second, this.msecond];
            },
            toNativeDate: function () {
                return new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
            },
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
    timespan: function (timespanValue, format) {
        if (format === void 0) { format = 'second'; }
        if (format == 'day' || format == 'd') {
            timespanValue = timespanValue * 24 * 60 * 60;
        }
        if (format == 'hour' || format == 'h') {
            timespanValue = timespanValue * 60 * 60;
        }
        if (format == 'minute' || format == 'm') {
            timespanValue = timespanValue * 60;
        }
        if (format == 'second' || format == 's') {
            timespanValue = timespanValue * 1000;
        }
        var timespan = {
            timespanValue: timespanValue,
            day: timespanValue / (24 * 60 * 60 * 1000),
            hour: timespanValue / (60 * 60 * 1000),
            minute: timespanValue / (60 * 1000),
            second: timespanValue / 1000,
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
module.exports = self;

},{"./base":2}],14:[function(require,module,exports){
"use strict";
var x = require("./base");
var string = require("./string");
var self = {
    html: {
        dict: {
            '&': '&#32;',
            ' ': '&#38;',
            '<': '&#60;',
            '>': '&#62;',
            '"': '&#34;',
            '\'': '&#39;'
        },
        encode: function (text) {
            if (text.length === 0) {
                return '';
            }
            text = string.stringify(text);
            return text.replace(/&(?![\w#]+;)|[<>"']/g, function (s) {
                return self.html.dict[s];
            });
        },
        decode: function (text) {
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
    },
    unicode: {
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
    }
};
module.exports = self;

},{"./base":2,"./string":18}],15:[function(require,module,exports){
"use strict";
var self = {
    getEvent: function (event) {
        return window.event ? window.event : event;
    },
    getTarget: function (event) {
        return window.event ? window.event.srcElement : event ? event.target : null;
    },
    getPosition: function (event) {
        var docElement = document.documentElement;
        var body = document.body || { scrollLeft: 0, scrollTop: 0 };
        return {
            x: event.pageX || event.clientX + (docElement.scrollLeft || body.scrollLeft) - (docElement.clientLeft || 0),
            y: event.pageY || event.clientY + (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0)
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
    },
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
module.exports = self;

},{}],16:[function(require,module,exports){
"use strict";
var x = require("./base");
var event = require("./event");
var defaults = {
    returnType: 'json',
    xhrDataKey: 'xhr-xml',
    getAccessToken: function () {
    },
    getClientId: function () {
    },
    getClientSignature: function () {
    },
    getTimestamp: function () {
    },
    getNonce: function () {
    },
    getWaitingWindow: function (options) {
        options = x.extend({
            type: 'default',
            text: i18n.net.waiting.commitTipText
        }, options || {});
        if (x.isUndefined(options.name)) {
            options.name = x.getFriendlyName(location.pathname + '$' + options.type + '$waiting$window');
        }
        var name = options.name;
        if (x.isUndefined(window[name])) {
            if (options.type == 'mini') {
                window[name] = {
                    name: name,
                    options: options,
                    container: null,
                    message: null,
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
                    show: function () {
                        if (!x.isUndefined(arguments[0])) {
                            this.options.text = arguments[0];
                        }
                        this.create(this.options.text);
                        x.css.style(this.container, {
                            display: '',
                            position: 'fixed',
                            left: '4px',
                            bottom: '4px'
                        });
                    },
                    hide: function () {
                        if (this.container != null) {
                            x.css.style(this.container, { display: 'none' });
                        }
                    }
                };
            }
            else if (options.type == 'plus') {
                window[name] = {
                    name: name,
                    options: options,
                    container: null,
                    create: function (text) {
                        this.options.text = text;
                    },
                    show: function () {
                        if (!x.isUndefined(arguments[0])) {
                            this.options.text = arguments[0];
                        }
                        this.create(this.options.text);
                        this.container = plus.nativeUI.showWaiting(this.options.text);
                    },
                    hide: function () {
                        if (this.container != null) {
                            this.container.close();
                        }
                    }
                };
            }
            else {
                window[name] = {
                    name: name,
                    options: options,
                    maskWrapper: null,
                    container: null,
                    message: null,
                    lock: 0,
                    maxOpacity: options.maxOpacity ? options.maxOpacity : 0.4,
                    maxDuration: options.maxDuration ? options.maxDuration : 0.2,
                    height: options.height ? options.height : 50,
                    width: options.width ? options.width : 200,
                    setPosition: function () {
                        var range = x.page.getRange();
                        var pointX = (range.width - this.width) / 2;
                        var pointY = (range.height - this.height) / 3;
                        x.dom.fixed(this.container, pointX, pointY);
                    },
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
                            });
                        }
                    },
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
                    show: function (text) {
                        this.lock++;
                        var that = this;
                        if (that.lock > 0) {
                            if (that.maskWrapper === null) {
                                that.maskWrapper = x.ui.mask.newMaskWrapper(that.name + '-maskWrapper');
                            }
                            if (typeof (text) !== 'undefined') {
                                that.options.text = text;
                            }
                            that.create(that.options.text);
                            var range = x.page.getRange();
                            var pointX = (range.width - that.width) / 2;
                            var pointY = 120;
                            x.dom.fixed(that.container, pointX, pointY);
                            that.container.style.display = '';
                            that.maskWrapper.style.display = '';
                        }
                    },
                    hide: function () {
                        this.lock--;
                        if (this.lock === 0) {
                            if (this.container != null) {
                                this.container.style.display = 'none';
                            }
                            if (this.maskWrapper != null && x.dom('#' + this.name + '-maskWrapper').css('display') !== 'none') {
                                var that = this;
                                x.dom('#' + that.name + '-maskWrapper').css({ display: 'none' });
                            }
                        }
                    }
                };
            }
        }
        else {
            window[name].options = options;
        }
        return window[name];
    },
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
var keys = ["access-token", "client-id", "client-signature", "timestamp", "nonce"];
for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var camelName = x.camelCase(key);
    camelName = camelName[0].toUpperCase() + camelName.substr(1);
    defaults['get' + camelName] = function () {
        return localStorage['session-' + key] || (x.query('session-' + key) == null ? null : x.query('session-' + key).value) || '';
    };
}
var self = {
    getWaitingWindow: function (options) {
        return defaults.getWaitingWindow(options);
    },
    xhr: function () {
        var url, xhrDataValue, options;
        if (arguments.length == 2 && x.type(arguments[1]) === 'object') {
            url = arguments[0];
            options = arguments[1];
            xhrDataValue = '';
        }
        else if (arguments.length == 2 && x.type(arguments[1]) === 'string') {
            url = arguments[0];
            options = {};
            xhrDataValue = arguments[1];
        }
        else if (arguments.length == 3 && x.type(arguments[1]) === 'string' && x.isFunction(arguments[2])) {
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
        var enableWaitingWindow = x.isFunction(options.getWaitingWindow)
            && !x.isUndefined(options.waitingMessage)
            && options.waitingMessage !== '';
        if (enableWaitingWindow) {
            options.getWaitingWindow({ text: options.waitingMessage, type: x.isUndefined(options.waitingType, 'default') }).show();
        }
        var type = options.type || 'POST';
        var contentType = options.contentType || 'text/html';
        var async = options.async || true;
        var data = x.extend({}, options.data || {});
        if (x.type(xhrDataValue) === 'object') {
            data = x.extend(data, xhrDataValue);
        }
        else {
            var xml = x.toXML(xhrDataValue, 1);
            if (xhrDataValue != '' && xml) {
                data[options.xhrDataKey] = xhrDataValue;
            }
            else if (!xml && xhrDataValue.indexOf('=') > 0) {
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
        self.ajax({
            type: type,
            url: url,
            contentType: contentType,
            data: data,
            async: async,
            success: function (response) {
                if (enableWaitingWindow) {
                    options.getWaitingWindow({ type: x.isUndefined(options.waitingType, 'default') }).hide();
                }
                if (options.returnType == 'json') {
                    options.catchException(response, options.outputException);
                    var result = x.toJSON(response);
                    if (x.isUndefined(result) || x.isUndefined(result.message)) {
                        x.call(options.callback, x.toJSON(response));
                    }
                    else {
                        var message = result.message;
                        switch (Number(message.returnCode)) {
                            case -1:
                                x.msg(message.value);
                                break;
                            case 0:
                                if (!!options.popCorrectValue) {
                                    x.msg(message.value);
                                }
                                x.call(options.callback, x.toJSON(response));
                                break;
                            default:
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
    requireLoaded: {},
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
    newHttpRequest: function (options) {
        var request = {
            xhr: null,
            data: null,
            timeout: 90,
            done: false,
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
                    if (xhr.readyState == 4 && !me.done) {
                        if (xhr.status == 0 || (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                            x.call(me.success, xhr.responseText);
                        }
                        else {
                            x.call(me.error, xhr, xhr.status);
                        }
                        xhr = null;
                    }
                });
                setTimeout(function () { me.done = true; }, me.timeout * 1000);
                if (this.type == 'POST') {
                    this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    this.xhr.send(x.serialize(this.data));
                }
                else {
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
        request.create(options);
        return request;
    },
    newXmlHttpRequest: function () {
        var xhr = null;
        var global = x.global();
        if (global["ActiveXObject"]) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (ex) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        else if (global["XMLHttpRequest"]) {
            xhr = new XMLHttpRequest();
        }
        return xhr;
    },
    request: {
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
        getRawUrl: function () {
            return location.href.replace(location.origin, '');
        },
        hash: function (key) {
            return location.hash === ('#' + key) ? true : false;
        }
    }
};
var request_callback = function (response) {
    var result = x.toJSON(response).message;
    switch (Number(result.returnCode)) {
        case 0:
            break;
        case -1:
        case 1:
            x.msg(result.value);
            break;
        default:
            x.msg(result.value);
            break;
    }
};
module.exports = self;

},{"./base":2,"./event":15}],17:[function(require,module,exports){
"use strict";
var x = require("./base");
var string = require("./string");
var self = {
    rules: {
        'trim': /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        'date': /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/g,
        'url': "^((https|http|ftp|rtsp|mms)?://)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$",
        'telephone': /(^\d+$)|((^\d+)([\d|\-]+)((\d+)$))|((^\+)([\d|\-]+)((\d+)$))/g,
        'non-telephone': /[^\d\-\+]/g,
        'email': /^\w+((-\w+)|(\_\w+)|(\'\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g,
        'qq': /^\w+((-\w+)|(\_\w+)|(\'\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g,
        'number': /(^-?\d+$)|(^-?\d+[\.?]\d+$)/g,
        'non-number': /[^\d\.\-]/g,
        'integer': /^-?\d+$/g,
        'positive-integer': /^\d+$/g,
        'non-integer': /[^\d\-]/g,
        'safeText': /A-Za-z0-9_\-/g,
        'non-safeText': /[^A-Za-z0-9_\-]/g,
        'fileExt': 'jpg,gif,jpeg,png,bmp,psd,sit,tif,tiff,eps,png,ai,qxd,pdf,cdr,zip,rar',
        'en-us': {
            'zipcode': /^\d{5}-\d{4}$|^\d{5}$/g
        },
        'zh-cn': {
            'identityCard': /(^\d{15}$)|(^\d{18}$)|(^\d{17}[X|x]$)/g,
            'zipcode': /^\d{6}$/g
        }
    },
    match: function (options) {
        var text = String(options.text);
        var ignoreCase = options.ignoreCase;
        var regexpName = options.regexpName;
        var regexp = typeof (options.regexp) === 'undefined' ? undefined : new RegExp(options.regexp);
        if (ignoreCase === 1) {
            text = text.toLowerCase();
        }
        if (typeof (regexp) === 'undefined' && typeof (regexpName) !== 'undefined') {
            regexp = self.rules[regexpName];
        }
        return text.match(regexp);
    },
    exists: function (options) {
        var text = String(options.text);
        var ignoreCase = options.ignoreCase;
        var regexpName = options.regexpName;
        var regexp = typeof (options.regexp) === 'undefined' ? undefined : new RegExp(options.regexp);
        if (ignoreCase) {
            text = text.toLowerCase();
        }
        if (typeof (regexp) === 'undefined' && typeof (regexpName) !== 'undefined') {
            regexp = self.rules[regexpName];
        }
        return text.match(regexp) !== null;
    },
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
    isUrl: function (text) {
        return text.toLowerCase().exists(self.rules['url']);
    },
    isEmail: function (text) {
        return text.toLowerCase().exists(self.rules['email']);
    },
    isZipcode: function (text, nature) {
        nature = x.formatLocale(nature);
        return text.exists(self.rules[nature]['zipcode']);
    },
    isSafeText: function (text) {
        return text.exists(self.rules['safeText']);
    },
    formatTelephone: function (text) {
        return text.replace(self.rules['non-telephone'], '');
    },
    formatInteger: function (value, removePaddingZero) {
        value = String(value).replace(self.rules['non-integer'], '');
        if (string.trim(value) === '') {
            value = '0';
        }
        if (removePaddingZero) {
            value = String(parseInt(value, 10));
        }
        return value;
    },
    formatNumber: function (value, removePaddingZero) {
        if (removePaddingZero === void 0) { removePaddingZero = true; }
        value = String(value).replace(self.rules['non-number'], '');
        value = (value.trim() === '') ? '0' : value;
        if (removePaddingZero) {
            value = String(parseFloat(value));
        }
        return value;
    },
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
        if (removePaddingZero) {
            value = parseFloat(text);
        }
        return value;
    },
    formatNumberRound: function (value, length, removePaddingZero) {
        if (length === void 0) { length = 2; }
        if (removePaddingZero === void 0) { removePaddingZero = true; }
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
        if (removePaddingZero) {
            text = parseFloat(text).toString();
        }
        return text;
    },
    formatSafeText: function (text) {
        return text.replace(self.rules['non-safeText'], '');
    }
};
module.exports = self;

},{"./base":2,"./string":18}],18:[function(require,module,exports){
"use strict";
var x = require("./base");
var trimExpr = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
var self = {
    stringify: function (value) {
        var outString = '';
        var type = x.type(value);
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
                outString = '';
            }
        }
        else {
            outString = value;
        }
        return outString;
    },
    trim: function (text, trimText) {
        if (trimText === void 0) { trimText = undefined; }
        if (x.isUndefined(trimText)) {
            return text.replace(trimExpr, '');
        }
        else {
            return self.rtrim(self.ltrim(text, trimText), trimText);
        }
    },
    ltrim: function (text, trimText) {
        if (trimText === void 0) { trimText = undefined; }
        if (x.isUndefined(trimText)) {
            return text.replace(/(^[\s\uFEFF\xA0]+)/g, '');
        }
        else {
            return text.replace(RegExp('(^' + trimText.replace(/\\/g, '\\\\') + ')', 'gi'), '');
        }
    },
    rtrim: function (text, trimText) {
        if (trimText === void 0) { trimText = undefined; }
        if (x.isUndefined(trimText)) {
            return text.replace(/([\s\uFEFF\xA0]+$)/g, '');
        }
        else {
            return text.replace(RegExp('(' + trimText.replace(/\\/g, '\\\\') + '$)', 'gi'), '');
        }
    },
    format: function (text) {
        if (arguments.length == 0) {
            return null;
        }
        var text = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            text = text.replace(re, arguments[i]);
        }
        return text;
    },
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
};
module.exports = self;

},{"./base":2}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9iYXNlLmpzIiwibGliL2Jhc2UvU3RyaW5nQnVpbGRlci5qcyIsImxpYi9iYXNlL1RpbWVyLmpzIiwibGliL2Jhc2UvZGVjbGFyZS5qcyIsImxpYi9iYXNlL2tlcm5lbC5qcyIsImxpYi9iYXNlL2xhbmcuanMiLCJsaWIvY29sbGVjdGlvbnMvSGFzaHRhYmxlLmpzIiwibGliL2NvbGxlY3Rpb25zL1F1ZXVlLmpzIiwibGliL2NvbGxlY3Rpb25zL1N0YWNrLmpzIiwibGliL2NvbG9yLmpzIiwibGliL2Nvb2tpZXMuanMiLCJsaWIvZGF0ZS5qcyIsImxpYi9lbmNvZGluZy5qcyIsImxpYi9ldmVudC5qcyIsImxpYi9uZXQuanMiLCJsaWIvcmVnZXhwLmpzIiwibGliL3N0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi9saWIvYmFzZVwiKTtcclxudmFyIGV2ZW50ID0gcmVxdWlyZShcIi4vbGliL2V2ZW50XCIpO1xyXG52YXIgUXVldWUgPSByZXF1aXJlKFwiLi9saWIvY29sbGVjdGlvbnMvUXVldWVcIik7XHJcbnZhciBTdGFjayA9IHJlcXVpcmUoXCIuL2xpYi9jb2xsZWN0aW9ucy9TdGFja1wiKTtcclxudmFyIGNvbG9yID0gcmVxdWlyZShcIi4vbGliL2NvbG9yXCIpO1xyXG52YXIgY29va2llcyA9IHJlcXVpcmUoXCIuL2xpYi9jb29raWVzXCIpO1xyXG52YXIgZW5jb2RpbmcgPSByZXF1aXJlKFwiLi9saWIvZW5jb2RpbmdcIik7XHJcbnZhciByZWdleHAgPSByZXF1aXJlKFwiLi9saWIvcmVnZXhwXCIpO1xyXG52YXIgc3RyaW5nID0gcmVxdWlyZShcIi4vbGliL3N0cmluZ1wiKTtcclxudmFyIGRhdGUgPSByZXF1aXJlKFwiLi9saWIvZGF0ZVwiKTtcclxudmFyIG5ldCA9IHJlcXVpcmUoXCIuL2xpYi9uZXRcIik7XHJcbnZhciB4ID0gYmFzZS5leHRlbmQoe30sIGJhc2UsIHtcclxuICAgIGV2ZW50OiBldmVudCxcclxuICAgIHF1ZXVlOiBRdWV1ZSxcclxuICAgIHN0YWNrOiBTdGFjayxcclxuICAgIGNvbG9yOiBjb2xvcixcclxuICAgIGNvb2tpZXM6IGNvb2tpZXMsXHJcbiAgICBlbmNvZGluZzogZW5jb2RpbmcsXHJcbiAgICByZWdleHA6IHJlZ2V4cCxcclxuICAgIHN0cmluZzogc3RyaW5nLFxyXG4gICAgZGF0ZTogZGF0ZSxcclxuICAgIG9uOiBldmVudC5hZGQsXHJcbiAgICBuZXQ6IG5ldFxyXG59KTtcclxuYmFzZS5leHRlbmQoeCwge1xyXG4gICAgb246IGV2ZW50LmFkZCxcclxuICAgIG9mZjogZXZlbnQucmVtb3ZlLFxyXG4gICAgeGhyOiBuZXQueGhyXHJcbn0pO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHg7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbGFuZyA9IHJlcXVpcmUoXCIuL2Jhc2UvbGFuZ1wiKTtcclxudmFyIGtlcm5lbCA9IHJlcXVpcmUoXCIuL2Jhc2Uva2VybmVsXCIpO1xyXG52YXIgZGVjbGFyZSA9IHJlcXVpcmUoXCIuL2Jhc2UvZGVjbGFyZVwiKTtcclxudmFyIEhhc2h0YWJsZSA9IHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zL0hhc2h0YWJsZVwiKTtcclxudmFyIFF1ZXVlID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvUXVldWVcIik7XHJcbnZhciBTdGFjayA9IHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zL1N0YWNrXCIpO1xyXG52YXIgc2VsZiA9IGxhbmcuZXh0ZW5kKHt9LCBsYW5nLCBrZXJuZWwsIHtcclxuICAgIGRlY2xhcmU6IGRlY2xhcmUsXHJcbiAgICBxdWVyeTogZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGxhbmcudHlwZShzZWxlY3RvcikuaW5kZXhPZignaHRtbCcpID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChsYW5nLnR5cGUoc2VsZWN0b3IpID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcXVlcnlBbGw6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xyXG4gICAgICAgIGlmIChsYW5nLnR5cGUoc2VsZWN0b3IpLmluZGV4T2YoJ2h0bWwnKSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChsYW5nLnR5cGUoc2VsZWN0b3IpID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29sbGVjdGlvbnM6IHt9LFxyXG59KTtcclxudmFyIGNvbGxlY3Rpb25zID0ge1xyXG4gICAgSGFzaHRhYmxlOiBIYXNodGFibGUsXHJcbiAgICBRdWV1ZTogUXVldWUsXHJcbiAgICBTdGFjazogU3RhY2ssXHJcbn07XHJcbmxhbmcuZXh0ZW5kKHNlbGYuY29sbGVjdGlvbnMsIGNvbGxlY3Rpb25zKTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgU3RyaW5nQnVpbGRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTdHJpbmdCdWlsZGVyKCkge1xyXG4gICAgICAgIHRoaXMuaW5uZXJBcnJheSA9IFtdO1xyXG4gICAgfVxyXG4gICAgU3RyaW5nQnVpbGRlci5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICB0aGlzLmlubmVyQXJyYXlbdGhpcy5pbm5lckFycmF5Lmxlbmd0aF0gPSB0ZXh0O1xyXG4gICAgfTtcclxuICAgIFN0cmluZ0J1aWxkZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlubmVyQXJyYXkuam9pbignJyk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFN0cmluZ0J1aWxkZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuU3RyaW5nQnVpbGRlciA9IFN0cmluZ0J1aWxkZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB0aW1lcnMgPSB7fTtcclxudmFyIG5hbWVQcmVmaXggPSAndGltZXIkJztcclxudmFyIFRpbWVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFRpbWVyKGludGVydmFsLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMudGltZXJJZCA9IC0xO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVQcmVmaXggKyBNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDkwMDAwMDAwMCArIDEwMDAwMDAwMCk7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsICogMTAwMDtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgICBUaW1lci5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sodGhpcyk7XHJcbiAgICB9O1xyXG4gICAgVGltZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0aGF0ID0gKHRpbWVyc1t0aGlzLm5hbWVdID0gdGhpcyk7XHJcbiAgICAgICAgdGhpcy50aW1lcklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aW1lcnNbdGhhdC5uYW1lXS5ydW4oKTtcclxuICAgICAgICB9LCB0aGlzLmludGVydmFsKTtcclxuICAgIH07XHJcbiAgICBUaW1lci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJZCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFRpbWVyO1xyXG59KCkpO1xyXG5leHBvcnRzLlRpbWVyID0gVGltZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbGFuZyA9IHJlcXVpcmUoXCIuL2xhbmdcIik7XHJcbnZhciBrZXJuZWwgPSByZXF1aXJlKFwiLi9rZXJuZWxcIik7XHJcbnZhciB4dG9yID0gZnVuY3Rpb24gKCkgeyB9O1xyXG52YXIgb3AgPSBPYmplY3QucHJvdG90eXBlLCBvcHRzID0gb3AudG9TdHJpbmcsIGNuYW1lID0gXCJjb25zdHJ1Y3RvclwiO1xyXG5mdW5jdGlvbiBmb3JjZU5ldyhjdG9yKSB7XHJcbiAgICB4dG9yLnByb3RvdHlwZSA9IGN0b3IucHJvdG90eXBlO1xyXG4gICAgdmFyIHQgPSBuZXcgeHRvcjtcclxuICAgIHh0b3IucHJvdG90eXBlID0gbnVsbDtcclxuICAgIHJldHVybiB0O1xyXG59XHJcbmZ1bmN0aW9uIGFwcGx5TmV3KGFyZ3MpIHtcclxuICAgIHZhciBjdG9yID0gYXJncy5jYWxsZWUsIHQgPSBmb3JjZU5ldyhjdG9yKTtcclxuICAgIGN0b3IuYXBwbHkodCwgYXJncyk7XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5mdW5jdGlvbiBjaGFpbmVkQ29uc3RydWN0b3IoYmFzZXMsIGN0b3JTcGVjaWFsKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhID0gYXJndW1lbnRzLCBhcmdzID0gYSwgYTAgPSBhWzBdLCBmLCBpLCBtLCBsID0gYmFzZXMubGVuZ3RoLCBwcmVBcmdzO1xyXG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBhLmNhbGxlZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFwcGx5TmV3KGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3RvclNwZWNpYWwgJiYgKGEwICYmIGEwLnByZWFtYmxlIHx8IHRoaXMucHJlYW1ibGUpKSB7XHJcbiAgICAgICAgICAgIHByZUFyZ3MgPSBuZXcgQXJyYXkoYmFzZXMubGVuZ3RoKTtcclxuICAgICAgICAgICAgcHJlQXJnc1swXSA9IGE7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7Oykge1xyXG4gICAgICAgICAgICAgICAgYTAgPSBhWzBdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IGEwLnByZWFtYmxlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBmLmFwcGx5KHRoaXMsIGEpIHx8IGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZiA9IGJhc2VzW2ldLnByb3RvdHlwZTtcclxuICAgICAgICAgICAgICAgIGYgPSBmLmhhc093blByb3BlcnR5KFwicHJlYW1ibGVcIikgJiYgZi5wcmVhbWJsZTtcclxuICAgICAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYSA9IGYuYXBwbHkodGhpcywgYSkgfHwgYTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgrK2kgPT0gbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJlQXJnc1tpXSA9IGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChpID0gbCAtIDE7IGkgPj0gMDsgLS1pKSB7XHJcbiAgICAgICAgICAgIGYgPSBiYXNlc1tpXTtcclxuICAgICAgICAgICAgbSA9IGYuX21ldGE7XHJcbiAgICAgICAgICAgIGYgPSBtID8gbS5jdG9yIDogZjtcclxuICAgICAgICAgICAgaWYgKGYpIHtcclxuICAgICAgICAgICAgICAgIGYuYXBwbHkodGhpcywgcHJlQXJncyA/IHByZUFyZ3NbaV0gOiBhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmID0gdGhpcy5wb3N0c2NyaXB0O1xyXG4gICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgIGYuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBzaW5nbGVDb25zdHJ1Y3RvcihjdG9yLCBjdG9yU3BlY2lhbCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYSA9IGFyZ3VtZW50cywgdCA9IGEsIGEwID0gYVswXSwgZjtcclxuICAgICAgICBpZiAoY3RvclNwZWNpYWwpIHtcclxuICAgICAgICAgICAgaWYgKGEwKSB7XHJcbiAgICAgICAgICAgICAgICBmID0gYTAucHJlYW1ibGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgICAgIHQgPSBmLmFwcGx5KHRoaXMsIHQpIHx8IHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZiA9IHRoaXMucHJlYW1ibGU7XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBmLmFwcGx5KHRoaXMsIHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdG9yKSB7XHJcbiAgICAgICAgICAgIGN0b3IuYXBwbHkodGhpcywgYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGYgPSB0aGlzLnBvc3RzY3JpcHQ7XHJcbiAgICAgICAgaWYgKGYpIHtcclxuICAgICAgICAgICAgZi5hcHBseSh0aGlzLCBhKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIHNpbXBsZUNvbnN0cnVjdG9yKGJhc2VzKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhID0gYXJndW1lbnRzLCBpID0gMCwgZiwgbTtcclxuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYS5jYWxsZWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcHBseU5ldyhhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICg7IGYgPSBiYXNlc1tpXTsgKytpKSB7XHJcbiAgICAgICAgICAgIG0gPSBmLl9tZXRhO1xyXG4gICAgICAgICAgICBmID0gbSA/IG0uY3RvciA6IGY7XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBmLmFwcGx5KHRoaXMsIGEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZiA9IHRoaXMucG9zdHNjcmlwdDtcclxuICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICBmLmFwcGx5KHRoaXMsIGEpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gY2hhaW4obmFtZSwgYmFzZXMsIHJldmVyc2VkKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBiLCBtLCBmLCBpID0gMCwgc3RlcCA9IDE7XHJcbiAgICAgICAgaWYgKHJldmVyc2VkKSB7XHJcbiAgICAgICAgICAgIGkgPSBiYXNlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICBzdGVwID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoOyBiID0gYmFzZXNbaV07IGkgKz0gc3RlcCkge1xyXG4gICAgICAgICAgICBtID0gYi5fbWV0YTtcclxuICAgICAgICAgICAgZiA9IChtID8gbS5oaWRkZW4gOiBiLnByb3RvdHlwZSlbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbnZhciBkZWNsYXJlID0gZnVuY3Rpb24gKGNsYXNzTmFtZSwgc3VwZXJjbGFzcywgcHJvcHMpIHtcclxuICAgIHZhciBjbGFzc05hbWUsIHN1cGVyY2xhc3MsIHByb3BzO1xyXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgIGNsYXNzTmFtZSA9IG51bGw7XHJcbiAgICAgICAgc3VwZXJjbGFzcyA9IG51bGw7XHJcbiAgICAgICAgcHJvcHMgPSBhcmd1bWVudHNbMF0gfHwge307XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIpIHtcclxuICAgICAgICBpZiAobGFuZy5pc1N0cmluZyhhcmd1bWVudHNbMF0pKSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGFyZ3VtZW50c1swXSB8fCB7fTtcclxuICAgICAgICAgICAgc3VwZXJjbGFzcyA9IG51bGw7XHJcbiAgICAgICAgICAgIHByb3BzID0gYXJndW1lbnRzWzFdIHx8IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gbnVsbDtcclxuICAgICAgICAgICAgc3VwZXJjbGFzcyA9IGFyZ3VtZW50c1swXSB8fCB7fTtcclxuICAgICAgICAgICAgcHJvcHMgPSBhcmd1bWVudHNbMV0gfHwge307XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAzKSB7XHJcbiAgICAgICAgY2xhc3NOYW1lID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIHN1cGVyY2xhc3MgPSBhcmd1bWVudHNbMV0gfHwge307XHJcbiAgICAgICAgcHJvcHMgPSBhcmd1bWVudHNbMl0gfHwge307XHJcbiAgICB9XHJcbiAgICB2YXIgcHJvdG8sIHQsIGN0b3I7XHJcbiAgICBjdG9yID0gZnVuY3Rpb24gKCkgeyB9O1xyXG4gICAgcHJvdG8gPSB7fTtcclxuICAgIGlmIChsYW5nLmlzQXJyYXkoc3VwZXJjbGFzcykpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1cGVyY2xhc3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGFuZy5leHRlbmQocHJvdG8sIHN1cGVyY2xhc3NbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHN1cGVyY2xhc3MgIT0gbnVsbCkge1xyXG4gICAgICAgIGxhbmcuZXh0ZW5kKHByb3RvLCBzdXBlcmNsYXNzKTtcclxuICAgIH1cclxuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHByb3BzKSB7XHJcbiAgICAgICAgY3Rvci5wcm90b3R5cGVbcHJvcGVydHldID0gcHJvcHNbcHJvcGVydHldO1xyXG4gICAgICAgIGxhbmcuZXh0ZW5kKHByb3RvLCBwcm9wcyk7XHJcbiAgICB9XHJcbiAgICB0ID0gcHJvcHMuY29uc3RydWN0b3I7XHJcbiAgICBpZiAodCAhPT0gb3AuY29uc3RydWN0b3IpIHtcclxuICAgICAgICB0Lm5vbSA9IGNuYW1lO1xyXG4gICAgICAgIHByb3RvLmNvbnN0cnVjdG9yID0gdDtcclxuICAgIH1cclxuICAgIGN0b3IgPSBzaW5nbGVDb25zdHJ1Y3Rvcihwcm9wcy5jb25zdHJ1Y3RvciwgdCk7XHJcbiAgICBjdG9yLl9tZXRhID0ge1xyXG4gICAgICAgIGhpZGRlbjogcHJvcHMsXHJcbiAgICAgICAgY3RvcjogcHJvcHMuY29uc3RydWN0b3JcclxuICAgIH07XHJcbiAgICBjdG9yLnN1cGVyY2xhc3MgPSBzdXBlcmNsYXNzICYmIHN1cGVyY2xhc3MucHJvdG90eXBlO1xyXG4gICAgY3Rvci5wcm90b3R5cGUgPSBwcm90bztcclxuICAgIHByb3RvLmNvbnN0cnVjdG9yID0gY3RvcjtcclxuICAgIGlmIChjbGFzc05hbWUpIHtcclxuICAgICAgICBjdG9yLnByb3RvdHlwZS5kZWNsYXJlZENsYXNzID0gY2xhc3NOYW1lO1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IGNsYXNzTmFtZS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgdmFyIG5hbWVfMSA9IHBhcnRzLnBvcCgpO1xyXG4gICAgICAgIHZhciBjb250ZXh0ID0gcGFydHMubGVuZ3RoID09IDAgPyBrZXJuZWwuZ2xvYmFsKCkgOiBrZXJuZWwucmVnaXN0ZXIocGFydHMuam9pbignLicpKTtcclxuICAgICAgICBjb250ZXh0W25hbWVfMV0gPSBjdG9yO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGN0b3I7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gZGVjbGFyZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBsYW5nID0gcmVxdWlyZShcIi4vbGFuZ1wiKTtcclxudmFyIFN0cmluZ0J1aWxkZXJfMSA9IHJlcXVpcmUoXCIuL1N0cmluZ0J1aWxkZXJcIik7XHJcbnZhciBUaW1lcl8xID0gcmVxdWlyZShcIi4vVGltZXJcIik7XHJcbnZhciBsb2NhbGVzID0geyBcImVuLXVzXCI6IFwiZW4tdXNcIiwgXCJ6aC1jblwiOiBcInpoLWNuXCIsIFwiemgtdHdcIjogXCJ6aC10d1wiIH07XHJcbnZhciBkZWZhdWx0TG9jYWxlTmFtZSA9ICd6aC1jbic7XHJcbnZhciBzZWxmID0ge1xyXG4gICAgZ2xvYmFsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogZ2xvYmFsO1xyXG4gICAgfSxcclxuICAgIGlzQnJvd2VyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGxhbmcudHlwZShzZWxmLmdsb2JhbCgpKSA9PT0gJ3dpbmRvdyc7XHJcbiAgICB9LFxyXG4gICAgaXNOb2RlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGxhbmcudHlwZShzZWxmLmdsb2JhbCgpKSA9PT0gJ2dsb2JhbCc7XHJcbiAgICB9LFxyXG4gICAgZXJyb3I6IGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcclxuICAgIH0sXHJcbiAgICBzY3JpcHRGcmFnbWVudDogJzxzY3JpcHRbXj5dKj4oW1xcXFxTXFxcXHNdKj8pPFxcL3NjcmlwdD4nLFxyXG4gICAganNvbkZpbHRlcjogL15cXC9cXCotc2VjdXJlLShbXFxzXFxTXSopXFwqXFwvXFxzKiQvLFxyXG4gICAgcXVpY2tFeHByOiAvXltePF0qKDwoLnxcXHMpKz4pW14+XSokfF4jKFtcXHctXSspJC8sXHJcbiAgICBpc1NpbXBsZTogL14uW146I1xcW1xcLixdKiQvLFxyXG4gICAgbm9vcDogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHZhciBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICB2YXIgcm9vdCA9IHNlbGYuZ2xvYmFsKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGFuZy5pc1VuZGVmaW5lZChyb290W3BhcnRzW2ldXSkpIHtcclxuICAgICAgICAgICAgICAgIHJvb3RbcGFydHNbaV1dID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcm9vdCA9IHJvb3RbcGFydHNbaV1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm9vdDtcclxuICAgIH0sXHJcbiAgICBpbnZva2U6IGZ1bmN0aW9uIChvYmplY3QsIGZuKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDIpO1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseShvYmplY3QsIGFyZ3MpO1xyXG4gICAgfSxcclxuICAgIGNhbGw6IGZ1bmN0aW9uIChhbnl0aGluZykge1xyXG4gICAgICAgIGlmICghbGFuZy5pc1VuZGVmaW5lZChhbnl0aGluZykpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmIChsYW5nLmlzRnVuY3Rpb24oYW55dGhpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbnl0aGluZy5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxhbmcudHlwZShhbnl0aGluZykgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFueXRoaW5nICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZhbChhbnl0aGluZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ3VpZDoge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGZvcm1hdCwgaXNVcHBlckNhc2UpIHtcclxuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gdm9pZCAwKSB7IGZvcm1hdCA9ICctJzsgfVxyXG4gICAgICAgICAgICB2YXIgdGV4dCA9ICcnO1xyXG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gKCgoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMCkgfCAwKS50b1N0cmluZygxNikuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwICYmIGkgPCA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJy0nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgKz0gJy0nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0ID0gaXNVcHBlckNhc2UgPyB0ZXh0LnRvVXBwZXJDYXNlKCkgOiB0ZXh0LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByYW5kb21UZXh0OiB7XHJcbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAobGVuZ3RoLCBidWZmZXIpIHtcclxuICAgICAgICAgICAgaWYgKGxlbmd0aCA9PT0gdm9pZCAwKSB7IGxlbmd0aCA9IDg7IH1cclxuICAgICAgICAgICAgaWYgKGJ1ZmZlciA9PT0gdm9pZCAwKSB7IGJ1ZmZlciA9IFwiMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eXp4XCI7IH1cclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gYnVmZmVyLmNoYXJBdChNYXRoLmNlaWwoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMCkgJSBidWZmZXIubGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBub25jZTogZnVuY3Rpb24gKGxlbmd0aCkge1xyXG4gICAgICAgIGlmIChsZW5ndGggPT09IHZvaWQgMCkgeyBsZW5ndGggPSA2OyB9XHJcbiAgICAgICAgcmV0dXJuIE51bWJlcihzZWxmLnJhbmRvbVRleHQuY3JlYXRlKDEsICcxMjM0NTY3ODknKSArIHNlbGYucmFuZG9tVGV4dC5jcmVhdGUobGVuZ3RoIC0gMSwgJzAxMjM0NTY3ODknKSk7XHJcbiAgICB9LFxyXG4gICAgc2VyaWFsaXplOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHZhciBidWZmZXIgPSBbXSwgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxhbmcuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaChkYXRhW2ldLm5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtpXS52YWx1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKG5hbWUgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoZGF0YVtuYW1lXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBidWZmZXIuam9pbignJicpO1xyXG4gICAgfSxcclxuICAgIGVhY2g6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBuYW1lLCBpID0gMCwgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxhbmcuaXNBcnJheShkYXRhKSB8fCBsYW5nLnR5cGUoZGF0YSkgPT0gJ25vZGVsaXN0Jykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciB2YWx1ZSA9IGRhdGFbMF07IGkgPCBsZW5ndGggJiYgY2FsbGJhY2suY2FsbCh2YWx1ZSwgaSwgdmFsdWUpICE9IGZhbHNlOyB2YWx1ZSA9IGRhdGFbKytpXSkgeyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKG5hbWUgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoZGF0YVtuYW1lXSwgbmFtZSwgZGF0YVtuYW1lXSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9LFxyXG4gICAgdG9YTUw6IGZ1bmN0aW9uICh0ZXh0LCBoaWRlRXJyb3IpIHtcclxuICAgICAgICBpZiAoaGlkZUVycm9yID09PSB2b2lkIDApIHsgaGlkZUVycm9yID0gZmFsc2U7IH1cclxuICAgICAgICBpZiAobGFuZy50eXBlKHRleHQpID09PSAneG1sZG9jdW1lbnQnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGFuZy5pc1VuZGVmaW5lZCh0ZXh0KSB8fCB0ZXh0ID09PSAnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZ2xvYmFsID0gc2VsZi5nbG9iYWwoKTtcclxuICAgICAgICB2YXIgZG9jO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChnbG9iYWxbXCJET01QYXJzZXJcIl0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcbiAgICAgICAgICAgICAgICBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHQsIFwidGV4dC94bWxcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZ2xvYmFsW1wiQWN0aXZlWE9iamVjdFwiXSkge1xyXG4gICAgICAgICAgICAgICAgZG9jID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MRE9NXCIpO1xyXG4gICAgICAgICAgICAgICAgZG9jLmFzeW5jID0gXCJmYWxzZVwiO1xyXG4gICAgICAgICAgICAgICAgZG9jLmxvYWRYTUwodGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgIGRvYyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKCFoaWRlRXJyb3IpXHJcbiAgICAgICAgICAgICAgICBzZWxmLmRlYnVnLmVycm9yKCd7XCJtZXRob2RcIjpcIngudG9YTUwodGV4dClcIiwgXCJhcmd1bWVudHNcIjp7XCJ0ZXh0XCI6XCInICsgdGV4dCArICdcIn0nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFkb2MgfHwgZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicGFyc2VyZXJyb3JcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGRvYyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKCFoaWRlRXJyb3IpXHJcbiAgICAgICAgICAgICAgICBzZWxmLmRlYnVnLmVycm9yKCd7XCJtZXRob2RcIjpcIngudG9YTUwodGV4dClcIiwgXCJhcmd1bWVudHNcIjp7XCJ0ZXh0XCI6XCInICsgdGV4dCArICdcIn0nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRvYztcclxuICAgIH0sXHJcbiAgICB0b0pTT046IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgaWYgKGxhbmcudHlwZSh0ZXh0KSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsYW5nLmlzVW5kZWZpbmVkKHRleHQpIHx8IHRleHQgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBoaWRlRXJyb3IgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIChKU09OKSA/IEpTT04ucGFyc2UodGV4dCkgOiAoRnVuY3Rpb24oXCJyZXR1cm4gXCIgKyB0ZXh0KSkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKEZ1bmN0aW9uKFwicmV0dXJuIFwiICsgdGV4dCkpKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGV4MSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoaWRlRXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWJ1Zy5lcnJvcigne1wibWV0aG9kXCI6XCJ4LnRvSlNPTih0ZXh0KVwiLCBcImFyZ3VtZW50c1wiOntcInRleHRcIjpcIicgKyB0ZXh0ICsgJ1wifScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0b1NhZmVKU09OOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHZhciBvdXRTdHJpbmcgPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoID0gdGV4dC5zdWJzdHIoaSwgMSk7XHJcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJ1wiJyB8fCBjaCA9PT0gJ1xcJycgfHwgY2ggPT09ICdcXFxcJyB8fCBjaCA9PT0gJ1xcLycpIHtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSAnXFxcXCc7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gY2g7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09ICdcXGInKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gJ1xcXFxiJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gJ1xcZicpIHtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSAnXFxcXGYnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSAnXFxuJykge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9ICdcXFxcbic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09ICdcXHInKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gJ1xcXFxyJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gJ1xcdCcpIHtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSAnXFxcXHQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IGNoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRTdHJpbmc7XHJcbiAgICB9LFxyXG4gICAgdG9TYWZlTGlrZTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9cXFsvZywgJ1tbXScpLnJlcGxhY2UoLyUvZywgJ1slXScpLnJlcGxhY2UoL18vZywgJ1tfXScpO1xyXG4gICAgfSxcclxuICAgIGNkYXRhOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHJldHVybiAnPCFbQ0RBVEFbJyArIHRleHQgKyAnXV0+JztcclxuICAgIH0sXHJcbiAgICBjYW1lbENhc2U6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgdmFyIHJtc1ByZWZpeCA9IC9eLW1zLS8sIHJkYXNoQWxwaGEgPSAvLShbXFxkYS16XSkvZ2k7XHJcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShybXNQcmVmaXgsIFwibXMtXCIpLnJlcGxhY2UocmRhc2hBbHBoYSwgZnVuY3Rpb24gKGFsbCwgbGV0dGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBwYWRkaW5nWmVybzogZnVuY3Rpb24gKG51bWJlciwgbGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuIChBcnJheShsZW5ndGgpLmpvaW4oJzAnKSArIG51bWJlcikuc2xpY2UoLWxlbmd0aCk7XHJcbiAgICB9LFxyXG4gICAgZm9ybWF0TG9jYWxlOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHZhciBsb2NhbGUgPSBsb2NhbGVzW3RleHQudG9Mb3dlckNhc2UoKV07XHJcbiAgICAgICAgcmV0dXJuIGxvY2FsZSA/IGxvY2FsZSA6IGRlZmF1bHRMb2NhbGVOYW1lO1xyXG4gICAgfSxcclxuICAgIGdldEZyaWVuZGx5TmFtZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gc2VsZi5jYW1lbENhc2UoKCd4XycgKyBuYW1lKS5yZXBsYWNlKC9bXFwjXFwkXFwuXFwvXFxcXFxcOlxcP1xcPV0vZywgJ18nKS5yZXBsYWNlKC9bLV0rL2csICdfJykpO1xyXG4gICAgfSxcclxuICAgIFN0cmluZ0J1aWxkZXI6IFN0cmluZ0J1aWxkZXJfMS5TdHJpbmdCdWlsZGVyLFxyXG4gICAgVGltZXI6IFRpbWVyXzEuVGltZXIsXHJcbiAgICB0aW1lcnM6IHt9LFxyXG4gICAgbmV3VGltZXI6IGZ1bmN0aW9uIChpbnRlcnZhbCwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgdGltZXIgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICd0aW1lciQnICsgTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiA5MDAwMDAwMDAgKyAxMDAwMDAwMDApLFxyXG4gICAgICAgICAgICBpbnRlcnZhbDogaW50ZXJ2YWwgKiAxMDAwLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXHJcbiAgICAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gc2VsZi50aW1lcnNbdGhpcy5uYW1lXSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVySWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IHNlbGYudGltZXJzW3RoYXQubmFtZV0ucnVuKCk7IH0sIHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXJJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aW1lcjtcclxuICAgIH0sXHJcbiAgICBkZWJ1Zzoge1xyXG4gICAgICAgIGxvZzogZnVuY3Rpb24gKG9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAoIWxhbmcuaXNVbmRlZmluZWQoY29uc29sZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHdhcm46IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKCFsYW5nLmlzVW5kZWZpbmVkKGNvbnNvbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4ob2JqZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKCFsYW5nLmlzVW5kZWZpbmVkKGNvbnNvbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKG9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGFzc2VydDogZnVuY3Rpb24gKGV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgaWYgKCFsYW5nLmlzVW5kZWZpbmVkKGNvbnNvbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChleHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGltZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKCFsYW5nLmlzVW5kZWZpbmVkKGNvbnNvbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRpbWUobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpbWVFbmQ6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICghbGFuZy5pc1VuZGVmaW5lZChjb25zb2xlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aW1lc3RhbXA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGZvcm1hdCA9ICd7eXl5eS1NTS1kZCBISDptbTpzcy5mZmZ9JztcclxuICAgICAgICAgICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgveXl5eS8sIHRpbWVzdGFtcC5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvTU0vLCAodGltZXN0YW1wLmdldE1vbnRoKCkgKyAxKSA+IDkgPyAodGltZXN0YW1wLmdldE1vbnRoKCkgKyAxKS50b1N0cmluZygpIDogJzAnICsgKHRpbWVzdGFtcC5nZXRNb250aCgpICsgMSkpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvZGR8REQvLCB0aW1lc3RhbXAuZ2V0RGF0ZSgpID4gOSA/IHRpbWVzdGFtcC5nZXREYXRlKCkudG9TdHJpbmcoKSA6ICcwJyArIHRpbWVzdGFtcC5nZXREYXRlKCkpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvaGh8SEgvLCB0aW1lc3RhbXAuZ2V0SG91cnMoKSA+IDkgPyB0aW1lc3RhbXAuZ2V0SG91cnMoKS50b1N0cmluZygpIDogJzAnICsgdGltZXN0YW1wLmdldEhvdXJzKCkpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvbW0vLCB0aW1lc3RhbXAuZ2V0TWludXRlcygpID4gOSA/IHRpbWVzdGFtcC5nZXRNaW51dGVzKCkudG9TdHJpbmcoKSA6ICcwJyArIHRpbWVzdGFtcC5nZXRNaW51dGVzKCkpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvc3N8U1MvLCB0aW1lc3RhbXAuZ2V0U2Vjb25kcygpID4gOSA/IHRpbWVzdGFtcC5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKSA6ICcwJyArIHRpbWVzdGFtcC5nZXRTZWNvbmRzKCkpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvZmZmL2csICgodGltZXN0YW1wLmdldE1pbGxpc2Vjb25kcygpID4gOTkpID8gdGltZXN0YW1wLmdldE1pbGxpc2Vjb25kcygpLnRvU3RyaW5nKCkgOiAodGltZXN0YW1wLmdldE1pbGxpc2Vjb25kcygpID4gOSkgPyAnMCcgKyB0aW1lc3RhbXAuZ2V0TWlsbGlzZWNvbmRzKCkgOiAnMDAnICsgdGltZXN0YW1wLmdldE1pbGxpc2Vjb25kcygpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IHNlbGY7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIHR5cGU6IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChvYmplY3QpID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd1bmRlZmluZWQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYmplY3QgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnbnVsbCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC9cXFtvYmplY3QgKFtBLVphLXpdKylcXF0vLmV4ZWMoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkpWzFdLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiBSYW5nZUVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJy4uLic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhyb3cgZXg7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uIChvYmplY3QpIHsgfSxcclxuICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uIChvYmplY3QpIHsgfSxcclxuICAgIGlzU3RyaW5nOiBmdW5jdGlvbiAob2JqZWN0KSB7IH0sXHJcbiAgICBpc051bWJlcjogZnVuY3Rpb24gKG9iamVjdCkgeyB9LFxyXG4gICAgaXNVbmRlZmluZWQ6IGZ1bmN0aW9uIChvYmplY3QpIHsgfSxcclxuICAgIGV4dGVuZDogZnVuY3Rpb24gKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgdmFyIHNvdXJjZSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgICAgICAgIHNvdXJjZVtfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGFyZ3VtZW50c1swXSB8fCB7fTtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDEsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBhcmd1bWVudHNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcHJvcGVydHldID0gYXJndW1lbnRzW2ldW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIGNsb25lOiBmdW5jdGlvbiAob2JqZWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuZXh0ZW5kKHt9LCBvYmplY3QpO1xyXG4gICAgfSxcclxuICAgIEV2ZW50VGFyZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVycyA9IHt9O1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHR5cGUgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIGxpc3RlbmVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5ldmVudExpc3RlbmVyc1t0eXBlXSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnNbdHlwZV0gPSBbbGlzdGVuZXJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyc1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5ldmVudExpc3RlbmVyc1t0eXBlXTtcclxuICAgICAgICAgICAgaWYgKGxpc3RlbmVycyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0gPT09IGxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsaXN0ZW5lciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbGlzID0gMCwgbGVua2V5ID0gbGlzdGVuZXIubGVuZ3RoOyBsaXMgPCBsZW5rZXk7IGxpcyArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kKHR5cGUsIGxpc3RlbmVyW2xlbmtleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJzW3R5cGVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5maXJlID0gZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGUgJiYgdGhpcy5ldmVudExpc3RlbmVyc1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50cyA9IHsgdHlwZTogdHlwZSwgdGFyZ2V0OiB0aGlzIH07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBsZW5ndGggPSB0aGlzLl9saXN0ZW5lclt0eXBlXS5sZW5ndGgsIHN0YXJ0ID0gMDsgc3RhcnQgPCBsZW5ndGg7IHN0YXJ0ICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzW3R5cGVdW3N0YXJ0XS5jYWxsKHRoaXMsIGV2ZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcclxudmFyIHR5cGVzID0gW1wiQXJyYXlcIiwgXCJGdW5jdGlvblwiLCBcIlN0cmluZ1wiLCBcIk51bWJlclwiLCBcIlVuZGVmaW5lZFwiXTtcclxudmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaSkge1xyXG4gICAgc2VsZlsnaXMnICsgdHlwZXNbaV1dID0gZnVuY3Rpb24gKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLnR5cGUob2JqZWN0KSA9PT0gdHlwZXNbaV0udG9Mb3dlckNhc2UoKTtcclxuICAgIH07XHJcbn07XHJcbmZvciAodmFyIGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIF9sb29wXzEoaSk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGRlY2xhcmUgPSByZXF1aXJlKFwiLi4vYmFzZS9kZWNsYXJlXCIpO1xyXG52YXIgc2VsZiA9IGRlY2xhcmUoe1xyXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmlubmVyQXJyYXkgPSBbXTtcclxuICAgIH0sXHJcbiAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuaW5uZXJBcnJheSA9IFtdO1xyXG4gICAgfSxcclxuICAgIGV4aXN0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmlubmVyQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5uZXJBcnJheVtpXS5rZXkgPT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGluZGV4OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmlubmVyQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5uZXJBcnJheVtpXS5rZXkgPT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSxcclxuICAgIGFkZDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IGtleS5zcGxpdCgnJicpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBsaXN0W2ldLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyQXJyYXkucHVzaCh7IGtleTogdmFsdWVzWzBdLCB2YWx1ZTogdmFsdWVzWzFdIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5leGlzdChrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyAnYWxlYXJkeSBleGlzdCBzYW1lIGtleVsnICsga2V5ICsgJ10nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lckFycmF5LnB1c2goeyBrZXk6IGtleSwgdmFsdWU6IHZhbHVlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHZhciBpID0gdGhpcy5pbmRleChrZXkpO1xyXG4gICAgICAgIGlmIChpID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5pbm5lckFycmF5LnNwbGljZShpLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmlubmVyQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5uZXJBcnJheVtpXS5rZXkgPT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJBcnJheVtpXS52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmlubmVyQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5uZXJBcnJheVtpXS5rZXkgPT09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lckFycmF5W2ldLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlubmVyQXJyYXkubGVuZ3RoO1xyXG4gICAgfVxyXG59KTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGRlY2xhcmUgPSByZXF1aXJlKFwiLi4vYmFzZS9kZWNsYXJlXCIpO1xyXG52YXIgc2VsZiA9IGRlY2xhcmUoe1xyXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmlubmVyQXJyYXkgPSBbXTtcclxuICAgIH0sXHJcbiAgICBwdXNoOiBmdW5jdGlvbiAodGFyZ2V0T2JqZWN0KSB7XHJcbiAgICAgICAgdGhpcy5pbm5lckFycmF5LnB1c2godGFyZ2V0T2JqZWN0KTtcclxuICAgIH0sXHJcbiAgICBwb3A6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbm5lckFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRPYmplY3QgPSB0aGlzLmlubmVyQXJyYXlbMF07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pbm5lckFycmF5Lmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lckFycmF5W2ldID0gdGhpcy5pbm5lckFycmF5W2kgKyAxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlubmVyQXJyYXkubGVuZ3RoID0gdGhpcy5pbm5lckFycmF5Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXRPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHBlZWs6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbm5lckFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJBcnJheVswXTtcclxuICAgIH0sXHJcbiAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuaW5uZXJBcnJheS5sZW5ndGggPSAwO1xyXG4gICAgfSxcclxuICAgIHNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbm5lckFycmF5Lmxlbmd0aDtcclxuICAgIH0sXHJcbiAgICBpc0VtcHR5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJBcnJheS5sZW5ndGggPT09IDAgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHNlbGY7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLmNvbnN0cnVjdG9yKCk7XHJcbiAgICB9LFxyXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3RhY2sgPSB7XHJcbiAgICAgICAgICAgIGlubmVyQXJyYXk6IFtdLFxyXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lckFycmF5W3RoaXMuaW5uZXJBcnJheS5sZW5ndGhdID0gZWxlbWVudDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbm5lckFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLmlubmVyQXJyYXlbdGhpcy5pbm5lckFycmF5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheS5sZW5ndGgtLTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGVlazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5uZXJBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlubmVyQXJyYXlbdGhpcy5pbm5lckFycmF5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lckFycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlubmVyQXJyYXkubGVuZ3RoO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBpc0VtcHR5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuaW5uZXJBcnJheS5sZW5ndGggPT09IDApID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gc3RhY2s7XHJcbiAgICB9XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBzZWxmID0ge1xyXG4gICAgaGV4OiBmdW5jdGlvbiAoY29sb3JSZ2JDb2RlKSB7XHJcbiAgICAgICAgaWYgKC9eKHJnYnxSR0IpLy50ZXN0KGNvbG9yUmdiQ29kZSkpIHtcclxuICAgICAgICAgICAgdmFyIGNvbG9yQnVmZmVyID0gY29sb3JSZ2JDb2RlLnJlcGxhY2UoLyg/OlxcKHxcXCl8cmdifFJHQikvZywgXCJcIikuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICB2YXIgc3RySGV4ID0gXCIjXCI7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sb3JCdWZmZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBoZXggPSBOdW1iZXIoY29sb3JCdWZmZXJbaV0pLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgICAgIGlmIChoZXggPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGV4ICs9IGhleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0ckhleCArPSBoZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHN0ckhleC5sZW5ndGggIT09IDcpIHtcclxuICAgICAgICAgICAgICAgIHN0ckhleCA9IGNvbG9yUmdiQ29kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3RySGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICgvXiMoWzAtOWEtZkEtZl17M318WzAtOWEtZkEtZl17Nn0pJC8udGVzdChjb2xvclJnYkNvZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2xvckJ1ZmZlciA9IGNvbG9yUmdiQ29kZS5yZXBsYWNlKC8jLywgXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAgICAgIGlmIChjb2xvckJ1ZmZlci5sZW5ndGggPT09IDYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvclJnYkNvZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29sb3JCdWZmZXIubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbnVtSGV4ID0gXCIjXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9yQnVmZmVyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtSGV4ICs9IChjb2xvckJ1ZmZlcltpXSArIGNvbG9yQnVmZmVyW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBudW1IZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2xvclJnYkNvZGU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJnYjogZnVuY3Rpb24gKGNvbG9ySGV4Q29kZSkge1xyXG4gICAgICAgIHZhciBjb2xvciA9IGNvbG9ySGV4Q29kZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChjb2xvciAmJiAvXiMoWzAtOWEtZkEtZl17M318WzAtOWEtZkEtZl17Nn0pJC8udGVzdChjb2xvcikpIHtcclxuICAgICAgICAgICAgaWYgKGNvbG9yLmxlbmd0aCA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsQ29sb3IgPSBcIiNcIjtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgNDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxDb2xvciArPSBjb2xvci5zbGljZShpLCBpICsgMSkuY29uY2F0KGNvbG9yLnNsaWNlKGksIGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IG9yaWdpbmFsQ29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGNvbG9yQnVmZmVyID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgNzsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvckJ1ZmZlci5wdXNoKHBhcnNlSW50KFwiMHhcIiArIGNvbG9yLnNsaWNlKGksIGkgKyAyKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAncmdiKCcgKyBjb2xvckJ1ZmZlci5qb2luKCcsICcpICsgJyknO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGxhbmcgPSByZXF1aXJlKFwiLi9iYXNlL2xhbmdcIik7XHJcbnZhciBzZWxmID0ge1xyXG4gICAgcXVlcnk6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gJyc7XHJcbiAgICAgICAgdmFyIHNlYXJjaCA9IG5hbWUgKyAnPSc7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmNvb2tpZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihzZWFyY2gpO1xyXG4gICAgICAgICAgICBpZiAob2Zmc2V0ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gc2VhcmNoLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciBlbmQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZignOycsIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZW5kID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gZG9jdW1lbnQuY29va2llLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdW5lc2NhcGUoZG9jdW1lbnQuY29va2llLnN1YnN0cmluZyhvZmZzZXQsIGVuZCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICBhZGQ6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSBsYW5nLmV4dGVuZCh7IHBhdGg6ICcvJyB9LCBvcHRpb25zIHx8IHt9KTtcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBlc2NhcGUobmFtZSkgKyAnPScgKyBlc2NhcGUodmFsdWUpXHJcbiAgICAgICAgICAgICsgKCghb3B0aW9ucy5leHBpcmUpID8gJycgOiAoJzsgZXhwaXJlcz0nICsgb3B0aW9ucy5leHBpcmUudG9VVENTdHJpbmcoKSkpXHJcbiAgICAgICAgICAgICsgJzsgcGF0aD0nICsgb3B0aW9ucy5wYXRoXHJcbiAgICAgICAgICAgICsgKCghb3B0aW9ucy5kb21haW4pID8gJycgOiAoJzsgZG9tYWluPScgKyBvcHRpb25zLmRvbWFpbikpO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24gKG5hbWUsIG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zID0gbGFuZy5leHRlbmQoeyBwYXRoOiAnLycgfSwgb3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgaWYgKCEhdGhpcy5xdWVyeShuYW1lKSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBlc2NhcGUobmFtZSkgKyAnPTsgcGF0aD0nICsgb3B0aW9ucy5wYXRoXHJcbiAgICAgICAgICAgICAgICArICc7IGV4cGlyZXM9JyArIG5ldyBEYXRlKDApLnRvVVRDU3RyaW5nKClcclxuICAgICAgICAgICAgICAgICsgKCghb3B0aW9ucy5kb21haW4pID8gJycgOiAoJzsgZG9tYWluPScgKyBvcHRpb25zLmRvbWFpbikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHggPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xyXG52YXIgd2Vla0RheXMgPSBbJ+aYn+acn+aXpScsICfmmJ/mnJ/kuIAnLCAn5pif5pyf5LqMJywgJ+aYn+acn+S4iScsICfmmJ/mnJ/lm5snLCAn5pif5pyf5LqUJywgJ+aYn+acn+WFrSddO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIG5vdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLmNyZWF0ZSgpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKHRpbWVWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLm5ld0RhdGVUaW1lKHRpbWVWYWx1ZSk7XHJcbiAgICB9LFxyXG4gICAgc2hvcnRJbnRlcnZhbHM6IHtcclxuICAgICAgICAneSc6ICd5ZWFyJyxcclxuICAgICAgICAncSc6ICdxdWFydGVyJyxcclxuICAgICAgICAnTSc6ICdtb250aCcsXHJcbiAgICAgICAgJ3cnOiAnd2VlaycsXHJcbiAgICAgICAgJ2QnOiAnZGF5JyxcclxuICAgICAgICAnaCc6ICdob3VyJyxcclxuICAgICAgICAnbSc6ICdtaW51dGUnLFxyXG4gICAgICAgICdzJzogJ3NlY29uZCcsXHJcbiAgICAgICAgJ21zJzogJ21zZWNvbmQnXHJcbiAgICB9LFxyXG4gICAgZm9ybWF0SW50ZXJ2YWw6IGZ1bmN0aW9uIChpbnRlcnZhbCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLnNob3J0SW50ZXJ2YWxzW2ludGVydmFsXSB8fCBpbnRlcnZhbDtcclxuICAgIH0sXHJcbiAgICBkaWZmOiBmdW5jdGlvbiAoYmVnaW4sIGVuZCwgaW50ZXJ2YWwpIHtcclxuICAgICAgICB2YXIgdGltZUJlZ2luID0gc2VsZi5uZXdEYXRlVGltZShiZWdpbik7XHJcbiAgICAgICAgdmFyIHRpbWVFbmQgPSBzZWxmLm5ld0RhdGVUaW1lKGVuZCk7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVCZWdpbi5kaWZmKHNlbGYuZm9ybWF0SW50ZXJ2YWwoaW50ZXJ2YWwpLCB0aW1lRW5kKTtcclxuICAgIH0sXHJcbiAgICBhZGQ6IGZ1bmN0aW9uICh0aW1lVmFsdWUsIGludGVydmFsLCBudW1iZXIpIHtcclxuICAgICAgICB2YXIgdGltZSA9IHNlbGYubmV3RGF0ZVRpbWUodGltZVZhbHVlKTtcclxuICAgICAgICByZXR1cm4gdGltZS5hZGQoc2VsZi5mb3JtYXRJbnRlcnZhbChpbnRlcnZhbCksIG51bWJlcik7XHJcbiAgICB9LFxyXG4gICAgZm9ybWF0OiBmdW5jdGlvbiAodGltZVZhbHVlLCBmb3JtYXRWYWx1ZSkge1xyXG4gICAgICAgIHZhciB0aW1lID0gc2VsZi5jcmVhdGUodGltZVZhbHVlKTtcclxuICAgICAgICByZXR1cm4gdGltZS50b1N0cmluZyhmb3JtYXRWYWx1ZSk7XHJcbiAgICB9LFxyXG4gICAgYWdvOiBmdW5jdGlvbiAodGltZVZhbHVlLCBzdWZmaXgpIHtcclxuICAgICAgICBzdWZmaXggPSB4LmV4dGVuZCh7XHJcbiAgICAgICAgICAgIGFtb21lbnQ6IFwi5Yia5YiaXCIsXHJcbiAgICAgICAgICAgIG1pbnV0ZTogJ+WIhumSn+WJjScsXHJcbiAgICAgICAgICAgIGhvdXI6ICflsI/ml7bliY0nLFxyXG4gICAgICAgICAgICBkYXk6ICflpKnliY0nXHJcbiAgICAgICAgfSwgc3VmZml4KTtcclxuICAgICAgICB2YXIgdGltZSA9IHNlbGYuY3JlYXRlKHRpbWVWYWx1ZSk7XHJcbiAgICAgICAgdmFyIG5vdyA9IHNlbGYuY3JlYXRlKCk7XHJcbiAgICAgICAgaWYgKHRpbWUuZGlmZignbScsIG5vdykgPCAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdWZmaXguYW1vbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGltZS5kaWZmKCdtJywgbm93KSA8IDYwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aW1lLmRpZmYoJ20nLCBub3cpICsgc3VmZml4Lm1pbnV0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGltZS5kaWZmKCdoJywgbm93KSA8IDI0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aW1lLmRpZmYoJ2gnLCBub3cpICsgc3VmZml4LmhvdXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRpbWUuZGlmZignZCcsIG5vdykgPCA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aW1lLmRpZmYoJ2QnLCBub3cpICsgc3VmZml4LmRheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aW1lLnRvU3RyaW5nKCd5eXl5LU1NLWRkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG5ld0RhdGVUaW1lOiBmdW5jdGlvbiAodGltZVZhbHVlKSB7XHJcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGlmICgheC5pc1VuZGVmaW5lZCh0aW1lVmFsdWUpKSB7XHJcbiAgICAgICAgICAgIGlmICh4LnR5cGUodGltZVZhbHVlKSA9PT0gJ2RhdGUnKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gdGltZVZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHguaXNOdW1iZXIodGltZVZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHRpbWVWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoeC5pc0FycmF5KHRpbWVWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gdGltZVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXlzW2ldID0gaXNOYU4oa2V5c1tpXSkgPyAoaSA8IDMgPyAxIDogMCkgOiBOdW1iZXIoa2V5c1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoa2V5c1swXSwgTnVtYmVyKGtleXNbMV0pIC0gMSwga2V5c1syXSwga2V5c1szXSwga2V5c1s0XSwga2V5c1s1XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoL1xcL0RhdGVcXCgoLT9cXGQrKVxcKVxcLy8udGVzdCh0aW1lVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoTWF0aC5mbG9vcih0aW1lVmFsdWUucmVwbGFjZSgvXFwvRGF0ZVxcKCgtP1xcZCspXFwpXFwvLywgJyQxJykpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgvKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSlUKFxcZHsyfSk6KFxcZHsyfSk6KFxcZHsyfSkuKFxcZHszfSlaLy50ZXN0KHRpbWVWYWx1ZSlcclxuICAgICAgICAgICAgICAgIHx8IC8oXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KS8udGVzdCh0aW1lVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gbmV3IERhdGUodGltZVZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gdGltZVZhbHVlLnJlcGxhY2UoL1stfDp8XFwvfCB85bm0fOaciHzml6VdL2csICcsJykucmVwbGFjZSgvLCwvZywgJywnKS5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXlzW2ldID0gaXNOYU4oa2V5c1tpXSkgPyAoaSA8IDMgPyAxIDogMCkgOiBOdW1iZXIoa2V5c1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoa2V5c1swXSwgTnVtYmVyKGtleXNbMV0pIC0gMSwga2V5c1syXSwga2V5c1szXSwga2V5c1s0XSwga2V5c1s1XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRpbWUgPSB7XHJcbiAgICAgICAgICAgIHllYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSxcclxuICAgICAgICAgICAgbW9udGg6IGRhdGUuZ2V0TW9udGgoKSxcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERhdGUoKSxcclxuICAgICAgICAgICAgaG91cjogZGF0ZS5nZXRIb3VycygpLFxyXG4gICAgICAgICAgICBtaW51dGU6IGRhdGUuZ2V0TWludXRlcygpLFxyXG4gICAgICAgICAgICBzZWNvbmQ6IGRhdGUuZ2V0U2Vjb25kcygpLFxyXG4gICAgICAgICAgICBtc2Vjb25kOiBkYXRlLmdldE1pbGxpc2Vjb25kcygpLFxyXG4gICAgICAgICAgICB3ZWVrRGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICBkaWZmOiBmdW5jdGlvbiAoaW50ZXJ2YWwsIHRpbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aW1lQmVnaW4gPSBOdW1iZXIodGhpcy50b05hdGl2ZURhdGUoKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGltZUVuZCA9IE51bWJlcih0aW1lLnRvTmF0aXZlRGF0ZSgpKTtcclxuICAgICAgICAgICAgICAgIGludGVydmFsID0gc2VsZi5mb3JtYXRJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGludGVydmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneWVhcic6IHJldHVybiB0aW1lLnllYXIgLSB0aGlzLnllYXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6IHJldHVybiBNYXRoLmNlaWwoKCgodGltZS55ZWFyIC0gdGhpcy55ZWFyKSAqIDEyKSArICh0aW1lLm1vbnRoIC0gdGhpcy5tb250aCkpIC8gMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbW9udGgnOiByZXR1cm4gKCh0aW1lLnllYXIgLSB0aGlzLnllYXIpICogMTIpICsgKHRpbWUubW9udGggLSB0aGlzLm1vbnRoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJzogcmV0dXJuIE1hdGguZmxvb3IoKHRpbWVFbmQgLSB0aW1lQmVnaW4pIC8gKDg2NDAwMDAwICogNykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RheSc6IHJldHVybiBNYXRoLmZsb29yKCh0aW1lRW5kIC0gdGltZUJlZ2luKSAvIDg2NDAwMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdob3VyJzogcmV0dXJuIE1hdGguZmxvb3IoKHRpbWVFbmQgLSB0aW1lQmVnaW4pIC8gMzYwMDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJzogcmV0dXJuIE1hdGguZmxvb3IoKHRpbWVFbmQgLSB0aW1lQmVnaW4pIC8gNjAwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKCh0aW1lRW5kIC0gdGltZUJlZ2luKSAvIDEwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ21zZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcigodGltZUVuZCAtIHRpbWVCZWdpbikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uIChpbnRlcnZhbCwgbnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IE51bWJlcih0aGlzLnRvTmF0aXZlRGF0ZSgpKTtcclxuICAgICAgICAgICAgICAgIHZhciBtcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW9udGhNYXhEYXlzID0gWzMxLCAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdO1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSBzZWxmLmZvcm1hdEludGVydmFsKGludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIG51bWJlciA9IE51bWJlcihudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChpbnRlcnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3llYXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMueWVhciAlIDQgPT0gMCAmJiAoKHRoaXMueWVhciAlIDEwMCAhPSAwKSB8fCAodGhpcy55ZWFyICUgNDAwID09IDApKSkgJiYgdGhpcy5tb250aCA9PSAxICYmIHRoaXMuZGF5ID09IDI5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAhKCh0aGlzLnllYXIgKyBudW1iZXIpICUgNCA9PSAwICYmICgoKHRoaXMueWVhciArIG51bWJlcikgJSAxMDAgIT0gMCkgfHwgKCh0aGlzLnllYXIgKyBudW1iZXIpICUgNDAwID09IDApKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gTnVtYmVyKG5ldyBEYXRlKHRoaXMueWVhciArIG51bWJlciwgdGhpcy5tb250aCwgMjgsIHRoaXMuaG91ciwgdGhpcy5taW51dGUsIHRoaXMuc2Vjb25kKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtcyA9IE51bWJlcihuZXcgRGF0ZSh0aGlzLnllYXIgKyBudW1iZXIsIHRoaXMubW9udGgsIHRoaXMuZGF5LCB0aGlzLmhvdXIsIHRoaXMubWludXRlLCB0aGlzLnNlY29uZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMueWVhciAlIDQgPT0gMCAmJiAoKHRoaXMueWVhciAlIDEwMCAhPSAwKSB8fCAodGhpcy55ZWFyICUgNDAwID09IDApKSkgJiYgdGhpcy5tb250aCA9PSAxICYmIHRoaXMuZGF5ID09IDI5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAhKCh0aGlzLnllYXIgKyBNYXRoLmZsb29yKCh0aGlzLm1vbnRoICsgbnVtYmVyICogMykgLyAxMikpICUgNCA9PSAwICYmICgoKHRoaXMueWVhciArIE1hdGguZmxvb3IoKHRoaXMubW9udGggKyBudW1iZXIgKiAzKSAvIDEyKSkgJSAxMDAgIT0gMCkgfHwgKCh0aGlzLnllYXIgKyBNYXRoLmZsb29yKCh0aGlzLm1vbnRoICsgbnVtYmVyICogMykgLyAxMikpICUgNDAwID09IDApKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gTnVtYmVyKG5ldyBEYXRlKHRoaXMueWVhciwgKHRoaXMubW9udGggKyBudW1iZXIgKiAzKSwgMjgsIHRoaXMuaG91ciwgdGhpcy5taW51dGUsIHRoaXMuc2Vjb25kKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXkgPT0gbW9udGhNYXhEYXlzW3RoaXMubW9udGhdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBOdW1iZXIobmV3IERhdGUodGhpcy55ZWFyLCAodGhpcy5tb250aCArIG51bWJlciAqIDMpLCBtb250aE1heERheXNbKHRoaXMubW9udGggKyBudW1iZXIgKiAzKSAlIDEyXSwgdGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSwgdGhpcy5zZWNvbmQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gTnVtYmVyKG5ldyBEYXRlKHRoaXMueWVhciwgKHRoaXMubW9udGggKyBudW1iZXIgKiAzKSwgdGhpcy5kYXksIHRoaXMuaG91ciwgdGhpcy5taW51dGUsIHRoaXMuc2Vjb25kKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRoaXMueWVhciAlIDQgPT0gMCAmJiAoKHRoaXMueWVhciAlIDEwMCAhPSAwKSB8fCAodGhpcy55ZWFyICUgNDAwID09IDApKSkgJiYgdGhpcy5tb250aCA9PSAxICYmIHRoaXMuZGF5ID09IDI5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAhKCh0aGlzLnllYXIgKyBNYXRoLmZsb29yKCh0aGlzLm1vbnRoICsgbnVtYmVyKSAvIDEyKSkgJSA0ID09IDAgJiYgKCgodGhpcy55ZWFyICsgTWF0aC5mbG9vcigodGhpcy5tb250aCArIG51bWJlcikgLyAxMikpICUgMTAwICE9IDApIHx8ICgodGhpcy55ZWFyICsgTWF0aC5mbG9vcigodGhpcy5tb250aCArIG51bWJlcikgLyAxMikpICUgNDAwID09IDApKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gTnVtYmVyKG5ldyBEYXRlKHRoaXMueWVhciwgKHRoaXMubW9udGggKyBudW1iZXIpLCAyOCwgdGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSwgdGhpcy5zZWNvbmQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRheSA9PSBtb250aE1heERheXNbdGhpcy5tb250aF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtcyA9IE51bWJlcihuZXcgRGF0ZSh0aGlzLnllYXIsICh0aGlzLm1vbnRoICsgbnVtYmVyKSwgbW9udGhNYXhEYXlzWyh0aGlzLm1vbnRoICsgbnVtYmVyKSAlIDEyXSwgdGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSwgdGhpcy5zZWNvbmQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gTnVtYmVyKG5ldyBEYXRlKHRoaXMueWVhciwgKHRoaXMubW9udGggKyBudW1iZXIpLCB0aGlzLmRheSwgdGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSwgdGhpcy5zZWNvbmQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBkYXRlICsgKCg4NjQwMDAwMCAqIDcpICogbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGF5JzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBkYXRlICsgKDg2NDAwMDAwICogbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaG91cic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gZGF0ZSArICgzNjAwMDAwICogbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBkYXRlICsgKDYwMDAwICogbnVtYmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBkYXRlICsgKDEwMDAgKiBudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtc2Vjb25kJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBkYXRlICsgbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNyZWF0ZShuZXcgRGF0ZShtcykpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREYXRlUGFydDogZnVuY3Rpb24gKGludGVydmFsKSB7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHNlbGYuZm9ybWF0SW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChpbnRlcnZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3llYXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy55ZWFyO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRRdWFydGVyT2ZZZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tb250aDtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdkYXknOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnd2Vlayc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3ZWVrRGF5c1t0aGlzLndlZWtEYXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1cnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWtPZlllYXInOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRXZWVrT2ZZZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnaG91cic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhvdXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWludXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlY29uZDtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1Vua293biBJbnRlcnZhbCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldE1heERheU9mTW9udGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlMSA9IHNlbGYuY3JlYXRlKHRoaXMudG9TdHJpbmcoJ3l5eXktTU0tMDEnKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZTIgPSBzZWxmLmNyZWF0ZSh0aGlzLmFkZCgnbW9udGgnLCAxKS50b1N0cmluZygneXl5eS1NTS0wMScpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkYXRlMS5kaWZmKCdkYXknLCBkYXRlMik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFF1YXJ0ZXJPZlllYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5tb250aCAvIDMpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRXZWVrT2ZZZWFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgd2VlayA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF5ID0gdGhpcy5nZXREYXlPZlllYXIoKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNyZWF0ZSh0aGlzLnRvU3RyaW5nKCd5eXl5LTAxLTAxJykpLndlZWtEYXkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF5ID0gZGF5IC0gKDcgLSBzZWxmLmNyZWF0ZSh0aGlzLnRvU3RyaW5nKCd5eXl5LTAxLTAxJykpLndlZWtEYXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGRheSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB3ZWVrID0gTWF0aC5jZWlsKGRheSAvIDcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdlZWs7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldERheU9mWWVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGUxID0gdGhpcy50b05hdGl2ZURhdGUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlMiA9IG5ldyBEYXRlKGRhdGUxLmdldEZ1bGxZZWFyKCksIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChOdW1iZXIoTnVtYmVyKGRhdGUxKSAtIE51bWJlcihkYXRlMikpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApKSArIDE7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGlzTGVhcFllYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy55ZWFyICUgNCA9PSAwICYmICgodGhpcy55ZWFyICUgMTAwICE9IDApIHx8ICh0aGlzLnllYXIgJSA0MDAgPT0gMCkpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9BcnJheTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFt0aGlzLnllYXIsIHRoaXMubW9udGgsIHRoaXMuZGF5LCB0aGlzLmhvdXIsIHRoaXMubWludXRlLCB0aGlzLnNlY29uZCwgdGhpcy5tc2Vjb25kXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdG9OYXRpdmVEYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodGhpcy55ZWFyLCB0aGlzLm1vbnRoLCB0aGlzLmRheSwgdGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSwgdGhpcy5zZWNvbmQpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKGZvcm1hdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gdm9pZCAwKSB7IGZvcm1hdCA9ICd5eXl5LU1NLWRkIEhIOm1tOnNzJzsgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKC95eXl5fFlZWVkvZywgdGhpcy55ZWFyKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC95eXxZWS9nLCB4LnBhZGRpbmdaZXJvKCh0aGlzLnllYXIyICUgMTAwKSwgMikpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1kvZywgdGhpcy55ZWFyKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9NTS9nLCB4LnBhZGRpbmdaZXJvKCh0aGlzLm1vbnRoICsgMSksIDIpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9NL2csICh0aGlzLm1vbnRoICsgMSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL3d8Vy9nLCB3ZWVrRGF5c1t0aGlzLndlZWtEYXldKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9kZHxERC9nLCB4LnBhZGRpbmdaZXJvKHRoaXMuZGF5LCAyKSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvZHxEL2csIHRoaXMuZGF5KVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9oaHxISC9nLCB4LnBhZGRpbmdaZXJvKHRoaXMuaG91ciwgMikpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL2h8SC9nLCB0aGlzLmhvdXIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL21tL2csIHgucGFkZGluZ1plcm8odGhpcy5taW51dGUsIDIpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9tL2csIHRoaXMubWludXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9zc3xTUy9nLCB4LnBhZGRpbmdaZXJvKHRoaXMuc2Vjb25kLCAyKSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvc3xTL2csIHRoaXMuc2Vjb25kKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9mZmYvZywgeC5wYWRkaW5nWmVybyh0aGlzLm1zZWNvbmQsIDMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRpbWU7XHJcbiAgICB9LFxyXG4gICAgdGltZXNwYW46IGZ1bmN0aW9uICh0aW1lc3BhblZhbHVlLCBmb3JtYXQpIHtcclxuICAgICAgICBpZiAoZm9ybWF0ID09PSB2b2lkIDApIHsgZm9ybWF0ID0gJ3NlY29uZCc7IH1cclxuICAgICAgICBpZiAoZm9ybWF0ID09ICdkYXknIHx8IGZvcm1hdCA9PSAnZCcpIHtcclxuICAgICAgICAgICAgdGltZXNwYW5WYWx1ZSA9IHRpbWVzcGFuVmFsdWUgKiAyNCAqIDYwICogNjA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmb3JtYXQgPT0gJ2hvdXInIHx8IGZvcm1hdCA9PSAnaCcpIHtcclxuICAgICAgICAgICAgdGltZXNwYW5WYWx1ZSA9IHRpbWVzcGFuVmFsdWUgKiA2MCAqIDYwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZm9ybWF0ID09ICdtaW51dGUnIHx8IGZvcm1hdCA9PSAnbScpIHtcclxuICAgICAgICAgICAgdGltZXNwYW5WYWx1ZSA9IHRpbWVzcGFuVmFsdWUgKiA2MDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZvcm1hdCA9PSAnc2Vjb25kJyB8fCBmb3JtYXQgPT0gJ3MnKSB7XHJcbiAgICAgICAgICAgIHRpbWVzcGFuVmFsdWUgPSB0aW1lc3BhblZhbHVlICogMTAwMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRpbWVzcGFuID0ge1xyXG4gICAgICAgICAgICB0aW1lc3BhblZhbHVlOiB0aW1lc3BhblZhbHVlLFxyXG4gICAgICAgICAgICBkYXk6IHRpbWVzcGFuVmFsdWUgLyAoMjQgKiA2MCAqIDYwICogMTAwMCksXHJcbiAgICAgICAgICAgIGhvdXI6IHRpbWVzcGFuVmFsdWUgLyAoNjAgKiA2MCAqIDEwMDApLFxyXG4gICAgICAgICAgICBtaW51dGU6IHRpbWVzcGFuVmFsdWUgLyAoNjAgKiAxMDAwKSxcclxuICAgICAgICAgICAgc2Vjb25kOiB0aW1lc3BhblZhbHVlIC8gMTAwMCxcclxuICAgICAgICAgICAgbWlsbGlzZWNvbmQ6IHRpbWVzcGFuVmFsdWUgJSAxMDAwLFxyXG4gICAgICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKGZvcm1hdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG91dFN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdNTeWkqWRk5bCP5pe2bW3liIbpkp9zc+enkmZmZuavq+enkic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IHgucGFkZGluZ1plcm8odGhpcy5kYXksIDIpICsgXCLlpKlcIiArIHgucGFkZGluZ1plcm8odGhpcy5ob3VyLCAyKSArIFwi5bCP5pe2XCIgKyB4LnBhZGRpbmdaZXJvKHRoaXMubWludXRlLCAyKSArIFwi5YiG6ZKfXCIgKyB4LnBhZGRpbmdaZXJvKHRoaXMuc2Vjb25kLCAyKSArIFwi56eSXCIgKyB4LnBhZGRpbmdaZXJvKHRoaXMubWlsbGlzZWNvbmQsIDMpICsgXCLmr6vnp5JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTU3lpKlkZOWwj+aXtm1t5YiG6ZKfc3Pnp5InOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSB4LnBhZGRpbmdaZXJvKHRoaXMuZGF5LCAyKSArIFwi5aSpXCIgKyB4LnBhZGRpbmdaZXJvKHRoaXMuaG91ciwgMikgKyBcIuWwj+aXtlwiICsgeC5wYWRkaW5nWmVybyh0aGlzLm1pbnV0ZSwgMikgKyBcIuWIhumSn1wiICsgeC5wYWRkaW5nWmVybyh0aGlzLnNlY29uZCwgMikgKyBcIuenklwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSB4LnBhZGRpbmdaZXJvKHRoaXMuZGF5LCAyKSArIFwi5aSpXCIgKyB4LnBhZGRpbmdaZXJvKHRoaXMuaG91ciwgMikgKyBcIuWwj+aXtlwiICsgeC5wYWRkaW5nWmVybyh0aGlzLm1pbnV0ZSwgMikgKyBcIuWIhumSn1wiICsgeC5wYWRkaW5nWmVybyh0aGlzLnNlY29uZCwgMikgKyBcIuenklwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBvdXRTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aW1lc3BhbjtcclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHggPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xyXG52YXIgc3RyaW5nID0gcmVxdWlyZShcIi4vc3RyaW5nXCIpO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIGh0bWw6IHtcclxuICAgICAgICBkaWN0OiB7XHJcbiAgICAgICAgICAgICcmJzogJyYjMzI7JyxcclxuICAgICAgICAgICAgJyAnOiAnJiMzODsnLFxyXG4gICAgICAgICAgICAnPCc6ICcmIzYwOycsXHJcbiAgICAgICAgICAgICc+JzogJyYjNjI7JyxcclxuICAgICAgICAgICAgJ1wiJzogJyYjMzQ7JyxcclxuICAgICAgICAgICAgJ1xcJyc6ICcmIzM5OydcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVuY29kZTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dCA9IHN0cmluZy5zdHJpbmdpZnkodGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoLyYoPyFbXFx3I10rOyl8Wzw+XCInXS9nLCBmdW5jdGlvbiAocykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuaHRtbC5kaWN0W3NdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dCA9IHN0cmluZy5zdHJpbmdpZnkodGV4dCk7XHJcbiAgICAgICAgICAgIHZhciBvdXRTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgb3V0U3RyaW5nID0gdGV4dC5yZXBsYWNlKC8mYW1wOy9nLCBcIiZcIik7XHJcbiAgICAgICAgICAgIG91dFN0cmluZyA9IG91dFN0cmluZy5yZXBsYWNlKC8mbHQ7L2csIFwiPFwiKTtcclxuICAgICAgICAgICAgb3V0U3RyaW5nID0gb3V0U3RyaW5nLnJlcGxhY2UoLyZndDsvZywgXCI+XCIpO1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgPSBvdXRTdHJpbmcucmVwbGFjZSgvJm5ic3A7L2csIFwiIFwiKTtcclxuICAgICAgICAgICAgb3V0U3RyaW5nID0gb3V0U3RyaW5nLnJlcGxhY2UoLyYjMzk7L2csIFwiXFwnXCIpO1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgPSBvdXRTdHJpbmcucmVwbGFjZSgvJnF1b3Q7L2csIFwiXFxcIlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG91dFN0cmluZztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdW5pY29kZToge1xyXG4gICAgICAgIGVuY29kZTogZnVuY3Rpb24gKHRleHQsIHByZWZpeCkge1xyXG4gICAgICAgICAgICBpZiAodGV4dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmVmaXggPSBwcmVmaXggfHwgJ1xcXFx1JztcclxuICAgICAgICAgICAgdGV4dCA9IHN0cmluZy5zdHJpbmdpZnkodGV4dCk7XHJcbiAgICAgICAgICAgIHZhciBvdXRTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IChwcmVmaXggPT09ICcmIycpID8gdGV4dC5jaGFyQ29kZUF0KGkpLnRvU3RyaW5nKDEwKSA6IHRleHQuY2hhckNvZGVBdChpKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVtcC5sZW5ndGggPCA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRlbXAubGVuZ3RoIDwgNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wID0gJzAnLmNvbmNhdCh0ZW1wKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBvdXRTdHJpbmcuY29uY2F0KHByZWZpeCArIHRlbXApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeC5pbmRleE9mKCcmIycpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gJzsnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvdXRTdHJpbmcudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRlY29kZTogZnVuY3Rpb24gKHRleHQsIHByZWZpeCkge1xyXG4gICAgICAgICAgICBpZiAodGV4dC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmVmaXggPSBwcmVmaXggfHwgJ1xcXFx1JztcclxuICAgICAgICAgICAgdGV4dCA9IHN0cmluZy5zdHJpbmdpZnkodGV4dCk7XHJcbiAgICAgICAgICAgIHZhciBvdXRTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSB0ZXh0Lm1hdGNoKC8oW1xcd10rKXwoXFxcXHUoW1xcd117NH0pKS9nKTtcclxuICAgICAgICAgICAgaWYgKGxpc3QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgeC5lYWNoKGxpc3QsIGZ1bmN0aW9uIChpbmRleCwgbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmluZGV4T2YocHJlZml4KSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KG5vZGUuc2xpY2UoMiwgNiksIDE2KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gbm9kZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb3V0U3RyaW5nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHNlbGYgPSB7XHJcbiAgICBnZXRFdmVudDogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5ldmVudCA/IHdpbmRvdy5ldmVudCA6IGV2ZW50O1xyXG4gICAgfSxcclxuICAgIGdldFRhcmdldDogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5ldmVudCA/IHdpbmRvdy5ldmVudC5zcmNFbGVtZW50IDogZXZlbnQgPyBldmVudC50YXJnZXQgOiBudWxsO1xyXG4gICAgfSxcclxuICAgIGdldFBvc2l0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHkgfHwgeyBzY3JvbGxMZWZ0OiAwLCBzY3JvbGxUb3A6IDAgfTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBldmVudC5wYWdlWCB8fCBldmVudC5jbGllbnRYICsgKGRvY0VsZW1lbnQuc2Nyb2xsTGVmdCB8fCBib2R5LnNjcm9sbExlZnQpIC0gKGRvY0VsZW1lbnQuY2xpZW50TGVmdCB8fCAwKSxcclxuICAgICAgICAgICAgeTogZXZlbnQucGFnZVkgfHwgZXZlbnQuY2xpZW50WSArIChkb2NFbGVtZW50LnNjcm9sbFRvcCB8fCBib2R5LnNjcm9sbFRvcCkgLSAoZG9jRWxlbWVudC5jbGllbnRUb3AgfHwgMClcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQucHJldmVudERlZmF1bHQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5ldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzdG9wUHJvcGFnYXRpb246IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGlmIChldmVudCAmJiBldmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGFkZDogZnVuY3Rpb24gKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpIHtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0YXJnZXQuYXR0YWNoRXZlbnQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LmF0dGFjaEV2ZW50KCdvbicgKyB0eXBlLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0YXJnZXRbJ29uJyArIHR5cGVdID0gbGlzdGVuZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24gKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpIHtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0YXJnZXQuZGV0YWNoRXZlbnQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0LmRldGFjaEV2ZW50KCdvbicgKyB0eXBlLCBsaXN0ZW5lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0YXJnZXRbJ29uJyArIHR5cGVdID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZmlyZTogZnVuY3Rpb24gKHRhcmdldCwgdHlwZSkge1xyXG4gICAgICAgIHZhciBldmVudHMgPSB0YXJnZXQuX2xpc3RlbmVyc1t0eXBlXTtcclxuICAgICAgICBpZiAoZXZlbnRzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudHNbaV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHNbaV0oeyB0eXBlOiB0eXBlIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciB4ID0gcmVxdWlyZShcIi4vYmFzZVwiKTtcclxudmFyIGV2ZW50ID0gcmVxdWlyZShcIi4vZXZlbnRcIik7XHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAgIHJldHVyblR5cGU6ICdqc29uJyxcclxuICAgIHhockRhdGFLZXk6ICd4aHIteG1sJyxcclxuICAgIGdldEFjY2Vzc1Rva2VuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2xpZW50SWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIH0sXHJcbiAgICBnZXRDbGllbnRTaWduYXR1cmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIH0sXHJcbiAgICBnZXRUaW1lc3RhbXA6IGZ1bmN0aW9uICgpIHtcclxuICAgIH0sXHJcbiAgICBnZXROb25jZTogZnVuY3Rpb24gKCkge1xyXG4gICAgfSxcclxuICAgIGdldFdhaXRpbmdXaW5kb3c6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHguZXh0ZW5kKHtcclxuICAgICAgICAgICAgdHlwZTogJ2RlZmF1bHQnLFxyXG4gICAgICAgICAgICB0ZXh0OiBpMThuLm5ldC53YWl0aW5nLmNvbW1pdFRpcFRleHRcclxuICAgICAgICB9LCBvcHRpb25zIHx8IHt9KTtcclxuICAgICAgICBpZiAoeC5pc1VuZGVmaW5lZChvcHRpb25zLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMubmFtZSA9IHguZ2V0RnJpZW5kbHlOYW1lKGxvY2F0aW9uLnBhdGhuYW1lICsgJyQnICsgb3B0aW9ucy50eXBlICsgJyR3YWl0aW5nJHdpbmRvdycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmFtZSA9IG9wdGlvbnMubmFtZTtcclxuICAgICAgICBpZiAoeC5pc1VuZGVmaW5lZCh3aW5kb3dbbmFtZV0pKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT0gJ21pbmknKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dbbmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZSArICctdGV4dCcpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKCc8ZGl2IGlkPVwiJyArIHRoaXMubmFtZSArICctY29udGFpbmVyXCIgY2xhc3M9XCJ4LXVpLWRpYWxvZy13YWl0aW5nLW1pbmktd2luZG93LWNvbnRhaW5lclwiID48ZGl2IGlkPVwiJyArIHRoaXMubmFtZSArICctdGV4dFwiIGNsYXNzPVwieC11aS1kaWFsb2ctd2FpdGluZy1taW5pLXdpbmRvdy10ZXh0XCIgPicgKyB0ZXh0ICsgJzwvZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5xdWVyeSgnW2lkPVwiJyArIHRoaXMubmFtZSArICctdGV4dFwiXScpLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZSArICctY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF4LmlzVW5kZWZpbmVkKGFyZ3VtZW50c1swXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy50ZXh0ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlKHRoaXMub3B0aW9ucy50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC5jc3Muc3R5bGUodGhpcy5jb250YWluZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnNHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJzRweCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNzcy5zdHlsZSh0aGlzLmNvbnRhaW5lciwgeyBkaXNwbGF5OiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PSAncGx1cycpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvd1tuYW1lXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXguaXNVbmRlZmluZWQoYXJndW1lbnRzWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRleHQgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGUodGhpcy5vcHRpb25zLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IHBsdXMubmF0aXZlVUkuc2hvd1dhaXRpbmcodGhpcy5vcHRpb25zLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250YWluZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dbbmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hc2tXcmFwcGVyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2s6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4T3BhY2l0eTogb3B0aW9ucy5tYXhPcGFjaXR5ID8gb3B0aW9ucy5tYXhPcGFjaXR5IDogMC40LFxyXG4gICAgICAgICAgICAgICAgICAgIG1heER1cmF0aW9uOiBvcHRpb25zLm1heER1cmF0aW9uID8gb3B0aW9ucy5tYXhEdXJhdGlvbiA6IDAuMixcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IG9wdGlvbnMuaGVpZ2h0ID8gb3B0aW9ucy5oZWlnaHQgOiA1MCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogb3B0aW9ucy53aWR0aCA/IG9wdGlvbnMud2lkdGggOiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmdlID0geC5wYWdlLmdldFJhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb2ludFggPSAocmFuZ2Uud2lkdGggLSB0aGlzLndpZHRoKSAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb2ludFkgPSAocmFuZ2UuaGVpZ2h0IC0gdGhpcy5oZWlnaHQpIC8gMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC5kb20uZml4ZWQodGhpcy5jb250YWluZXIsIHBvaW50WCwgcG9pbnRZKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1hc2tXcmFwcGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3JhcHBlciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoJzxkaXYgaWQ9XCInICsgdGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlclwiIHN0eWxlPVwiZGlzcGxheTpub25lO1wiID48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLm5hbWUgKyAnLW1hc2tXcmFwcGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5jbGFzc05hbWUgPSAneC11aS1kaWFsb2ctbWFzay13cmFwcGVyJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSB4LnBhZ2UuZ2V0UmFuZ2UoKS5oZWlnaHQgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLndpZHRoID0geC5wYWdlLmdldFJhbmdlKCkud2lkdGggKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3JhcHBlci5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyMnICsgdGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlcicpLmNzcyh7IGRpc3BsYXk6ICcnLCBvcGFjaXR5OiAwLjEgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjJyArIHRoaXMubmFtZSArICctbWFza1dyYXBwZXInKS5mYWRlVG8oKHRoaXMubWF4RHVyYXRpb24gKiAxMDAwKSwgdGhpcy5tYXhPcGFjaXR5LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5uYW1lICsgJy10ZXh0JykgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoJzxkaXYgaWQ9XCInICsgdGhpcy5uYW1lICsgJy1jb250YWluZXJcIiBjbGFzcz1cIngtdWktZGlhbG9nLXdhaXRpbmctd2luZG93LWNvbnRhaW5lclwiID48ZGl2IGlkPVwiJyArIHRoaXMubmFtZSArICctdGV4dFwiIGNsYXNzPVwieC11aS1kaWFsb2ctd2FpdGluZy13aW5kb3ctdGV4dFwiID4nICsgdGV4dCArICc8L2Rpdj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTWFza1dyYXBwZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZSArICctdGV4dCcpLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZSArICctY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc2tXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzaG93OiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2srKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5sb2NrID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubWFza1dyYXBwZXIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1hc2tXcmFwcGVyID0geC51aS5tYXNrLm5ld01hc2tXcmFwcGVyKHRoYXQubmFtZSArICctbWFza1dyYXBwZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHRleHQpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy50ZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY3JlYXRlKHRoYXQub3B0aW9ucy50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYW5nZSA9IHgucGFnZS5nZXRSYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvaW50WCA9IChyYW5nZS53aWR0aCAtIHRoYXQud2lkdGgpIC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb2ludFkgPSAxMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmRvbS5maXhlZCh0aGF0LmNvbnRhaW5lciwgcG9pbnRYLCBwb2ludFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXNrV3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NrLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvY2sgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hc2tXcmFwcGVyICE9IG51bGwgJiYgeC5kb20oJyMnICsgdGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlcicpLmNzcygnZGlzcGxheScpICE9PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5kb20oJyMnICsgdGhhdC5uYW1lICsgJy1tYXNrV3JhcHBlcicpLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvd1tuYW1lXS5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvd1tuYW1lXTtcclxuICAgIH0sXHJcbiAgICBjYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24gKHJlc3BvbnNlLCBvdXRwdXRUeXBlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHgudG9KU09OKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgaWYgKCF4LmlzVW5kZWZpbmVkKHJlc3VsdCkgJiYgIXguaXNVbmRlZmluZWQocmVzdWx0LnN1Y2Nlc3MpICYmIHJlc3VsdC5zdWNjZXNzID09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChvdXRwdXRUeXBlID09ICdjb25zb2xlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHguZGVidWcuZXJyb3IocmVzdWx0Lm1zZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB4Lm1zZyhyZXN1bHQubXNnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgeC5kZWJ1Zy5lcnJvcihleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG52YXIga2V5cyA9IFtcImFjY2Vzcy10b2tlblwiLCBcImNsaWVudC1pZFwiLCBcImNsaWVudC1zaWduYXR1cmVcIiwgXCJ0aW1lc3RhbXBcIiwgXCJub25jZVwiXTtcclxuZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcclxuICAgIHZhciBjYW1lbE5hbWUgPSB4LmNhbWVsQ2FzZShrZXkpO1xyXG4gICAgY2FtZWxOYW1lID0gY2FtZWxOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBjYW1lbE5hbWUuc3Vic3RyKDEpO1xyXG4gICAgZGVmYXVsdHNbJ2dldCcgKyBjYW1lbE5hbWVdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2VbJ3Nlc3Npb24tJyArIGtleV0gfHwgKHgucXVlcnkoJ3Nlc3Npb24tJyArIGtleSkgPT0gbnVsbCA/IG51bGwgOiB4LnF1ZXJ5KCdzZXNzaW9uLScgKyBrZXkpLnZhbHVlKSB8fCAnJztcclxuICAgIH07XHJcbn1cclxudmFyIHNlbGYgPSB7XHJcbiAgICBnZXRXYWl0aW5nV2luZG93OiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBkZWZhdWx0cy5nZXRXYWl0aW5nV2luZG93KG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIHhocjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB1cmwsIHhockRhdGFWYWx1ZSwgb3B0aW9ucztcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyICYmIHgudHlwZShhcmd1bWVudHNbMV0pID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB1cmwgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHhockRhdGFWYWx1ZSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIgJiYgeC50eXBlKGFyZ3VtZW50c1sxXSkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHVybCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICB4aHJEYXRhVmFsdWUgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMyAmJiB4LnR5cGUoYXJndW1lbnRzWzFdKSA9PT0gJ3N0cmluZycgJiYgeC5pc0Z1bmN0aW9uKGFyZ3VtZW50c1syXSkpIHtcclxuICAgICAgICAgICAgdXJsID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICBvcHRpb25zID0geyBjYWxsYmFjazogYXJndW1lbnRzWzJdIH07XHJcbiAgICAgICAgICAgIHhockRhdGFWYWx1ZSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHVybCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgeGhyRGF0YVZhbHVlID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvcHRpb25zID0geC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcclxuICAgICAgICB2YXIgZW5hYmxlV2FpdGluZ1dpbmRvdyA9IHguaXNGdW5jdGlvbihvcHRpb25zLmdldFdhaXRpbmdXaW5kb3cpXHJcbiAgICAgICAgICAgICYmICF4LmlzVW5kZWZpbmVkKG9wdGlvbnMud2FpdGluZ01lc3NhZ2UpXHJcbiAgICAgICAgICAgICYmIG9wdGlvbnMud2FpdGluZ01lc3NhZ2UgIT09ICcnO1xyXG4gICAgICAgIGlmIChlbmFibGVXYWl0aW5nV2luZG93KSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuZ2V0V2FpdGluZ1dpbmRvdyh7IHRleHQ6IG9wdGlvbnMud2FpdGluZ01lc3NhZ2UsIHR5cGU6IHguaXNVbmRlZmluZWQob3B0aW9ucy53YWl0aW5nVHlwZSwgJ2RlZmF1bHQnKSB9KS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0eXBlID0gb3B0aW9ucy50eXBlIHx8ICdQT1NUJztcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBvcHRpb25zLmNvbnRlbnRUeXBlIHx8ICd0ZXh0L2h0bWwnO1xyXG4gICAgICAgIHZhciBhc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgdHJ1ZTtcclxuICAgICAgICB2YXIgZGF0YSA9IHguZXh0ZW5kKHt9LCBvcHRpb25zLmRhdGEgfHwge30pO1xyXG4gICAgICAgIGlmICh4LnR5cGUoeGhyRGF0YVZhbHVlKSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZGF0YSA9IHguZXh0ZW5kKGRhdGEsIHhockRhdGFWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgeG1sID0geC50b1hNTCh4aHJEYXRhVmFsdWUsIDEpO1xyXG4gICAgICAgICAgICBpZiAoeGhyRGF0YVZhbHVlICE9ICcnICYmIHhtbCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtvcHRpb25zLnhockRhdGFLZXldID0geGhyRGF0YVZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCF4bWwgJiYgeGhyRGF0YVZhbHVlLmluZGV4T2YoJz0nKSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBsaXN0ID0geGhyRGF0YVZhbHVlLnNwbGl0KCcmJyk7XHJcbiAgICAgICAgICAgICAgICB4LmVhY2gobGlzdCwgZnVuY3Rpb24gKGluZGV4LCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gbm9kZS5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2l0ZW1zWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChpdGVtc1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHguaXNGdW5jdGlvbihvcHRpb25zLmdldEFjY2Vzc1Rva2VuKSAmJiBvcHRpb25zLmdldEFjY2Vzc1Rva2VuKCkgIT0gJycpIHtcclxuICAgICAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuZ2V0QWNjZXNzVG9rZW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoeC5pc0Z1bmN0aW9uKG9wdGlvbnMuZ2V0Q2xpZW50SWQpICYmIG9wdGlvbnMuZ2V0Q2xpZW50SWQoKSAhPSAnJykge1xyXG4gICAgICAgICAgICBkYXRhLmNsaWVudElkID0gb3B0aW9ucy5nZXRDbGllbnRJZCgpO1xyXG4gICAgICAgICAgICBpZiAoeC5pc0Z1bmN0aW9uKG9wdGlvbnMuZ2V0Q2xpZW50SWQpICYmIG9wdGlvbnMuZ2V0Q2xpZW50U2lnbmF0dXJlKCkgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuY2xpZW50U2lnbmF0dXJlID0gb3B0aW9ucy5nZXRDbGllbnRTaWduYXR1cmUoKTtcclxuICAgICAgICAgICAgICAgIGRhdGEudGltZXN0YW1wID0gb3B0aW9ucy5nZXRUaW1lc3RhbXAoKTtcclxuICAgICAgICAgICAgICAgIGRhdGEubm9uY2UgPSBvcHRpb25zLmdldE5vbmNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZi5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZSxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgYXN5bmM6IGFzeW5jLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbmFibGVXYWl0aW5nV2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5nZXRXYWl0aW5nV2luZG93KHsgdHlwZTogeC5pc1VuZGVmaW5lZChvcHRpb25zLndhaXRpbmdUeXBlLCAnZGVmYXVsdCcpIH0pLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnJldHVyblR5cGUgPT0gJ2pzb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jYXRjaEV4Y2VwdGlvbihyZXNwb25zZSwgb3B0aW9ucy5vdXRwdXRFeGNlcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB4LnRvSlNPTihyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHguaXNVbmRlZmluZWQocmVzdWx0KSB8fCB4LmlzVW5kZWZpbmVkKHJlc3VsdC5tZXNzYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmNhbGwob3B0aW9ucy5jYWxsYmFjaywgeC50b0pTT04ocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gcmVzdWx0Lm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoTnVtYmVyKG1lc3NhZ2UucmV0dXJuQ29kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5tc2cobWVzc2FnZS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhb3B0aW9ucy5wb3BDb3JyZWN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5tc2cobWVzc2FnZS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguY2FsbChvcHRpb25zLmNhbGxiYWNrLCB4LnRvSlNPTihyZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFvcHRpb25zLnBvcEluY29ycmVjdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgubXNnKG1lc3NhZ2UudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNhbGwob3B0aW9ucy5jYWxsYmFjaywgeC50b0pTT04ocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHguY2FsbChvcHRpb25zLmNhbGxiYWNrLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XHJcbiAgICAgICAgICAgICAgICB4LmRlYnVnLmxvZyhYTUxIdHRwUmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHguaXNGdW5jdGlvbihvcHRpb25zLmVycm9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChYTUxIdHRwUmVxdWVzdC5zdGF0dXMgPT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgubXNnKGkxOG4ubmV0LmVycm9yc1snNDAxJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChYTUxIdHRwUmVxdWVzdC5zdGF0dXMgPT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgubXNnKGkxOG4ubmV0LmVycm9yc1snNDA0J10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChYTUxIdHRwUmVxdWVzdC5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgubXNnKGkxOG4ubmV0LmVycm9yc1snNTAwJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChYTUxIdHRwUmVxdWVzdC5zdGF0dXMgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmRlYnVnLmVycm9yKGkxOG4ubmV0LmVycm9yc1sndW5rb3duJ10uZm9ybWF0KFhNTEh0dHBSZXF1ZXN0LnN0YXR1cyArIChYTUxIdHRwUmVxdWVzdC5zdGF0dXNUZXh0ICE9ICcnID8gKCcgJyArIFhNTEh0dHBSZXF1ZXN0LnN0YXR1c1RleHQpIDogJycpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcmVxdWlyZUxvYWRlZDoge30sXHJcbiAgICByZXF1aXJlOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB4LmV4dGVuZCh7XHJcbiAgICAgICAgICAgIGZpbGVUeXBlOiAnc2NyaXB0JyxcclxuICAgICAgICAgICAgaWQ6ICcnLFxyXG4gICAgICAgICAgICBwYXRoOiAnJyxcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgfSwgb3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaWQgIT0gJycgJiYgc2VsZi5yZXF1aXJlTG9hZGVkW29wdGlvbnMuaWRdKSB7XHJcbiAgICAgICAgICAgIHguZGVidWcubG9nKHguc3RyaW5nLmZvcm1hdCgncmVxdWlyZSBmaWxlIHtcImlkXCI6XCJ7MH1cIiwgcGF0aDpcInsxfVwifSBleGlzdC4gW2FqYXhdJywgb3B0aW9ucy5pZCwgb3B0aW9ucy5wYXRoKSk7XHJcbiAgICAgICAgICAgIHguY2FsbChvcHRpb25zLmNhbGxiYWNrKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHguZGVidWcubG9nKHguc3RyaW5nLmZvcm1hdCgncmVxdWlyZSBmaWxlIHtcImlkXCI6XCJ7MH1cIiwgcGF0aDpcInsxfVwifSBsb2FkaW5nLiBbYWpheF0nLCBvcHRpb25zLmlkLCBvcHRpb25zLnBhdGgpKTtcclxuICAgICAgICBzZWxmLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBvcHRpb25zLnR5cGUsXHJcbiAgICAgICAgICAgIHVybDogb3B0aW9ucy5wYXRoLFxyXG4gICAgICAgICAgICBhc3luYzogb3B0aW9ucy5hc3luYyxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgeC5kZWJ1Zy5sb2coeC5zdHJpbmcuZm9ybWF0KCdyZXF1aXJlIGZpbGUge1wiaWRcIjpcInswfVwiLCBwYXRoOlwiezF9XCJ9IGZpbmlzaGVkLiBbYWpheF0nLCBvcHRpb25zLmlkLCBvcHRpb25zLnBhdGgpKTtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkhFQURcIikuaXRlbSgwKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmZpbGVUeXBlID09ICd0ZW1wbGF0ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnR5cGUgPSBcInRleHQvdGVtcGxhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnNyYyA9IG9wdGlvbnMucGF0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMuZmlsZVR5cGUgPT0gJ2NzcycpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmhyZWYgPSBvcHRpb25zLnBhdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmxhbmd1YWdlID0gXCJqYXZhc2NyaXB0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnNyYyA9IG9wdGlvbnMucGF0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZVRleHQpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUudGV4dCA9IHJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmlkICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pZCA9IG9wdGlvbnMuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXF1aXJlTG9hZGVkW29wdGlvbnMuaWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB4LmNhbGwob3B0aW9ucy5jYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBhamF4OiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gc2VsZi5uZXdIdHRwUmVxdWVzdChvcHRpb25zKTtcclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH0sXHJcbiAgICBuZXdIdHRwUmVxdWVzdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgeGhyOiBudWxsLFxyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICB0aW1lb3V0OiA5MCxcclxuICAgICAgICAgICAgZG9uZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnhociA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54aHIgPSBzZWxmLm5ld1htbEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnhocikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmRlYnVnLmVycm9yKCdjcmVhdGUgeGhyIGZhaWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy54aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsLCB0aGlzLmFzeW5jKTtcclxuICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBldmVudC5hZGQodGhpcy54aHIsIFwicmVhZHlzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHhociA9IG1lLnhocjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAhbWUuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAwIHx8ICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09IDMwNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jYWxsKG1lLnN1Y2Nlc3MsIHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jYWxsKG1lLmVycm9yLCB4aHIsIHhoci5zdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhociA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgbWUuZG9uZSA9IHRydWU7IH0sIG1lLnRpbWVvdXQgKiAxMDAwKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT0gJ1BPU1QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnhoci5zZW5kKHguc2VyaWFsaXplKHRoaXMuZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54aHIuc2VuZChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHguZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDkwXHJcbiAgICAgICAgICAgICAgICB9LCBvcHRpb25zIHx8IHt9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cmwgPSBvcHRpb25zLnVybDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXN5bmMgPSBvcHRpb25zLmFzeW5jO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IG9wdGlvbnMuZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcXVlc3QuY3JlYXRlKG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xyXG4gICAgfSxcclxuICAgIG5ld1htbEh0dHBSZXF1ZXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG51bGw7XHJcbiAgICAgICAgdmFyIGdsb2JhbCA9IHguZ2xvYmFsKCk7XHJcbiAgICAgICAgaWYgKGdsb2JhbFtcIkFjdGl2ZVhPYmplY3RcIl0pIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTXN4bWwyLlhNTEhUVFBcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICB4aHIgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGdsb2JhbFtcIlhNTEh0dHBSZXF1ZXN0XCJdKSB7XHJcbiAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geGhyO1xyXG4gICAgfSxcclxuICAgIHJlcXVlc3Q6IHtcclxuICAgICAgICBmaW5kOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRWYWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQoJyYnKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdFtpXS5pbmRleE9mKGtleSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChsaXN0W2ldLnJlcGxhY2Uoa2V5ICsgJz0nLCAnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRWYWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpbmRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG91dFN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQoJyYnKTtcclxuICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB0ZW1wO1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgPSAneyc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGVtcCA9IGxpc3RbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSAnXCInICsgdGVtcFswXSArICdcIjpcIicgKyBkZWNvZGVVUklDb21wb25lbnQodGVtcFsxXSkgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsaXN0Lmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9ICcsJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRTdHJpbmcgKz0gJ30nO1xyXG4gICAgICAgICAgICByZXR1cm4geC5ldmFsSlNPTihvdXRTdHJpbmcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0UmF3VXJsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24ub3JpZ2luLCAnJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBoYXNoOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhdGlvbi5oYXNoID09PSAoJyMnICsga2V5KSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbnZhciByZXF1ZXN0X2NhbGxiYWNrID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0geC50b0pTT04ocmVzcG9uc2UpLm1lc3NhZ2U7XHJcbiAgICBzd2l0Y2ggKE51bWJlcihyZXN1bHQucmV0dXJuQ29kZSkpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICB4Lm1zZyhyZXN1bHQudmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB4Lm1zZyhyZXN1bHQudmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHggPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xyXG52YXIgc3RyaW5nID0gcmVxdWlyZShcIi4vc3RyaW5nXCIpO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgJ3RyaW0nOiAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csXHJcbiAgICAgICAgJ2RhdGUnOiAvKCheKCgxWzgtOV1cXGR7Mn0pfChbMi05XVxcZHszfSkpKFstXFwvXFwuX10pKDEwfDEyfDA/WzEzNTc4XSkoWy1cXC9cXC5fXSkoM1swMV18WzEyXVswLTldfDA/WzEtOV0pJCl8KF4oKDFbOC05XVxcZHsyfSl8KFsyLTldXFxkezN9KSkoWy1cXC9cXC5fXSkoMTF8MD9bNDY5XSkoWy1cXC9cXC5fXSkoMzB8WzEyXVswLTldfDA/WzEtOV0pJCl8KF4oKDFbOC05XVxcZHsyfSl8KFsyLTldXFxkezN9KSkoWy1cXC9cXC5fXSkoMD8yKShbLVxcL1xcLl9dKSgyWzAtOF18MVswLTldfDA/WzEtOV0pJCl8KF4oWzI0NjhdWzA0OF0wMCkoWy1cXC9cXC5fXSkoMD8yKShbLVxcL1xcLl9dKSgyOSkkKXwoXihbMzU3OV1bMjZdMDApKFstXFwvXFwuX10pKDA/MikoWy1cXC9cXC5fXSkoMjkpJCl8KF4oWzFdWzg5XVswXVs0OF0pKFstXFwvXFwuX10pKDA/MikoWy1cXC9cXC5fXSkoMjkpJCl8KF4oWzItOV1bMC05XVswXVs0OF0pKFstXFwvXFwuX10pKDA/MikoWy1cXC9cXC5fXSkoMjkpJCl8KF4oWzFdWzg5XVsyNDY4XVswNDhdKShbLVxcL1xcLl9dKSgwPzIpKFstXFwvXFwuX10pKDI5KSQpfCheKFsyLTldWzAtOV1bMjQ2OF1bMDQ4XSkoWy1cXC9cXC5fXSkoMD8yKShbLVxcL1xcLl9dKSgyOSkkKXwoXihbMV1bODldWzEzNTc5XVsyNl0pKFstXFwvXFwuX10pKDA/MikoWy1cXC9cXC5fXSkoMjkpJCl8KF4oWzItOV1bMC05XVsxMzU3OV1bMjZdKShbLVxcL1xcLl9dKSgwPzIpKFstXFwvXFwuX10pKDI5KSQpKS9nLFxyXG4gICAgICAgICd1cmwnOiBcIl4oKGh0dHBzfGh0dHB8ZnRwfHJ0c3B8bW1zKT86Ly8pPygoWzAtOWEtel8hfionKCkuJj0rJCUtXSs6ICk/WzAtOWEtel8hfionKCkuJj0rJCUtXStAKT8oKFswLTldezEsM31cXC4pezN9WzAtOV17MSwzfXwoWzAtOWEtel8hfionKCktXStcXC4pKihbMC05YS16XVswLTlhLXotXXswLDYxfSk/WzAtOWEtel1cXC5bYS16XXsyLDZ9KSg6WzAtOV17MSw0fSk/KCgvPyl8KC9bMC05YS16XyF+KicoKS47PzpAJj0rJCwlIy1dKykrLz8pJFwiLFxyXG4gICAgICAgICd0ZWxlcGhvbmUnOiAvKF5cXGQrJCl8KCheXFxkKykoW1xcZHxcXC1dKykoKFxcZCspJCkpfCgoXlxcKykoW1xcZHxcXC1dKykoKFxcZCspJCkpL2csXHJcbiAgICAgICAgJ25vbi10ZWxlcGhvbmUnOiAvW15cXGRcXC1cXCtdL2csXHJcbiAgICAgICAgJ2VtYWlsJzogL15cXHcrKCgtXFx3Kyl8KFxcX1xcdyspfChcXCdcXHcrKXwoXFwuXFx3KykpKlxcQFtBLVphLXowLTldKygoXFwufC0pW0EtWmEtejAtOV0rKSpcXC5bQS1aYS16MC05XSskL2csXHJcbiAgICAgICAgJ3FxJzogL15cXHcrKCgtXFx3Kyl8KFxcX1xcdyspfChcXCdcXHcrKXwoXFwuXFx3KykpKlxcQFtBLVphLXowLTldKygoXFwufC0pW0EtWmEtejAtOV0rKSpcXC5bQS1aYS16MC05XSskL2csXHJcbiAgICAgICAgJ251bWJlcic6IC8oXi0/XFxkKyQpfCheLT9cXGQrW1xcLj9dXFxkKyQpL2csXHJcbiAgICAgICAgJ25vbi1udW1iZXInOiAvW15cXGRcXC5cXC1dL2csXHJcbiAgICAgICAgJ2ludGVnZXInOiAvXi0/XFxkKyQvZyxcclxuICAgICAgICAncG9zaXRpdmUtaW50ZWdlcic6IC9eXFxkKyQvZyxcclxuICAgICAgICAnbm9uLWludGVnZXInOiAvW15cXGRcXC1dL2csXHJcbiAgICAgICAgJ3NhZmVUZXh0JzogL0EtWmEtejAtOV9cXC0vZyxcclxuICAgICAgICAnbm9uLXNhZmVUZXh0JzogL1teQS1aYS16MC05X1xcLV0vZyxcclxuICAgICAgICAnZmlsZUV4dCc6ICdqcGcsZ2lmLGpwZWcscG5nLGJtcCxwc2Qsc2l0LHRpZix0aWZmLGVwcyxwbmcsYWkscXhkLHBkZixjZHIsemlwLHJhcicsXHJcbiAgICAgICAgJ2VuLXVzJzoge1xyXG4gICAgICAgICAgICAnemlwY29kZSc6IC9eXFxkezV9LVxcZHs0fSR8XlxcZHs1fSQvZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ3poLWNuJzoge1xyXG4gICAgICAgICAgICAnaWRlbnRpdHlDYXJkJzogLyheXFxkezE1fSQpfCheXFxkezE4fSQpfCheXFxkezE3fVtYfHhdJCkvZyxcclxuICAgICAgICAgICAgJ3ppcGNvZGUnOiAvXlxcZHs2fSQvZ1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtYXRjaDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgdGV4dCA9IFN0cmluZyhvcHRpb25zLnRleHQpO1xyXG4gICAgICAgIHZhciBpZ25vcmVDYXNlID0gb3B0aW9ucy5pZ25vcmVDYXNlO1xyXG4gICAgICAgIHZhciByZWdleHBOYW1lID0gb3B0aW9ucy5yZWdleHBOYW1lO1xyXG4gICAgICAgIHZhciByZWdleHAgPSB0eXBlb2YgKG9wdGlvbnMucmVnZXhwKSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBuZXcgUmVnRXhwKG9wdGlvbnMucmVnZXhwKTtcclxuICAgICAgICBpZiAoaWdub3JlQ2FzZSA9PT0gMSkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIChyZWdleHApID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHJlZ2V4cE5hbWUpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZWdleHAgPSBzZWxmLnJ1bGVzW3JlZ2V4cE5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5tYXRjaChyZWdleHApO1xyXG4gICAgfSxcclxuICAgIGV4aXN0czogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgdGV4dCA9IFN0cmluZyhvcHRpb25zLnRleHQpO1xyXG4gICAgICAgIHZhciBpZ25vcmVDYXNlID0gb3B0aW9ucy5pZ25vcmVDYXNlO1xyXG4gICAgICAgIHZhciByZWdleHBOYW1lID0gb3B0aW9ucy5yZWdleHBOYW1lO1xyXG4gICAgICAgIHZhciByZWdleHAgPSB0eXBlb2YgKG9wdGlvbnMucmVnZXhwKSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBuZXcgUmVnRXhwKG9wdGlvbnMucmVnZXhwKTtcclxuICAgICAgICBpZiAoaWdub3JlQ2FzZSkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIChyZWdleHApID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHJlZ2V4cE5hbWUpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZWdleHAgPSBzZWxmLnJ1bGVzW3JlZ2V4cE5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5tYXRjaChyZWdleHApICE9PSBudWxsO1xyXG4gICAgfSxcclxuICAgIGlzRmlsZUV4dDogZnVuY3Rpb24gKHBhdGgsIGFsbG93RmlsZUV4dCkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICB2YXIgZXh0ID0gcGF0aC5zdWJzdHIocGF0aC5sYXN0SW5kZXhPZignLicpLCBwYXRoLmxlbmd0aCAtIHBhdGgubGFzdEluZGV4T2YoJy4nKSk7XHJcbiAgICAgICAgdmFyIGV4dFZhbHVlID0gKChhbGxvd0ZpbGVFeHQpID8gYWxsb3dGaWxlRXh0IDogc2VsZi5ydWxlc1snZmlsZUV4dCddKTtcclxuICAgICAgICBleHQgPSBleHQucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgICBpZiAoZXh0VmFsdWUuaW5kZXhPZignLCcpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gZXh0VmFsdWUuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXh0LnRvTG93ZXJDYXNlKCkgPT0gbGlzdFtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChleHQudG9Mb3dlckNhc2UoKSA9PSBleHRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIGlzVXJsOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXh0LnRvTG93ZXJDYXNlKCkuZXhpc3RzKHNlbGYucnVsZXNbJ3VybCddKTtcclxuICAgIH0sXHJcbiAgICBpc0VtYWlsOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXh0LnRvTG93ZXJDYXNlKCkuZXhpc3RzKHNlbGYucnVsZXNbJ2VtYWlsJ10pO1xyXG4gICAgfSxcclxuICAgIGlzWmlwY29kZTogZnVuY3Rpb24gKHRleHQsIG5hdHVyZSkge1xyXG4gICAgICAgIG5hdHVyZSA9IHguZm9ybWF0TG9jYWxlKG5hdHVyZSk7XHJcbiAgICAgICAgcmV0dXJuIHRleHQuZXhpc3RzKHNlbGYucnVsZXNbbmF0dXJlXVsnemlwY29kZSddKTtcclxuICAgIH0sXHJcbiAgICBpc1NhZmVUZXh0OiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXh0LmV4aXN0cyhzZWxmLnJ1bGVzWydzYWZlVGV4dCddKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRUZWxlcGhvbmU6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShzZWxmLnJ1bGVzWydub24tdGVsZXBob25lJ10sICcnKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRJbnRlZ2VyOiBmdW5jdGlvbiAodmFsdWUsIHJlbW92ZVBhZGRpbmdaZXJvKSB7XHJcbiAgICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpLnJlcGxhY2Uoc2VsZi5ydWxlc1snbm9uLWludGVnZXInXSwgJycpO1xyXG4gICAgICAgIGlmIChzdHJpbmcudHJpbSh2YWx1ZSkgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gJzAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVtb3ZlUGFkZGluZ1plcm8pIHtcclxuICAgICAgICAgICAgdmFsdWUgPSBTdHJpbmcocGFyc2VJbnQodmFsdWUsIDEwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXROdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSwgcmVtb3ZlUGFkZGluZ1plcm8pIHtcclxuICAgICAgICBpZiAocmVtb3ZlUGFkZGluZ1plcm8gPT09IHZvaWQgMCkgeyByZW1vdmVQYWRkaW5nWmVybyA9IHRydWU7IH1cclxuICAgICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSkucmVwbGFjZShzZWxmLnJ1bGVzWydub24tbnVtYmVyJ10sICcnKTtcclxuICAgICAgICB2YWx1ZSA9ICh2YWx1ZS50cmltKCkgPT09ICcnKSA/ICcwJyA6IHZhbHVlO1xyXG4gICAgICAgIGlmIChyZW1vdmVQYWRkaW5nWmVybykge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IFN0cmluZyhwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXROdW1iZXJSb3VuZDI6IGZ1bmN0aW9uICh2YWx1ZSwgcmVtb3ZlUGFkZGluZ1plcm8pIHtcclxuICAgICAgICBpZiAocmVtb3ZlUGFkZGluZ1plcm8gPT09IHZvaWQgMCkgeyByZW1vdmVQYWRkaW5nWmVybyA9IHRydWU7IH1cclxuICAgICAgICB2YXIgdGV4dCA9ICcnICsgTWF0aC5yb3VuZChOdW1iZXIoc2VsZi5mb3JtYXROdW1iZXIodmFsdWUpKSAqIDEwMCkgLyAxMDA7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGV4dC5pbmRleE9mKCcuJyk7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dCArICcuMDAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIGluZGV4ICsgMSkgKyB0ZXh0LnN1YnN0cmluZyhpbmRleCArIDEsIGluZGV4ICsgMyk7XHJcbiAgICAgICAgaWYgKGluZGV4ICsgMiA9PSB0ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0ZXh0ICs9ICcwJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlbW92ZVBhZGRpbmdaZXJvKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh0ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdE51bWJlclJvdW5kOiBmdW5jdGlvbiAodmFsdWUsIGxlbmd0aCwgcmVtb3ZlUGFkZGluZ1plcm8pIHtcclxuICAgICAgICBpZiAobGVuZ3RoID09PSB2b2lkIDApIHsgbGVuZ3RoID0gMjsgfVxyXG4gICAgICAgIGlmIChyZW1vdmVQYWRkaW5nWmVybyA9PT0gdm9pZCAwKSB7IHJlbW92ZVBhZGRpbmdaZXJvID0gdHJ1ZTsgfVxyXG4gICAgICAgIHZhciBtdWx0aXBsZSA9IDEwO1xyXG4gICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGNvdW50IDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIG11bHRpcGxlICo9IDEwO1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGV4dCA9ICcnICsgTWF0aC5yb3VuZChOdW1iZXIoc2VsZi5mb3JtYXROdW1iZXIodmFsdWUpKSAqIG11bHRpcGxlKSAvIG11bHRpcGxlO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRleHQuaW5kZXhPZignLicpO1xyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQgKyAnLjAwJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCBpbmRleCArIDEpICsgdGV4dC5zdWJzdHJpbmcoaW5kZXggKyAxLCBpbmRleCArIGxlbmd0aCArIDEpO1xyXG4gICAgICAgIHdoaWxlICgoaW5kZXggKyBsZW5ndGgpID4gdGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGV4dCArPSAnMCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZW1vdmVQYWRkaW5nWmVybykge1xyXG4gICAgICAgICAgICB0ZXh0ID0gcGFyc2VGbG9hdCh0ZXh0KS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRTYWZlVGV4dDogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHNlbGYucnVsZXNbJ25vbi1zYWZlVGV4dCddLCAnJyk7XHJcbiAgICB9XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciB4ID0gcmVxdWlyZShcIi4vYmFzZVwiKTtcclxudmFyIHRyaW1FeHByID0gL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG91dFN0cmluZyA9ICcnO1xyXG4gICAgICAgIHZhciB0eXBlID0geC50eXBlKHZhbHVlKTtcclxuICAgICAgICBpZiAodHlwZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJyB8fCB0eXBlID09PSAnZGF0ZScpIHtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IHZhbHVlICsgJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ2FycmF5Jykge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gJ1snO1xyXG4gICAgICAgICAgICAgICAgeC5lYWNoKHZhbHVlLCBmdW5jdGlvbiAoaW5kZXgsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gc2VsZi5zdHJpbmdpZnkodmFsdWUpICsgJywnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBzZWxmLnJ0cmltKG91dFN0cmluZywgJywnKTtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSAnXSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gc2VsZi5zdHJpbmdpZnkodmFsdWUuY2FsbCh2YWx1ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG91dFN0cmluZyA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0U3RyaW5nO1xyXG4gICAgfSxcclxuICAgIHRyaW06IGZ1bmN0aW9uICh0ZXh0LCB0cmltVGV4dCkge1xyXG4gICAgICAgIGlmICh0cmltVGV4dCA9PT0gdm9pZCAwKSB7IHRyaW1UZXh0ID0gdW5kZWZpbmVkOyB9XHJcbiAgICAgICAgaWYgKHguaXNVbmRlZmluZWQodHJpbVRleHQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodHJpbUV4cHIsICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnJ0cmltKHNlbGYubHRyaW0odGV4dCwgdHJpbVRleHQpLCB0cmltVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGx0cmltOiBmdW5jdGlvbiAodGV4dCwgdHJpbVRleHQpIHtcclxuICAgICAgICBpZiAodHJpbVRleHQgPT09IHZvaWQgMCkgeyB0cmltVGV4dCA9IHVuZGVmaW5lZDsgfVxyXG4gICAgICAgIGlmICh4LmlzVW5kZWZpbmVkKHRyaW1UZXh0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC8oXltcXHNcXHVGRUZGXFx4QTBdKykvZywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShSZWdFeHAoJyheJyArIHRyaW1UZXh0LnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykgKyAnKScsICdnaScpLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJ0cmltOiBmdW5jdGlvbiAodGV4dCwgdHJpbVRleHQpIHtcclxuICAgICAgICBpZiAodHJpbVRleHQgPT09IHZvaWQgMCkgeyB0cmltVGV4dCA9IHVuZGVmaW5lZDsgfVxyXG4gICAgICAgIGlmICh4LmlzVW5kZWZpbmVkKHRyaW1UZXh0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC8oW1xcc1xcdUZFRkZcXHhBMF0rJCkvZywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShSZWdFeHAoJygnICsgdHJpbVRleHQucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKSArICckKScsICdnaScpLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGZvcm1hdDogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGV4dCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKCdcXFxceycgKyAoaSAtIDEpICsgJ1xcXFx9JywgJ2dtJyk7XHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UocmUsIGFyZ3VtZW50c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfSxcclxuICAgIGVsbGlwc2lzOiBmdW5jdGlvbiAodGV4dCwgbGVuZ3RoLCBoYXNFbGxpcHNpcykge1xyXG4gICAgICAgIGlmIChoYXNFbGxpcHNpcyA9PT0gdm9pZCAwKSB7IGhhc0VsbGlwc2lzID0gdHJ1ZTsgfVxyXG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRleHQubGVuZ3RoID4gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnN1YnN0cigwLCBsZW5ndGgpICsgKGhhc0VsbGlwc2lzID8gJy4uLicgOiAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIl19
