(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.x = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var base = require("./lib/base");
var event = require("./lib/event");
var Queue = require("./lib/collections/Queue");
var Stack = require("./lib/collections/Stack");
var color = require("./lib/color");
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
var global = x.global();
if (global.x) {
    global._x_ = global.x;
}
global.x = x;
module.exports = x;

},{"./lib/base":2,"./lib/collections/Queue":9,"./lib/collections/Stack":10,"./lib/color":11,"./lib/date":12,"./lib/encoding":13,"./lib/event":14,"./lib/net":15,"./lib/regexp":16,"./lib/string":17}],2:[function(require,module,exports){
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
        var that = timers[this.name] = this;
        this.timerId = setInterval(function () { timers[that.name].run(); }, this.interval);
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
        if (lang.isArray(data)) {
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
var self = {
    create: function () {
        return self.constructor();
    },
    constructor: function () {
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
    }
};
module.exports = self;

},{}],10:[function(require,module,exports){
"use strict";
var self = {
    create: function () {
        return self.constructor();
    },
    constructor: function () {
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
    }
};
module.exports = self;

},{}],11:[function(require,module,exports){
"use strict";
var self = {
    hex: function (colorRgbCode) {
        if (/^(rgb|RGB)/.test(colorRgbCode)) {
            var colorBuffer = colorRgbCode.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
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

},{"./base":2}],13:[function(require,module,exports){
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

},{"./base":2,"./string":17}],14:[function(require,module,exports){
"use strict";
var self = {
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
    },
    fire: function (target, type) {
        var events = target._listeners[type];
        if (events instanceof Array) {
            for (var i = 0, length = events.length; i < length; i++) {
                if (typeof events[i] === "function") {
                    events[i]({ type: type });
                }
            }
        }
        return target;
    }
};
module.exports = self;

},{}],15:[function(require,module,exports){
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

},{"./base":2,"./event":14}],16:[function(require,module,exports){
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

},{"./base":2,"./string":17}],17:[function(require,module,exports){
"use strict";
var x = require("./base");
var trimExpr = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
var self = {
    stringify: function (value) {
        var type = x.type(value);
        if (type !== 'string') {
            if (type === 'number' || type === 'boolean' || type === 'date') {
                value += '';
            }
            else if (type === 'function') {
                value = self.stringify(value.call(value));
            }
            else {
                value = '';
            }
        }
        return value;
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
    left: function (text, length, hasEllipsis) {
        if (hasEllipsis === void 0) { hasEllipsis = true; }
        if (text.length === 0) {
            return text;
        }
        if (text.length > length) {
            return text.substr(0, length) + ((hasEllipsis) ? '...' : '');
        }
        else {
            return text;
        }
    }
};
module.exports = self;

},{"./base":2}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsImxpYi9iYXNlLmpzIiwibGliL2Jhc2UvU3RyaW5nQnVpbGRlci5qcyIsImxpYi9iYXNlL1RpbWVyLmpzIiwibGliL2Jhc2UvZGVjbGFyZS5qcyIsImxpYi9iYXNlL2tlcm5lbC5qcyIsImxpYi9iYXNlL2xhbmcuanMiLCJsaWIvY29sbGVjdGlvbnMvSGFzaHRhYmxlLmpzIiwibGliL2NvbGxlY3Rpb25zL1F1ZXVlLmpzIiwibGliL2NvbGxlY3Rpb25zL1N0YWNrLmpzIiwibGliL2NvbG9yLmpzIiwibGliL2RhdGUuanMiLCJsaWIvZW5jb2RpbmcuanMiLCJsaWIvZXZlbnQuanMiLCJsaWIvbmV0LmpzIiwibGliL3JlZ2V4cC5qcyIsImxpYi9zdHJpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGJhc2UgPSByZXF1aXJlKFwiLi9saWIvYmFzZVwiKTtcclxudmFyIGV2ZW50ID0gcmVxdWlyZShcIi4vbGliL2V2ZW50XCIpO1xyXG52YXIgUXVldWUgPSByZXF1aXJlKFwiLi9saWIvY29sbGVjdGlvbnMvUXVldWVcIik7XHJcbnZhciBTdGFjayA9IHJlcXVpcmUoXCIuL2xpYi9jb2xsZWN0aW9ucy9TdGFja1wiKTtcclxudmFyIGNvbG9yID0gcmVxdWlyZShcIi4vbGliL2NvbG9yXCIpO1xyXG52YXIgZW5jb2RpbmcgPSByZXF1aXJlKFwiLi9saWIvZW5jb2RpbmdcIik7XHJcbnZhciByZWdleHAgPSByZXF1aXJlKFwiLi9saWIvcmVnZXhwXCIpO1xyXG52YXIgc3RyaW5nID0gcmVxdWlyZShcIi4vbGliL3N0cmluZ1wiKTtcclxudmFyIGRhdGUgPSByZXF1aXJlKFwiLi9saWIvZGF0ZVwiKTtcclxudmFyIG5ldCA9IHJlcXVpcmUoXCIuL2xpYi9uZXRcIik7XHJcbnZhciB4ID0gYmFzZS5leHRlbmQoe30sIGJhc2UsIHtcclxuICAgIGV2ZW50OiBldmVudCxcclxuICAgIHF1ZXVlOiBRdWV1ZSxcclxuICAgIHN0YWNrOiBTdGFjayxcclxuICAgIGNvbG9yOiBjb2xvcixcclxuICAgIGVuY29kaW5nOiBlbmNvZGluZyxcclxuICAgIHJlZ2V4cDogcmVnZXhwLFxyXG4gICAgc3RyaW5nOiBzdHJpbmcsXHJcbiAgICBkYXRlOiBkYXRlLFxyXG4gICAgb246IGV2ZW50LmFkZCxcclxuICAgIG5ldDogbmV0XHJcbn0pO1xyXG5iYXNlLmV4dGVuZCh4LCB7XHJcbiAgICBvbjogZXZlbnQuYWRkLFxyXG4gICAgb2ZmOiBldmVudC5yZW1vdmUsXHJcbiAgICB4aHI6IG5ldC54aHJcclxufSk7XHJcbnZhciBnbG9iYWwgPSB4Lmdsb2JhbCgpO1xyXG5pZiAoZ2xvYmFsLngpIHtcclxuICAgIGdsb2JhbC5feF8gPSBnbG9iYWwueDtcclxufVxyXG5nbG9iYWwueCA9IHg7XHJcbm1vZHVsZS5leHBvcnRzID0geDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBsYW5nID0gcmVxdWlyZShcIi4vYmFzZS9sYW5nXCIpO1xyXG52YXIga2VybmVsID0gcmVxdWlyZShcIi4vYmFzZS9rZXJuZWxcIik7XHJcbnZhciBkZWNsYXJlID0gcmVxdWlyZShcIi4vYmFzZS9kZWNsYXJlXCIpO1xyXG52YXIgSGFzaHRhYmxlID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvSGFzaHRhYmxlXCIpO1xyXG52YXIgUXVldWUgPSByZXF1aXJlKFwiLi9jb2xsZWN0aW9ucy9RdWV1ZVwiKTtcclxudmFyIFN0YWNrID0gcmVxdWlyZShcIi4vY29sbGVjdGlvbnMvU3RhY2tcIik7XHJcbnZhciBzZWxmID0gbGFuZy5leHRlbmQoe30sIGxhbmcsIGtlcm5lbCwge1xyXG4gICAgZGVjbGFyZTogZGVjbGFyZSxcclxuICAgIHF1ZXJ5OiBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICBpZiAobGFuZy50eXBlKHNlbGVjdG9yKS5pbmRleE9mKCdodG1sJykgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGxhbmcudHlwZShzZWxlY3RvcikgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBxdWVyeUFsbDogZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgaWYgKGxhbmcudHlwZShzZWxlY3RvcikuaW5kZXhPZignaHRtbCcpID09IDApIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGxhbmcudHlwZShzZWxlY3RvcikgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjb2xsZWN0aW9uczoge30sXHJcbn0pO1xyXG52YXIgY29sbGVjdGlvbnMgPSB7XHJcbiAgICBIYXNodGFibGU6IEhhc2h0YWJsZSxcclxuICAgIFF1ZXVlOiBRdWV1ZSxcclxuICAgIFN0YWNrOiBTdGFjayxcclxufTtcclxubGFuZy5leHRlbmQoc2VsZi5jb2xsZWN0aW9ucywgY29sbGVjdGlvbnMpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHNlbGY7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBTdHJpbmdCdWlsZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFN0cmluZ0J1aWxkZXIoKSB7XHJcbiAgICAgICAgdGhpcy5pbm5lckFycmF5ID0gW107XHJcbiAgICB9XHJcbiAgICBTdHJpbmdCdWlsZGVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHRoaXMuaW5uZXJBcnJheVt0aGlzLmlubmVyQXJyYXkubGVuZ3RoXSA9IHRleHQ7XHJcbiAgICB9O1xyXG4gICAgU3RyaW5nQnVpbGRlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJBcnJheS5qb2luKCcnKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU3RyaW5nQnVpbGRlcjtcclxufSgpKTtcclxuZXhwb3J0cy5TdHJpbmdCdWlsZGVyID0gU3RyaW5nQnVpbGRlcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHRpbWVycyA9IHt9O1xyXG52YXIgbmFtZVByZWZpeCA9ICd0aW1lciQnO1xyXG52YXIgVGltZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVGltZXIoaW50ZXJ2YWwsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhpcy50aW1lcklkID0gLTE7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVByZWZpeCArIE1hdGguY2VpbChNYXRoLnJhbmRvbSgpICogOTAwMDAwMDAwICsgMTAwMDAwMDAwKTtcclxuICAgICAgICB0aGlzLmludGVydmFsID0gaW50ZXJ2YWwgKiAxMDAwO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH1cclxuICAgIFRpbWVyLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzKTtcclxuICAgIH07XHJcbiAgICBUaW1lci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRoYXQgPSB0aW1lcnNbdGhpcy5uYW1lXSA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50aW1lcklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkgeyB0aW1lcnNbdGhhdC5uYW1lXS5ydW4oKTsgfSwgdGhpcy5pbnRlcnZhbCk7XHJcbiAgICB9O1xyXG4gICAgVGltZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBUaW1lcjtcclxufSgpKTtcclxuZXhwb3J0cy5UaW1lciA9IFRpbWVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGxhbmcgPSByZXF1aXJlKFwiLi9sYW5nXCIpO1xyXG52YXIga2VybmVsID0gcmVxdWlyZShcIi4va2VybmVsXCIpO1xyXG52YXIgeHRvciA9IGZ1bmN0aW9uICgpIHsgfTtcclxudmFyIG9wID0gT2JqZWN0LnByb3RvdHlwZSwgb3B0cyA9IG9wLnRvU3RyaW5nLCBjbmFtZSA9IFwiY29uc3RydWN0b3JcIjtcclxuZnVuY3Rpb24gZm9yY2VOZXcoY3Rvcikge1xyXG4gICAgeHRvci5wcm90b3R5cGUgPSBjdG9yLnByb3RvdHlwZTtcclxuICAgIHZhciB0ID0gbmV3IHh0b3I7XHJcbiAgICB4dG9yLnByb3RvdHlwZSA9IG51bGw7XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5mdW5jdGlvbiBhcHBseU5ldyhhcmdzKSB7XHJcbiAgICB2YXIgY3RvciA9IGFyZ3MuY2FsbGVlLCB0ID0gZm9yY2VOZXcoY3Rvcik7XHJcbiAgICBjdG9yLmFwcGx5KHQsIGFyZ3MpO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuZnVuY3Rpb24gY2hhaW5lZENvbnN0cnVjdG9yKGJhc2VzLCBjdG9yU3BlY2lhbCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYSA9IGFyZ3VtZW50cywgYXJncyA9IGEsIGEwID0gYVswXSwgZiwgaSwgbSwgbCA9IGJhc2VzLmxlbmd0aCwgcHJlQXJncztcclxuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYS5jYWxsZWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcHBseU5ldyhhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN0b3JTcGVjaWFsICYmIChhMCAmJiBhMC5wcmVhbWJsZSB8fCB0aGlzLnByZWFtYmxlKSkge1xyXG4gICAgICAgICAgICBwcmVBcmdzID0gbmV3IEFycmF5KGJhc2VzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHByZUFyZ3NbMF0gPSBhO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOzspIHtcclxuICAgICAgICAgICAgICAgIGEwID0gYVswXTtcclxuICAgICAgICAgICAgICAgIGlmIChhMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGYgPSBhMC5wcmVhbWJsZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gZi5hcHBseSh0aGlzLCBhKSB8fCBhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGYgPSBiYXNlc1tpXS5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgICAgICBmID0gZi5oYXNPd25Qcm9wZXJ0eShcInByZWFtYmxlXCIpICYmIGYucHJlYW1ibGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgICAgIGEgPSBmLmFwcGx5KHRoaXMsIGEpIHx8IGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKytpID09IGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHByZUFyZ3NbaV0gPSBhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoaSA9IGwgLSAxOyBpID49IDA7IC0taSkge1xyXG4gICAgICAgICAgICBmID0gYmFzZXNbaV07XHJcbiAgICAgICAgICAgIG0gPSBmLl9tZXRhO1xyXG4gICAgICAgICAgICBmID0gbSA/IG0uY3RvciA6IGY7XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICBmLmFwcGx5KHRoaXMsIHByZUFyZ3MgPyBwcmVBcmdzW2ldIDogYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZiA9IHRoaXMucG9zdHNjcmlwdDtcclxuICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICBmLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gc2luZ2xlQ29uc3RydWN0b3IoY3RvciwgY3RvclNwZWNpYWwpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGEgPSBhcmd1bWVudHMsIHQgPSBhLCBhMCA9IGFbMF0sIGY7XHJcbiAgICAgICAgaWYgKGN0b3JTcGVjaWFsKSB7XHJcbiAgICAgICAgICAgIGlmIChhMCkge1xyXG4gICAgICAgICAgICAgICAgZiA9IGEwLnByZWFtYmxlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGYpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ID0gZi5hcHBseSh0aGlzLCB0KSB8fCB0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGYgPSB0aGlzLnByZWFtYmxlO1xyXG4gICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgZi5hcHBseSh0aGlzLCB0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3Rvcikge1xyXG4gICAgICAgICAgICBjdG9yLmFwcGx5KHRoaXMsIGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmID0gdGhpcy5wb3N0c2NyaXB0O1xyXG4gICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgIGYuYXBwbHkodGhpcywgYSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBzaW1wbGVDb25zdHJ1Y3RvcihiYXNlcykge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYSA9IGFyZ3VtZW50cywgaSA9IDAsIGYsIG07XHJcbiAgICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGEuY2FsbGVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXBwbHlOZXcoYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoOyBmID0gYmFzZXNbaV07ICsraSkge1xyXG4gICAgICAgICAgICBtID0gZi5fbWV0YTtcclxuICAgICAgICAgICAgZiA9IG0gPyBtLmN0b3IgOiBmO1xyXG4gICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgZi5hcHBseSh0aGlzLCBhKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGYgPSB0aGlzLnBvc3RzY3JpcHQ7XHJcbiAgICAgICAgaWYgKGYpIHtcclxuICAgICAgICAgICAgZi5hcHBseSh0aGlzLCBhKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGNoYWluKG5hbWUsIGJhc2VzLCByZXZlcnNlZCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgYiwgbSwgZiwgaSA9IDAsIHN0ZXAgPSAxO1xyXG4gICAgICAgIGlmIChyZXZlcnNlZCkge1xyXG4gICAgICAgICAgICBpID0gYmFzZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgc3RlcCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKDsgYiA9IGJhc2VzW2ldOyBpICs9IHN0ZXApIHtcclxuICAgICAgICAgICAgbSA9IGIuX21ldGE7XHJcbiAgICAgICAgICAgIGYgPSAobSA/IG0uaGlkZGVuIDogYi5wcm90b3R5cGUpW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG52YXIgZGVjbGFyZSA9IGZ1bmN0aW9uIChjbGFzc05hbWUsIHN1cGVyY2xhc3MsIHByb3BzKSB7XHJcbiAgICB2YXIgY2xhc3NOYW1lLCBzdXBlcmNsYXNzLCBwcm9wcztcclxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICBjbGFzc05hbWUgPSBudWxsO1xyXG4gICAgICAgIHN1cGVyY2xhc3MgPSBudWxsO1xyXG4gICAgICAgIHByb3BzID0gYXJndW1lbnRzWzBdIHx8IHt9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyKSB7XHJcbiAgICAgICAgaWYgKGxhbmcuaXNTdHJpbmcoYXJndW1lbnRzWzBdKSkge1xyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBhcmd1bWVudHNbMF0gfHwge307XHJcbiAgICAgICAgICAgIHN1cGVyY2xhc3MgPSBudWxsO1xyXG4gICAgICAgICAgICBwcm9wcyA9IGFyZ3VtZW50c1sxXSB8fCB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHN1cGVyY2xhc3MgPSBhcmd1bWVudHNbMF0gfHwge307XHJcbiAgICAgICAgICAgIHByb3BzID0gYXJndW1lbnRzWzFdIHx8IHt9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMykge1xyXG4gICAgICAgIGNsYXNzTmFtZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBzdXBlcmNsYXNzID0gYXJndW1lbnRzWzFdIHx8IHt9O1xyXG4gICAgICAgIHByb3BzID0gYXJndW1lbnRzWzJdIHx8IHt9O1xyXG4gICAgfVxyXG4gICAgdmFyIHByb3RvLCB0LCBjdG9yO1xyXG4gICAgY3RvciA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgIHByb3RvID0ge307XHJcbiAgICBpZiAobGFuZy5pc0FycmF5KHN1cGVyY2xhc3MpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdXBlcmNsYXNzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxhbmcuZXh0ZW5kKHByb3RvLCBzdXBlcmNsYXNzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChzdXBlcmNsYXNzICE9IG51bGwpIHtcclxuICAgICAgICBsYW5nLmV4dGVuZChwcm90bywgc3VwZXJjbGFzcyk7XHJcbiAgICB9XHJcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm9wcykge1xyXG4gICAgICAgIGN0b3IucHJvdG90eXBlW3Byb3BlcnR5XSA9IHByb3BzW3Byb3BlcnR5XTtcclxuICAgICAgICBsYW5nLmV4dGVuZChwcm90bywgcHJvcHMpO1xyXG4gICAgfVxyXG4gICAgdCA9IHByb3BzLmNvbnN0cnVjdG9yO1xyXG4gICAgaWYgKHQgIT09IG9wLmNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgdC5ub20gPSBjbmFtZTtcclxuICAgICAgICBwcm90by5jb25zdHJ1Y3RvciA9IHQ7XHJcbiAgICB9XHJcbiAgICBjdG9yID0gc2luZ2xlQ29uc3RydWN0b3IocHJvcHMuY29uc3RydWN0b3IsIHQpO1xyXG4gICAgY3Rvci5fbWV0YSA9IHtcclxuICAgICAgICBoaWRkZW46IHByb3BzLFxyXG4gICAgICAgIGN0b3I6IHByb3BzLmNvbnN0cnVjdG9yXHJcbiAgICB9O1xyXG4gICAgY3Rvci5zdXBlcmNsYXNzID0gc3VwZXJjbGFzcyAmJiBzdXBlcmNsYXNzLnByb3RvdHlwZTtcclxuICAgIGN0b3IucHJvdG90eXBlID0gcHJvdG87XHJcbiAgICBwcm90by5jb25zdHJ1Y3RvciA9IGN0b3I7XHJcbiAgICBpZiAoY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgY3Rvci5wcm90b3R5cGUuZGVjbGFyZWRDbGFzcyA9IGNsYXNzTmFtZTtcclxuICAgICAgICB2YXIgcGFydHMgPSBjbGFzc05hbWUuc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgIHZhciBuYW1lXzEgPSBwYXJ0cy5wb3AoKTtcclxuICAgICAgICB2YXIgY29udGV4dCA9IHBhcnRzLmxlbmd0aCA9PSAwID8ga2VybmVsLmdsb2JhbCgpIDoga2VybmVsLnJlZ2lzdGVyKHBhcnRzLmpvaW4oJy4nKSk7XHJcbiAgICAgICAgY29udGV4dFtuYW1lXzFdID0gY3RvcjtcclxuICAgIH1cclxuICAgIHJldHVybiBjdG9yO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IGRlY2xhcmU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgbGFuZyA9IHJlcXVpcmUoXCIuL2xhbmdcIik7XHJcbnZhciBTdHJpbmdCdWlsZGVyXzEgPSByZXF1aXJlKFwiLi9TdHJpbmdCdWlsZGVyXCIpO1xyXG52YXIgVGltZXJfMSA9IHJlcXVpcmUoXCIuL1RpbWVyXCIpO1xyXG52YXIgbG9jYWxlcyA9IHsgXCJlbi11c1wiOiBcImVuLXVzXCIsIFwiemgtY25cIjogXCJ6aC1jblwiLCBcInpoLXR3XCI6IFwiemgtdHdcIiB9O1xyXG52YXIgZGVmYXVsdExvY2FsZU5hbWUgPSAnemgtY24nO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIGdsb2JhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbDtcclxuICAgIH0sXHJcbiAgICBpc0Jyb3dlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBsYW5nLnR5cGUoc2VsZi5nbG9iYWwoKSkgPT09ICd3aW5kb3cnO1xyXG4gICAgfSxcclxuICAgIGlzTm9kZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBsYW5nLnR5cGUoc2VsZi5nbG9iYWwoKSkgPT09ICdnbG9iYWwnO1xyXG4gICAgfSxcclxuICAgIGVycm9yOiBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XHJcbiAgICB9LFxyXG4gICAgc2NyaXB0RnJhZ21lbnQ6ICc8c2NyaXB0W14+XSo+KFtcXFxcU1xcXFxzXSo/KTxcXC9zY3JpcHQ+JyxcclxuICAgIGpzb25GaWx0ZXI6IC9eXFwvXFwqLXNlY3VyZS0oW1xcc1xcU10qKVxcKlxcL1xccyokLyxcclxuICAgIHF1aWNrRXhwcjogL15bXjxdKig8KC58XFxzKSs+KVtePl0qJHxeIyhbXFx3LV0rKSQvLFxyXG4gICAgaXNTaW1wbGU6IC9eLlteOiNcXFtcXC4sXSokLyxcclxuICAgIG5vb3A6IGZ1bmN0aW9uICgpIHsgfSxcclxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB2YXIgcGFydHMgPSB2YWx1ZS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgdmFyIHJvb3QgPSBzZWxmLmdsb2JhbCgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGxhbmcuaXNVbmRlZmluZWQocm9vdFtwYXJ0c1tpXV0pKSB7XHJcbiAgICAgICAgICAgICAgICByb290W3BhcnRzW2ldXSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJvb3QgPSByb290W3BhcnRzW2ldXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvb3Q7XHJcbiAgICB9LFxyXG4gICAgaW52b2tlOiBmdW5jdGlvbiAob2JqZWN0LCBmbikge1xyXG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgyKTtcclxuICAgICAgICByZXR1cm4gZm4uYXBwbHkob2JqZWN0LCBhcmdzKTtcclxuICAgIH0sXHJcbiAgICBjYWxsOiBmdW5jdGlvbiAoYW55dGhpbmcpIHtcclxuICAgICAgICBpZiAoIWxhbmcuaXNVbmRlZmluZWQoYW55dGhpbmcpKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGFuZy5pc0Z1bmN0aW9uKGFueXRoaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW55dGhpbmcuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsYW5nLnR5cGUoYW55dGhpbmcpID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhbnl0aGluZyAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV2YWwoYW55dGhpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGd1aWQ6IHtcclxuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uIChmb3JtYXQsIGlzVXBwZXJDYXNlKSB7XHJcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09IHZvaWQgMCkgeyBmb3JtYXQgPSAnLSc7IH1cclxuICAgICAgICAgICAgdmFyIHRleHQgPSAnJztcclxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9ICgoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApIHwgMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgICAgIGlmIChpID4gMCAmJiBpIDwgNSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXQgPT09ICctJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9ICctJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGV4dCA9IGlzVXBwZXJDYXNlID8gdGV4dC50b1VwcGVyQ2FzZSgpIDogdGV4dC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmFuZG9tVGV4dDoge1xyXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGxlbmd0aCwgYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGlmIChsZW5ndGggPT09IHZvaWQgMCkgeyBsZW5ndGggPSA4OyB9XHJcbiAgICAgICAgICAgIGlmIChidWZmZXIgPT09IHZvaWQgMCkgeyBidWZmZXIgPSBcIjAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3l6eFwiOyB9XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IGJ1ZmZlci5jaGFyQXQoTWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDApICUgYnVmZmVyLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbm9uY2U6IGZ1bmN0aW9uIChsZW5ndGgpIHtcclxuICAgICAgICBpZiAobGVuZ3RoID09PSB2b2lkIDApIHsgbGVuZ3RoID0gNjsgfVxyXG4gICAgICAgIHJldHVybiBOdW1iZXIoc2VsZi5yYW5kb21UZXh0LmNyZWF0ZSgxLCAnMTIzNDU2Nzg5JykgKyBzZWxmLnJhbmRvbVRleHQuY3JlYXRlKGxlbmd0aCAtIDEsICcwMTIzNDU2Nzg5JykpO1xyXG4gICAgfSxcclxuICAgIHNlcmlhbGl6ZTogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgYnVmZmVyID0gW10sIGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIGlmIChsYW5nLmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2goZGF0YVtpXS5uYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFbaV0udmFsdWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaChuYW1lICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFbbmFtZV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYnVmZmVyLmpvaW4oJyYnKTtcclxuICAgIH0sXHJcbiAgICBlYWNoOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgbmFtZSwgaSA9IDAsIGxlbmd0aCA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIGlmIChsYW5nLmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgdmFsdWUgPSBkYXRhWzBdOyBpIDwgbGVuZ3RoICYmIGNhbGxiYWNrLmNhbGwodmFsdWUsIGksIHZhbHVlKSAhPSBmYWxzZTsgdmFsdWUgPSBkYXRhWysraV0pIHsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChuYW1lIGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGRhdGFbbmFtZV0sIG5hbWUsIGRhdGFbbmFtZV0pID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSxcclxuICAgIHRvWE1MOiBmdW5jdGlvbiAodGV4dCwgaGlkZUVycm9yKSB7XHJcbiAgICAgICAgaWYgKGhpZGVFcnJvciA9PT0gdm9pZCAwKSB7IGhpZGVFcnJvciA9IGZhbHNlOyB9XHJcbiAgICAgICAgaWYgKGxhbmcudHlwZSh0ZXh0KSA9PT0gJ3htbGRvY3VtZW50Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxhbmcuaXNVbmRlZmluZWQodGV4dCkgfHwgdGV4dCA9PT0gJycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGdsb2JhbCA9IHNlbGYuZ2xvYmFsKCk7XHJcbiAgICAgICAgdmFyIGRvYztcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZ2xvYmFsW1wiRE9NUGFyc2VyXCJdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG4gICAgICAgICAgICAgICAgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCBcInRleHQveG1sXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGdsb2JhbFtcIkFjdGl2ZVhPYmplY3RcIl0pIHtcclxuICAgICAgICAgICAgICAgIGRvYyA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTERPTVwiKTtcclxuICAgICAgICAgICAgICAgIGRvYy5hc3luYyA9IFwiZmFsc2VcIjtcclxuICAgICAgICAgICAgICAgIGRvYy5sb2FkWE1MKHRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICBkb2MgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmICghaGlkZUVycm9yKVxyXG4gICAgICAgICAgICAgICAgc2VsZi5kZWJ1Zy5lcnJvcigne1wibWV0aG9kXCI6XCJ4LnRvWE1MKHRleHQpXCIsIFwiYXJndW1lbnRzXCI6e1widGV4dFwiOlwiJyArIHRleHQgKyAnXCJ9Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZG9jIHx8IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBhcnNlcmVycm9yXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBkb2MgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmICghaGlkZUVycm9yKVxyXG4gICAgICAgICAgICAgICAgc2VsZi5kZWJ1Zy5lcnJvcigne1wibWV0aG9kXCI6XCJ4LnRvWE1MKHRleHQpXCIsIFwiYXJndW1lbnRzXCI6e1widGV4dFwiOlwiJyArIHRleHQgKyAnXCJ9Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkb2M7XHJcbiAgICB9LFxyXG4gICAgdG9KU09OOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIGlmIChsYW5nLnR5cGUodGV4dCkgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGFuZy5pc1VuZGVmaW5lZCh0ZXh0KSB8fCB0ZXh0ID09PSAnJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaGlkZUVycm9yID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoSlNPTikgPyBKU09OLnBhcnNlKHRleHQpIDogKEZ1bmN0aW9uKFwicmV0dXJuIFwiICsgdGV4dCkpKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChGdW5jdGlvbihcInJldHVybiBcIiArIHRleHQpKSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChleDEpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaGlkZUVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVidWcuZXJyb3IoJ3tcIm1ldGhvZFwiOlwieC50b0pTT04odGV4dClcIiwgXCJhcmd1bWVudHNcIjp7XCJ0ZXh0XCI6XCInICsgdGV4dCArICdcIn0nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9TYWZlSlNPTjogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICB2YXIgb3V0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjaCA9IHRleHQuc3Vic3RyKGksIDEpO1xyXG4gICAgICAgICAgICBpZiAoY2ggPT09ICdcIicgfHwgY2ggPT09ICdcXCcnIHx8IGNoID09PSAnXFxcXCcgfHwgY2ggPT09ICdcXC8nKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gJ1xcXFwnO1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IGNoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSAnXFxiJykge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9ICdcXFxcYic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09ICdcXGYnKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gJ1xcXFxmJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gJ1xcbicpIHtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSAnXFxcXG4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSAnXFxyJykge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9ICdcXFxccic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09ICdcXHQnKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gJ1xcXFx0JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBjaDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0U3RyaW5nO1xyXG4gICAgfSxcclxuICAgIHRvU2FmZUxpa2U6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxbL2csICdbW10nKS5yZXBsYWNlKC8lL2csICdbJV0nKS5yZXBsYWNlKC9fL2csICdbX10nKTtcclxuICAgIH0sXHJcbiAgICBjZGF0YTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gJzwhW0NEQVRBWycgKyB0ZXh0ICsgJ11dPic7XHJcbiAgICB9LFxyXG4gICAgY2FtZWxDYXNlOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHZhciBybXNQcmVmaXggPSAvXi1tcy0vLCByZGFzaEFscGhhID0gLy0oW1xcZGEtel0pL2dpO1xyXG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2Uocm1zUHJlZml4LCBcIm1zLVwiKS5yZXBsYWNlKHJkYXNoQWxwaGEsIGZ1bmN0aW9uIChhbGwsIGxldHRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcGFkZGluZ1plcm86IGZ1bmN0aW9uIChudW1iZXIsIGxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybiAoQXJyYXkobGVuZ3RoKS5qb2luKCcwJykgKyBudW1iZXIpLnNsaWNlKC1sZW5ndGgpO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdExvY2FsZTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICB2YXIgbG9jYWxlID0gbG9jYWxlc1t0ZXh0LnRvTG93ZXJDYXNlKCldO1xyXG4gICAgICAgIHJldHVybiBsb2NhbGUgPyBsb2NhbGUgOiBkZWZhdWx0TG9jYWxlTmFtZTtcclxuICAgIH0sXHJcbiAgICBnZXRGcmllbmRseU5hbWU6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuY2FtZWxDYXNlKCgneF8nICsgbmFtZSkucmVwbGFjZSgvW1xcI1xcJFxcLlxcL1xcXFxcXDpcXD9cXD1dL2csICdfJykucmVwbGFjZSgvWy1dKy9nLCAnXycpKTtcclxuICAgIH0sXHJcbiAgICBTdHJpbmdCdWlsZGVyOiBTdHJpbmdCdWlsZGVyXzEuU3RyaW5nQnVpbGRlcixcclxuICAgIFRpbWVyOiBUaW1lcl8xLlRpbWVyLFxyXG4gICAgdGltZXJzOiB7fSxcclxuICAgIG5ld1RpbWVyOiBmdW5jdGlvbiAoaW50ZXJ2YWwsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIHRpbWVyID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAndGltZXIkJyArIE1hdGguY2VpbChNYXRoLnJhbmRvbSgpICogOTAwMDAwMDAwICsgMTAwMDAwMDAwKSxcclxuICAgICAgICAgICAgaW50ZXJ2YWw6IGludGVydmFsICogMTAwMCxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxyXG4gICAgICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2sodGhpcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHNlbGYudGltZXJzW3RoaXMubmFtZV0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkgeyBzZWxmLnRpbWVyc1t0aGF0Lm5hbWVdLnJ1bigpOyB9LCB0aGlzLmludGVydmFsKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVySWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGltZXI7XHJcbiAgICB9LFxyXG4gICAgZGVidWc6IHtcclxuICAgICAgICBsb2c6IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKCFsYW5nLmlzVW5kZWZpbmVkKGNvbnNvbGUpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvYmplY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB3YXJuOiBmdW5jdGlvbiAob2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmICghbGFuZy5pc1VuZGVmaW5lZChjb25zb2xlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKG9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiAob2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmICghbGFuZy5pc1VuZGVmaW5lZChjb25zb2xlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihvYmplY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhc3NlcnQ6IGZ1bmN0aW9uIChleHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghbGFuZy5pc1VuZGVmaW5lZChjb25zb2xlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpbWU6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICghbGFuZy5pc1VuZGVmaW5lZChjb25zb2xlKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS50aW1lKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aW1lRW5kOiBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoIWxhbmcuaXNVbmRlZmluZWQoY29uc29sZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZChuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGltZXN0YW1wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSAne3l5eXktTU0tZGQgSEg6bW06c3MuZmZmfSc7XHJcbiAgICAgICAgICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoL3l5eXkvLCB0aW1lc3RhbXAuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL01NLywgKHRpbWVzdGFtcC5nZXRNb250aCgpICsgMSkgPiA5ID8gKHRpbWVzdGFtcC5nZXRNb250aCgpICsgMSkudG9TdHJpbmcoKSA6ICcwJyArICh0aW1lc3RhbXAuZ2V0TW9udGgoKSArIDEpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL2RkfERELywgdGltZXN0YW1wLmdldERhdGUoKSA+IDkgPyB0aW1lc3RhbXAuZ2V0RGF0ZSgpLnRvU3RyaW5nKCkgOiAnMCcgKyB0aW1lc3RhbXAuZ2V0RGF0ZSgpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL2hofEhILywgdGltZXN0YW1wLmdldEhvdXJzKCkgPiA5ID8gdGltZXN0YW1wLmdldEhvdXJzKCkudG9TdHJpbmcoKSA6ICcwJyArIHRpbWVzdGFtcC5nZXRIb3VycygpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL21tLywgdGltZXN0YW1wLmdldE1pbnV0ZXMoKSA+IDkgPyB0aW1lc3RhbXAuZ2V0TWludXRlcygpLnRvU3RyaW5nKCkgOiAnMCcgKyB0aW1lc3RhbXAuZ2V0TWludXRlcygpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL3NzfFNTLywgdGltZXN0YW1wLmdldFNlY29uZHMoKSA+IDkgPyB0aW1lc3RhbXAuZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCkgOiAnMCcgKyB0aW1lc3RhbXAuZ2V0U2Vjb25kcygpKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL2ZmZi9nLCAoKHRpbWVzdGFtcC5nZXRNaWxsaXNlY29uZHMoKSA+IDk5KSA/IHRpbWVzdGFtcC5nZXRNaWxsaXNlY29uZHMoKS50b1N0cmluZygpIDogKHRpbWVzdGFtcC5nZXRNaWxsaXNlY29uZHMoKSA+IDkpID8gJzAnICsgdGltZXN0YW1wLmdldE1pbGxpc2Vjb25kcygpIDogJzAwJyArIHRpbWVzdGFtcC5nZXRNaWxsaXNlY29uZHMoKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHNlbGYgPSB7XHJcbiAgICB0eXBlOiBmdW5jdGlvbiAob2JqZWN0KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAob2JqZWN0KSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAndW5kZWZpbmVkJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqZWN0ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ251bGwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAvXFxbb2JqZWN0IChbQS1aYS16XSspXFxdLy5leGVjKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpKVsxXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgUmFuZ2VFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcuLi4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRocm93IGV4O1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc0FycmF5OiBmdW5jdGlvbiAob2JqZWN0KSB7IH0sXHJcbiAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbiAob2JqZWN0KSB7IH0sXHJcbiAgICBpc1N0cmluZzogZnVuY3Rpb24gKG9iamVjdCkgeyB9LFxyXG4gICAgaXNOdW1iZXI6IGZ1bmN0aW9uIChvYmplY3QpIHsgfSxcclxuICAgIGlzVW5kZWZpbmVkOiBmdW5jdGlvbiAob2JqZWN0KSB7IH0sXHJcbiAgICBleHRlbmQ6IGZ1bmN0aW9uIChkZXN0aW5hdGlvbikge1xyXG4gICAgICAgIHZhciBzb3VyY2UgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICAgICAgICBzb3VyY2VbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXN1bHQgPSBhcmd1bWVudHNbMF0gfHwge307XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYXJndW1lbnRzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BlcnR5XSA9IGFyZ3VtZW50c1tpXVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbiAgICBjbG9uZTogZnVuY3Rpb24gKG9iamVjdCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLmV4dGVuZCh7fSwgb2JqZWN0KTtcclxuICAgIH0sXHJcbiAgICBFdmVudFRhcmdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSB7fTtcclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiBsaXN0ZW5lciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRMaXN0ZW5lcnNbdHlwZV0gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzW3R5cGVdID0gW2xpc3RlbmVyXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZXZlbnRMaXN0ZW5lcnNbdHlwZV07XHJcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldID09PSBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGlzdGVuZXIgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGxpcyA9IDAsIGxlbmtleSA9IGxpc3RlbmVyLmxlbmd0aDsgbGlzIDwgbGVua2V5OyBsaXMgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZCh0eXBlLCBsaXN0ZW5lcltsZW5rZXldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyc1t0eXBlXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZmlyZSA9IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlICYmIHRoaXMuZXZlbnRMaXN0ZW5lcnNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudHMgPSB7IHR5cGU6IHR5cGUsIHRhcmdldDogdGhpcyB9O1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbGVuZ3RoID0gdGhpcy5fbGlzdGVuZXJbdHlwZV0ubGVuZ3RoLCBzdGFydCA9IDA7IHN0YXJ0IDwgbGVuZ3RoOyBzdGFydCArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudExpc3RlbmVyc1t0eXBlXVtzdGFydF0uY2FsbCh0aGlzLCBldmVudHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcbnZhciB0eXBlcyA9IFtcIkFycmF5XCIsIFwiRnVuY3Rpb25cIiwgXCJTdHJpbmdcIiwgXCJOdW1iZXJcIiwgXCJVbmRlZmluZWRcIl07XHJcbnZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGkpIHtcclxuICAgIHNlbGZbJ2lzJyArIHR5cGVzW2ldXSA9IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gc2VsZi50eXBlKG9iamVjdCkgPT09IHR5cGVzW2ldLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9O1xyXG59O1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBfbG9vcF8xKGkpO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBkZWNsYXJlID0gcmVxdWlyZShcIi4uL2Jhc2UvZGVjbGFyZVwiKTtcclxudmFyIHNlbGYgPSBkZWNsYXJlKHtcclxuICAgIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5pbm5lckFycmF5ID0gW107XHJcbiAgICB9LFxyXG4gICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmlubmVyQXJyYXkgPSBbXTtcclxuICAgIH0sXHJcbiAgICBleGlzdDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pbm5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlubmVyQXJyYXlbaV0ua2V5ID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBpbmRleDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pbm5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlubmVyQXJyYXlbaV0ua2V5ID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH0sXHJcbiAgICBhZGQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSBrZXkuc3BsaXQoJyYnKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gbGlzdFtpXS5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbm5lckFycmF5LnB1c2goeyBrZXk6IHZhbHVlc1swXSwgdmFsdWU6IHZhbHVlc1sxXSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZXhpc3Qoa2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ2FsZWFyZHkgZXhpc3Qgc2FtZSBrZXlbJyArIGtleSArICddJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheS5wdXNoKHsga2V5OiBrZXksIHZhbHVlOiB2YWx1ZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICB2YXIgaSA9IHRoaXMuaW5kZXgoa2V5KTtcclxuICAgICAgICBpZiAoaSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldDogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pbm5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlubmVyQXJyYXlbaV0ua2V5ID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlubmVyQXJyYXlbaV0udmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9LFxyXG4gICAgc2V0OiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pbm5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlubmVyQXJyYXlbaV0ua2V5ID09PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheVtpXS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbm5lckFycmF5Lmxlbmd0aDtcclxuICAgIH1cclxufSk7XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBzZWxmID0ge1xyXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuY29uc3RydWN0b3IoKTtcclxuICAgIH0sXHJcbiAgICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBxdWV1ZSA9IHtcclxuICAgICAgICAgICAgaW5uZXJBcnJheTogW10sXHJcbiAgICAgICAgICAgIHB1c2g6IGZ1bmN0aW9uICh0YXJnZXRPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheS5wdXNoKHRhcmdldE9iamVjdCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5uZXJBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRPYmplY3QgPSB0aGlzLmlubmVyQXJyYXlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmlubmVyQXJyYXkubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheVtpXSA9IHRoaXMuaW5uZXJBcnJheVtpICsgMV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheS5sZW5ndGggPSB0aGlzLmlubmVyQXJyYXkubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0T2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwZWVrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbm5lckFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJBcnJheVswXTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbm5lckFycmF5Lmxlbmd0aDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaXNFbXB0eTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLmlubmVyQXJyYXkubGVuZ3RoID09PSAwKSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHF1ZXVlO1xyXG4gICAgfVxyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IHNlbGY7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLmNvbnN0cnVjdG9yKCk7XHJcbiAgICB9LFxyXG4gICAgY29uc3RydWN0b3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3RhY2sgPSB7XHJcbiAgICAgICAgICAgIGlubmVyQXJyYXk6IFtdLFxyXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAodGFyZ2V0T2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyQXJyYXlbdGhpcy5pbm5lckFycmF5Lmxlbmd0aF0gPSB0YXJnZXRPYmplY3Q7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaW5uZXJBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXRPYmplY3QgPSB0aGlzLmlubmVyQXJyYXlbdGhpcy5pbm5lckFycmF5Lmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJBcnJheS5sZW5ndGgtLTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0T2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwZWVrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbm5lckFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJBcnJheVt0aGlzLmlubmVyQXJyYXkubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVyQXJyYXkubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2l6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5uZXJBcnJheS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGlzRW1wdHk6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy5pbm5lckFycmF5Lmxlbmd0aCA9PT0gMCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBzdGFjaztcclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHNlbGYgPSB7XHJcbiAgICBoZXg6IGZ1bmN0aW9uIChjb2xvclJnYkNvZGUpIHtcclxuICAgICAgICBpZiAoL14ocmdifFJHQikvLnRlc3QoY29sb3JSZ2JDb2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgY29sb3JCdWZmZXIgPSBjb2xvclJnYkNvZGUucmVwbGFjZSgvKD86XFwofFxcKXxyZ2J8UkdCKSovZywgXCJcIikuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICB2YXIgc3RySGV4ID0gXCIjXCI7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sb3JCdWZmZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBoZXggPSBOdW1iZXIoY29sb3JCdWZmZXJbaV0pLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgICAgIGlmIChoZXggPT09IFwiMFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGV4ICs9IGhleDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0ckhleCArPSBoZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHN0ckhleC5sZW5ndGggIT09IDcpIHtcclxuICAgICAgICAgICAgICAgIHN0ckhleCA9IGNvbG9yUmdiQ29kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3RySGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICgvXiMoWzAtOWEtZkEtZl17M318WzAtOWEtZkEtZl17Nn0pJC8udGVzdChjb2xvclJnYkNvZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2xvckJ1ZmZlciA9IGNvbG9yUmdiQ29kZS5yZXBsYWNlKC8jLywgXCJcIikuc3BsaXQoXCJcIik7XHJcbiAgICAgICAgICAgIGlmIChjb2xvckJ1ZmZlci5sZW5ndGggPT09IDYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvclJnYkNvZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29sb3JCdWZmZXIubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbnVtSGV4ID0gXCIjXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9yQnVmZmVyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtSGV4ICs9IChjb2xvckJ1ZmZlcltpXSArIGNvbG9yQnVmZmVyW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBudW1IZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2xvclJnYkNvZGU7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJnYjogZnVuY3Rpb24gKGNvbG9ySGV4Q29kZSkge1xyXG4gICAgICAgIHZhciBjb2xvciA9IGNvbG9ySGV4Q29kZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChjb2xvciAmJiAvXiMoWzAtOWEtZkEtZl17M318WzAtOWEtZkEtZl17Nn0pJC8udGVzdChjb2xvcikpIHtcclxuICAgICAgICAgICAgaWYgKGNvbG9yLmxlbmd0aCA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsQ29sb3IgPSBcIiNcIjtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgNDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxDb2xvciArPSBjb2xvci5zbGljZShpLCBpICsgMSkuY29uY2F0KGNvbG9yLnNsaWNlKGksIGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb2xvciA9IG9yaWdpbmFsQ29sb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGNvbG9yQnVmZmVyID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgNzsgaSArPSAyKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvckJ1ZmZlci5wdXNoKHBhcnNlSW50KFwiMHhcIiArIGNvbG9yLnNsaWNlKGksIGkgKyAyKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAncmdiKCcgKyBjb2xvckJ1ZmZlci5qb2luKCcsICcpICsgJyknO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHggPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xyXG52YXIgd2Vla0RheXMgPSBbJ+aYn+acn+aXpScsICfmmJ/mnJ/kuIAnLCAn5pif5pyf5LqMJywgJ+aYn+acn+S4iScsICfmmJ/mnJ/lm5snLCAn5pif5pyf5LqUJywgJ+aYn+acn+WFrSddO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIG5vdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLmNyZWF0ZSgpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKHRpbWVWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLm5ld0RhdGVUaW1lKHRpbWVWYWx1ZSk7XHJcbiAgICB9LFxyXG4gICAgc2hvcnRJbnRlcnZhbHM6IHtcclxuICAgICAgICAneSc6ICd5ZWFyJyxcclxuICAgICAgICAncSc6ICdxdWFydGVyJyxcclxuICAgICAgICAnTSc6ICdtb250aCcsXHJcbiAgICAgICAgJ3cnOiAnd2VlaycsXHJcbiAgICAgICAgJ2QnOiAnZGF5JyxcclxuICAgICAgICAnaCc6ICdob3VyJyxcclxuICAgICAgICAnbSc6ICdtaW51dGUnLFxyXG4gICAgICAgICdzJzogJ3NlY29uZCcsXHJcbiAgICAgICAgJ21zJzogJ21zZWNvbmQnXHJcbiAgICB9LFxyXG4gICAgZm9ybWF0SW50ZXJ2YWw6IGZ1bmN0aW9uIChpbnRlcnZhbCkge1xyXG4gICAgICAgIHJldHVybiBzZWxmLnNob3J0SW50ZXJ2YWxzW2ludGVydmFsXSB8fCBpbnRlcnZhbDtcclxuICAgIH0sXHJcbiAgICBkaWZmOiBmdW5jdGlvbiAoYmVnaW4sIGVuZCwgaW50ZXJ2YWwpIHtcclxuICAgICAgICB2YXIgdGltZUJlZ2luID0gc2VsZi5uZXdEYXRlVGltZShiZWdpbik7XHJcbiAgICAgICAgdmFyIHRpbWVFbmQgPSBzZWxmLm5ld0RhdGVUaW1lKGVuZCk7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVCZWdpbi5kaWZmKHNlbGYuZm9ybWF0SW50ZXJ2YWwoaW50ZXJ2YWwpLCB0aW1lRW5kKTtcclxuICAgIH0sXHJcbiAgICBhZGQ6IGZ1bmN0aW9uICh0aW1lVmFsdWUsIGludGVydmFsLCBudW1iZXIpIHtcclxuICAgICAgICB2YXIgdGltZSA9IHNlbGYubmV3RGF0ZVRpbWUodGltZVZhbHVlKTtcclxuICAgICAgICByZXR1cm4gdGltZS5hZGQoc2VsZi5mb3JtYXRJbnRlcnZhbChpbnRlcnZhbCksIG51bWJlcik7XHJcbiAgICB9LFxyXG4gICAgZm9ybWF0OiBmdW5jdGlvbiAodGltZVZhbHVlLCBmb3JtYXRWYWx1ZSkge1xyXG4gICAgICAgIHZhciB0aW1lID0gc2VsZi5jcmVhdGUodGltZVZhbHVlKTtcclxuICAgICAgICByZXR1cm4gdGltZS50b1N0cmluZyhmb3JtYXRWYWx1ZSk7XHJcbiAgICB9LFxyXG4gICAgYWdvOiBmdW5jdGlvbiAodGltZVZhbHVlLCBzdWZmaXgpIHtcclxuICAgICAgICBzdWZmaXggPSB4LmV4dCh7XHJcbiAgICAgICAgICAgIG1pbnV0ZTogJ+WIhumSn+WJjScsXHJcbiAgICAgICAgICAgIGhvdXI6ICflsI/ml7bliY0nLFxyXG4gICAgICAgICAgICBkYXk6ICflpKnliY0nXHJcbiAgICAgICAgfSwgc3VmZml4KTtcclxuICAgICAgICB2YXIgdGltZSA9IHNlbGYuY3JlYXRlKHRpbWVWYWx1ZSk7XHJcbiAgICAgICAgdmFyIG5vdyA9IHNlbGYuY3JlYXRlKCk7XHJcbiAgICAgICAgaWYgKHRpbWUuZGlmZignbScsIG5vdykgPCAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnMScgKyBzdWZmaXgubWludXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aW1lLmRpZmYoJ20nLCBub3cpIDwgNjApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRpbWUuZGlmZignbScsIG5vdykgKyBzdWZmaXgubWludXRlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aW1lLmRpZmYoJ2gnLCBub3cpIDwgMjQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRpbWUuZGlmZignaCcsIG5vdykgKyBzdWZmaXguaG91cjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGltZS5kaWZmKCdkJywgbm93KSA8IDQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRpbWUuZGlmZignZCcsIG5vdykgKyBzdWZmaXguZGF5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRpbWUudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbmV3RGF0ZVRpbWU6IGZ1bmN0aW9uICh0aW1lVmFsdWUpIHtcclxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgaWYgKCF4LmlzVW5kZWZpbmVkKHRpbWVWYWx1ZSkpIHtcclxuICAgICAgICAgICAgaWYgKHgudHlwZSh0aW1lVmFsdWUpID09PSAnZGF0ZScpIHtcclxuICAgICAgICAgICAgICAgIGRhdGUgPSB0aW1lVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoeC5pc051bWJlcih0aW1lVmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gbmV3IERhdGUodGltZVZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh4LmlzQXJyYXkodGltZVZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSB0aW1lVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleXNbaV0gPSBpc05hTihrZXlzW2ldKSA/IChpIDwgMyA/IDEgOiAwKSA6IE51bWJlcihrZXlzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShrZXlzWzBdLCBOdW1iZXIoa2V5c1sxXSkgLSAxLCBrZXlzWzJdLCBrZXlzWzNdLCBrZXlzWzRdLCBrZXlzWzVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgvXFwvRGF0ZVxcKCgtP1xcZCspXFwpXFwvLy50ZXN0KHRpbWVWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShNYXRoLmZsb29yKHRpbWVWYWx1ZS5yZXBsYWNlKC9cXC9EYXRlXFwoKC0/XFxkKylcXClcXC8vLCAnJDEnKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSB0aW1lVmFsdWUucmVwbGFjZSgvWy18OnxcXC98IHzlubR85pyIfOaXpV0vZywgJywnKS5yZXBsYWNlKC8sLC9nLCAnLCcpLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleXNbaV0gPSBpc05hTihrZXlzW2ldKSA/IChpIDwgMyA/IDEgOiAwKSA6IE51bWJlcihrZXlzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZShrZXlzWzBdLCBOdW1iZXIoa2V5c1sxXSkgLSAxLCBrZXlzWzJdLCBrZXlzWzNdLCBrZXlzWzRdLCBrZXlzWzVdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGltZSA9IHtcclxuICAgICAgICAgICAgeWVhcjogZGF0ZS5nZXRGdWxsWWVhcigpLFxyXG4gICAgICAgICAgICBtb250aDogZGF0ZS5nZXRNb250aCgpLFxyXG4gICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF0ZSgpLFxyXG4gICAgICAgICAgICBob3VyOiBkYXRlLmdldEhvdXJzKCksXHJcbiAgICAgICAgICAgIG1pbnV0ZTogZGF0ZS5nZXRNaW51dGVzKCksXHJcbiAgICAgICAgICAgIHNlY29uZDogZGF0ZS5nZXRTZWNvbmRzKCksXHJcbiAgICAgICAgICAgIG1zZWNvbmQ6IGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCksXHJcbiAgICAgICAgICAgIHdlZWtEYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgIGRpZmY6IGZ1bmN0aW9uIChpbnRlcnZhbCwgdGltZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVCZWdpbiA9IE51bWJlcih0aGlzLnRvTmF0aXZlRGF0ZSgpKTtcclxuICAgICAgICAgICAgICAgIHZhciB0aW1lRW5kID0gTnVtYmVyKHRpbWUudG9OYXRpdmVEYXRlKCkpO1xyXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSBzZWxmLmZvcm1hdEludGVydmFsKGludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoaW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd5ZWFyJzogcmV0dXJuIHRpbWUueWVhciAtIHRoaXMueWVhcjtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdxdWFydGVyJzogcmV0dXJuIE1hdGguY2VpbCgoKCh0aW1lLnllYXIgLSB0aGlzLnllYXIpICogMTIpICsgKHRpbWUubW9udGggLSB0aGlzLm1vbnRoKSkgLyAzKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtb250aCc6IHJldHVybiAoKHRpbWUueWVhciAtIHRoaXMueWVhcikgKiAxMikgKyAodGltZS5tb250aCAtIHRoaXMubW9udGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnOiByZXR1cm4gTWF0aC5mbG9vcigodGltZUVuZCAtIHRpbWVCZWdpbikgLyAoODY0MDAwMDAgKiA3KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGF5JzogcmV0dXJuIE1hdGguZmxvb3IoKHRpbWVFbmQgLSB0aW1lQmVnaW4pIC8gODY0MDAwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInOiByZXR1cm4gTWF0aC5mbG9vcigodGltZUVuZCAtIHRpbWVCZWdpbikgLyAzNjAwMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtaW51dGUnOiByZXR1cm4gTWF0aC5mbG9vcigodGltZUVuZCAtIHRpbWVCZWdpbikgLyA2MDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzogcmV0dXJuIE1hdGguZmxvb3IoKHRpbWVFbmQgLSB0aW1lQmVnaW4pIC8gMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbXNlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKCh0aW1lRW5kIC0gdGltZUJlZ2luKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZDogZnVuY3Rpb24gKGludGVydmFsLCBudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gTnVtYmVyKHRoaXMudG9OYXRpdmVEYXRlKCkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1zID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBtb250aE1heERheXMgPSBbMzEsIDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV07XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHNlbGYuZm9ybWF0SW50ZXJ2YWwoaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gTnVtYmVyKG51bWJlcik7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGludGVydmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneWVhcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodGhpcy55ZWFyICUgNCA9PSAwICYmICgodGhpcy55ZWFyICUgMTAwICE9IDApIHx8ICh0aGlzLnllYXIgJSA0MDAgPT0gMCkpKSAmJiB0aGlzLm1vbnRoID09IDEgJiYgdGhpcy5kYXkgPT0gMjlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICEoKHRoaXMueWVhciArIG51bWJlcikgJSA0ID09IDAgJiYgKCgodGhpcy55ZWFyICsgbnVtYmVyKSAlIDEwMCAhPSAwKSB8fCAoKHRoaXMueWVhciArIG51bWJlcikgJSA0MDAgPT0gMCkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBOdW1iZXIobmV3IERhdGUodGhpcy55ZWFyICsgbnVtYmVyLCB0aGlzLm1vbnRoLCAyOCwgdGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSwgdGhpcy5zZWNvbmQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gTnVtYmVyKG5ldyBEYXRlKHRoaXMueWVhciArIG51bWJlciwgdGhpcy5tb250aCwgdGhpcy5kYXksIHRoaXMuaG91ciwgdGhpcy5taW51dGUsIHRoaXMuc2Vjb25kKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodGhpcy55ZWFyICUgNCA9PSAwICYmICgodGhpcy55ZWFyICUgMTAwICE9IDApIHx8ICh0aGlzLnllYXIgJSA0MDAgPT0gMCkpKSAmJiB0aGlzLm1vbnRoID09IDEgJiYgdGhpcy5kYXkgPT0gMjlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICEoKHRoaXMueWVhciArIE1hdGguZmxvb3IoKHRoaXMubW9udGggKyBudW1iZXIgKiAzKSAvIDEyKSkgJSA0ID09IDAgJiYgKCgodGhpcy55ZWFyICsgTWF0aC5mbG9vcigodGhpcy5tb250aCArIG51bWJlciAqIDMpIC8gMTIpKSAlIDEwMCAhPSAwKSB8fCAoKHRoaXMueWVhciArIE1hdGguZmxvb3IoKHRoaXMubW9udGggKyBudW1iZXIgKiAzKSAvIDEyKSkgJSA0MDAgPT0gMCkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBOdW1iZXIobmV3IERhdGUodGhpcy55ZWFyLCAodGhpcy5tb250aCArIG51bWJlciAqIDMpLCAyOCwgdGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSwgdGhpcy5zZWNvbmQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRheSA9PSBtb250aE1heERheXNbdGhpcy5tb250aF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtcyA9IE51bWJlcihuZXcgRGF0ZSh0aGlzLnllYXIsICh0aGlzLm1vbnRoICsgbnVtYmVyICogMyksIG1vbnRoTWF4RGF5c1sodGhpcy5tb250aCArIG51bWJlciAqIDMpICUgMTJdLCB0aGlzLmhvdXIsIHRoaXMubWludXRlLCB0aGlzLnNlY29uZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBOdW1iZXIobmV3IERhdGUodGhpcy55ZWFyLCAodGhpcy5tb250aCArIG51bWJlciAqIDMpLCB0aGlzLmRheSwgdGhpcy5ob3VyLCB0aGlzLm1pbnV0ZSwgdGhpcy5zZWNvbmQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtb250aCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodGhpcy55ZWFyICUgNCA9PSAwICYmICgodGhpcy55ZWFyICUgMTAwICE9IDApIHx8ICh0aGlzLnllYXIgJSA0MDAgPT0gMCkpKSAmJiB0aGlzLm1vbnRoID09IDEgJiYgdGhpcy5kYXkgPT0gMjlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmICEoKHRoaXMueWVhciArIE1hdGguZmxvb3IoKHRoaXMubW9udGggKyBudW1iZXIpIC8gMTIpKSAlIDQgPT0gMCAmJiAoKCh0aGlzLnllYXIgKyBNYXRoLmZsb29yKCh0aGlzLm1vbnRoICsgbnVtYmVyKSAvIDEyKSkgJSAxMDAgIT0gMCkgfHwgKCh0aGlzLnllYXIgKyBNYXRoLmZsb29yKCh0aGlzLm1vbnRoICsgbnVtYmVyKSAvIDEyKSkgJSA0MDAgPT0gMCkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBOdW1iZXIobmV3IERhdGUodGhpcy55ZWFyLCAodGhpcy5tb250aCArIG51bWJlciksIDI4LCB0aGlzLmhvdXIsIHRoaXMubWludXRlLCB0aGlzLnNlY29uZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF5ID09IG1vbnRoTWF4RGF5c1t0aGlzLm1vbnRoXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zID0gTnVtYmVyKG5ldyBEYXRlKHRoaXMueWVhciwgKHRoaXMubW9udGggKyBudW1iZXIpLCBtb250aE1heERheXNbKHRoaXMubW9udGggKyBudW1iZXIpICUgMTJdLCB0aGlzLmhvdXIsIHRoaXMubWludXRlLCB0aGlzLnNlY29uZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBOdW1iZXIobmV3IERhdGUodGhpcy55ZWFyLCAodGhpcy5tb250aCArIG51bWJlciksIHRoaXMuZGF5LCB0aGlzLmhvdXIsIHRoaXMubWludXRlLCB0aGlzLnNlY29uZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtcyA9IGRhdGUgKyAoKDg2NDAwMDAwICogNykgKiBudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdkYXknOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtcyA9IGRhdGUgKyAoODY0MDAwMDAgKiBudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdob3VyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXMgPSBkYXRlICsgKDM2MDAwMDAgKiBudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtaW51dGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtcyA9IGRhdGUgKyAoNjAwMDAgKiBudW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtcyA9IGRhdGUgKyAoMTAwMCAqIG51bWJlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ21zZWNvbmQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtcyA9IGRhdGUgKyBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY3JlYXRlKG5ldyBEYXRlKG1zKSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldERhdGVQYXJ0OiBmdW5jdGlvbiAoaW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgICAgIGludGVydmFsID0gc2VsZi5mb3JtYXRJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGludGVydmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAneWVhcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnllYXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFF1YXJ0ZXJPZlllYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtb250aCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vbnRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RheSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRheTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdlZWtEYXlzW3RoaXMud2Vla0RheV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnd2Vla09mWWVhcic6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFdlZWtPZlllYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdob3VyJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG91cjtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtaW51dGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5taW51dGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vjb25kO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnVW5rb3duIEludGVydmFsJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0TWF4RGF5T2ZNb250aDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGUxID0gc2VsZi5jcmVhdGUodGhpcy50b1N0cmluZygneXl5eS1NTS0wMScpKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRlMiA9IHNlbGYuY3JlYXRlKHRoaXMuYWRkKCdtb250aCcsIDEpLnRvU3RyaW5nKCd5eXl5LU1NLTAxJykpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGUxLmRpZmYoJ2RheScsIGRhdGUyKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0UXVhcnRlck9mWWVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLm1vbnRoIC8gMyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFdlZWtPZlllYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciB3ZWVrID0gMDtcclxuICAgICAgICAgICAgICAgIHZhciBkYXkgPSB0aGlzLmdldERheU9mWWVhcigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY3JlYXRlKHRoaXMudG9TdHJpbmcoJ3l5eXktMDEtMDEnKSkud2Vla0RheSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXkgPSBkYXkgLSAoNyAtIHNlbGYuY3JlYXRlKHRoaXMudG9TdHJpbmcoJ3l5eXktMDEtMDEnKSkud2Vla0RheSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF5ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdlZWsgPSBNYXRoLmNlaWwoZGF5IC8gNyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2VlaztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RGF5T2ZZZWFyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZTEgPSB0aGlzLnRvTmF0aXZlRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGUyID0gbmV3IERhdGUoZGF0ZTEuZ2V0RnVsbFllYXIoKSwgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKE51bWJlcihOdW1iZXIoZGF0ZTEpIC0gTnVtYmVyKGRhdGUyKSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkpICsgMTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaXNMZWFwWWVhcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLnllYXIgJSA0ID09IDAgJiYgKCh0aGlzLnllYXIgJSAxMDAgIT0gMCkgfHwgKHRoaXMueWVhciAlIDQwMCA9PSAwKSkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b0FycmF5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW3RoaXMueWVhciwgdGhpcy5tb250aCwgdGhpcy5kYXksIHRoaXMuaG91ciwgdGhpcy5taW51dGUsIHRoaXMuc2Vjb25kLCB0aGlzLm1zZWNvbmRdO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0b05hdGl2ZURhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnllYXIsIHRoaXMubW9udGgsIHRoaXMuZGF5LCB0aGlzLmhvdXIsIHRoaXMubWludXRlLCB0aGlzLnNlY29uZCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoZm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0ID09PSB2b2lkIDApIHsgZm9ybWF0ID0gJ3l5eXktTU0tZGQgSEg6bW06c3MnOyB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoL3l5eXl8WVlZWS9nLCB0aGlzLnllYXIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL3l5fFlZL2csIHgucGFkZGluZ1plcm8oKHRoaXMueWVhcjIgJSAxMDApLCAyKSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvTU0vZywgeC5wYWRkaW5nWmVybygodGhpcy5tb250aCArIDEpLCAyKSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvTS9nLCAodGhpcy5tb250aCArIDEpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC93fFcvZywgd2Vla0RheXNbdGhpcy53ZWVrRGF5XSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvZGR8REQvZywgeC5wYWRkaW5nWmVybyh0aGlzLmRheSwgMikpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL2R8RC9nLCB0aGlzLmRheSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvaGh8SEgvZywgeC5wYWRkaW5nWmVybyh0aGlzLmhvdXIsIDIpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9ofEgvZywgdGhpcy5ob3VyKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9tbS9nLCB4LnBhZGRpbmdaZXJvKHRoaXMubWludXRlLCAyKSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvbS9nLCB0aGlzLm1pbnV0ZSlcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvc3N8U1MvZywgeC5wYWRkaW5nWmVybyh0aGlzLnNlY29uZCwgMikpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL3N8Uy9nLCB0aGlzLnNlY29uZClcclxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvZmZmL2csIHgucGFkZGluZ1plcm8odGhpcy5tc2Vjb25kLCAzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aW1lO1xyXG4gICAgfSxcclxuICAgIHRpbWVzcGFuOiBmdW5jdGlvbiAodGltZXNwYW5WYWx1ZSwgZm9ybWF0KSB7XHJcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gdm9pZCAwKSB7IGZvcm1hdCA9ICdzZWNvbmQnOyB9XHJcbiAgICAgICAgaWYgKGZvcm1hdCA9PSAnZGF5JyB8fCBmb3JtYXQgPT0gJ2QnKSB7XHJcbiAgICAgICAgICAgIHRpbWVzcGFuVmFsdWUgPSB0aW1lc3BhblZhbHVlICogMjQgKiA2MCAqIDYwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZm9ybWF0ID09ICdob3VyJyB8fCBmb3JtYXQgPT0gJ2gnKSB7XHJcbiAgICAgICAgICAgIHRpbWVzcGFuVmFsdWUgPSB0aW1lc3BhblZhbHVlICogNjAgKiA2MDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZvcm1hdCA9PSAnbWludXRlJyB8fCBmb3JtYXQgPT0gJ20nKSB7XHJcbiAgICAgICAgICAgIHRpbWVzcGFuVmFsdWUgPSB0aW1lc3BhblZhbHVlICogNjA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmb3JtYXQgPT0gJ3NlY29uZCcgfHwgZm9ybWF0ID09ICdzJykge1xyXG4gICAgICAgICAgICB0aW1lc3BhblZhbHVlID0gdGltZXNwYW5WYWx1ZSAqIDEwMDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0aW1lc3BhbiA9IHtcclxuICAgICAgICAgICAgdGltZXNwYW5WYWx1ZTogdGltZXNwYW5WYWx1ZSxcclxuICAgICAgICAgICAgZGF5OiB0aW1lc3BhblZhbHVlIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApLFxyXG4gICAgICAgICAgICBob3VyOiB0aW1lc3BhblZhbHVlIC8gKDYwICogNjAgKiAxMDAwKSxcclxuICAgICAgICAgICAgbWludXRlOiB0aW1lc3BhblZhbHVlIC8gKDYwICogMTAwMCksXHJcbiAgICAgICAgICAgIHNlY29uZDogdGltZXNwYW5WYWx1ZSAvIDEwMDAsXHJcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kOiB0aW1lc3BhblZhbHVlICUgMTAwMCxcclxuICAgICAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uIChmb3JtYXQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvdXRTdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTU3lpKlkZOWwj+aXtm1t5YiG6ZKfc3Pnp5JmZmbmr6vnp5InOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSB4LnBhZGRpbmdaZXJvKHRoaXMuZGF5LCAyKSArIFwi5aSpXCIgKyB4LnBhZGRpbmdaZXJvKHRoaXMuaG91ciwgMikgKyBcIuWwj+aXtlwiICsgeC5wYWRkaW5nWmVybyh0aGlzLm1pbnV0ZSwgMikgKyBcIuWIhumSn1wiICsgeC5wYWRkaW5nWmVybyh0aGlzLnNlY29uZCwgMikgKyBcIuenklwiICsgeC5wYWRkaW5nWmVybyh0aGlzLm1pbGxpc2Vjb25kLCAzKSArIFwi5q+r56eSXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ01N5aSpZGTlsI/ml7ZtbeWIhumSn3Nz56eSJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nID0geC5wYWRkaW5nWmVybyh0aGlzLmRheSwgMikgKyBcIuWkqVwiICsgeC5wYWRkaW5nWmVybyh0aGlzLmhvdXIsIDIpICsgXCLlsI/ml7ZcIiArIHgucGFkZGluZ1plcm8odGhpcy5taW51dGUsIDIpICsgXCLliIbpkp9cIiArIHgucGFkZGluZ1plcm8odGhpcy5zZWNvbmQsIDIpICsgXCLnp5JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nID0geC5wYWRkaW5nWmVybyh0aGlzLmRheSwgMikgKyBcIuWkqVwiICsgeC5wYWRkaW5nWmVybyh0aGlzLmhvdXIsIDIpICsgXCLlsI/ml7ZcIiArIHgucGFkZGluZ1plcm8odGhpcy5taW51dGUsIDIpICsgXCLliIbpkp9cIiArIHgucGFkZGluZ1plcm8odGhpcy5zZWNvbmQsIDIpICsgXCLnp5JcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0U3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGltZXNwYW47XHJcbiAgICB9XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciB4ID0gcmVxdWlyZShcIi4vYmFzZVwiKTtcclxudmFyIHN0cmluZyA9IHJlcXVpcmUoXCIuL3N0cmluZ1wiKTtcclxudmFyIHNlbGYgPSB7XHJcbiAgICBodG1sOiB7XHJcbiAgICAgICAgZGljdDoge1xyXG4gICAgICAgICAgICAnJic6ICcmIzMyOycsXHJcbiAgICAgICAgICAgICcgJzogJyYjMzg7JyxcclxuICAgICAgICAgICAgJzwnOiAnJiM2MDsnLFxyXG4gICAgICAgICAgICAnPic6ICcmIzYyOycsXHJcbiAgICAgICAgICAgICdcIic6ICcmIzM0OycsXHJcbiAgICAgICAgICAgICdcXCcnOiAnJiMzOTsnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBlbmNvZGU6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHQgPSBzdHJpbmcuc3RyaW5naWZ5KHRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC8mKD8hW1xcdyNdKzspfFs8PlwiJ10vZywgZnVuY3Rpb24gKHMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmh0bWwuZGljdFtzXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHQgPSBzdHJpbmcuc3RyaW5naWZ5KHRleHQpO1xyXG4gICAgICAgICAgICB2YXIgb3V0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgIG91dFN0cmluZyA9IHRleHQucmVwbGFjZSgvJmFtcDsvZywgXCImXCIpO1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgPSBvdXRTdHJpbmcucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIik7XHJcbiAgICAgICAgICAgIG91dFN0cmluZyA9IG91dFN0cmluZy5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKTtcclxuICAgICAgICAgICAgb3V0U3RyaW5nID0gb3V0U3RyaW5nLnJlcGxhY2UoLyZuYnNwOy9nLCBcIiBcIik7XHJcbiAgICAgICAgICAgIG91dFN0cmluZyA9IG91dFN0cmluZy5yZXBsYWNlKC8mIzM5Oy9nLCBcIlxcJ1wiKTtcclxuICAgICAgICAgICAgb3V0U3RyaW5nID0gb3V0U3RyaW5nLnJlcGxhY2UoLyZxdW90Oy9nLCBcIlxcXCJcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXRTdHJpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVuaWNvZGU6IHtcclxuICAgICAgICBlbmNvZGU6IGZ1bmN0aW9uICh0ZXh0LCBwcmVmaXgpIHtcclxuICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJlZml4ID0gcHJlZml4IHx8ICdcXFxcdSc7XHJcbiAgICAgICAgICAgIHRleHQgPSBzdHJpbmcuc3RyaW5naWZ5KHRleHQpO1xyXG4gICAgICAgICAgICB2YXIgb3V0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSAocHJlZml4ID09PSAnJiMnKSA/IHRleHQuY2hhckNvZGVBdChpKS50b1N0cmluZygxMCkgOiB0ZXh0LmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlbXAubGVuZ3RoIDwgNCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0ZW1wLmxlbmd0aCA8IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcCA9ICcwJy5jb25jYXQodGVtcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gb3V0U3RyaW5nLmNvbmNhdChwcmVmaXggKyB0ZW1wKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcmVmaXguaW5kZXhPZignJiMnKSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9ICc7JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb3V0U3RyaW5nLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkZWNvZGU6IGZ1bmN0aW9uICh0ZXh0LCBwcmVmaXgpIHtcclxuICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJlZml4ID0gcHJlZml4IHx8ICdcXFxcdSc7XHJcbiAgICAgICAgICAgIHRleHQgPSBzdHJpbmcuc3RyaW5naWZ5KHRleHQpO1xyXG4gICAgICAgICAgICB2YXIgb3V0U3RyaW5nID0gJyc7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gdGV4dC5tYXRjaCgvKFtcXHddKyl8KFxcXFx1KFtcXHddezR9KSkvZyk7XHJcbiAgICAgICAgICAgIGlmIChsaXN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHguZWFjaChsaXN0LCBmdW5jdGlvbiAoaW5kZXgsIG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5pbmRleE9mKHByZWZpeCkgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChub2RlLnNsaWNlKDIsIDYpLCAxNikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IG5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG91dFN0cmluZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBzZWxmID0ge1xyXG4gICAgZ2V0RXZlbnQ6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuZXZlbnQgPyB3aW5kb3cuZXZlbnQgOiBldmVudDtcclxuICAgIH0sXHJcbiAgICBnZXRUYXJnZXQ6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cuZXZlbnQgPyB3aW5kb3cuZXZlbnQuc3JjRWxlbWVudCA6IChldmVudCA/IGV2ZW50LnRhcmdldCA6IG51bGwpO1xyXG4gICAgfSxcclxuICAgIGdldFBvc2l0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgICAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHkgfHwgeyBzY3JvbGxMZWZ0OiAwLCBzY3JvbGxUb3A6IDAgfTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBldmVudC5wYWdlWCB8fCAoZXZlbnQuY2xpZW50WCArIChkb2NFbGVtZW50LnNjcm9sbExlZnQgfHwgYm9keS5zY3JvbGxMZWZ0KSAtIChkb2NFbGVtZW50LmNsaWVudExlZnQgfHwgMCkpLFxyXG4gICAgICAgICAgICB5OiBldmVudC5wYWdlWSB8fCAoZXZlbnQuY2xpZW50WSArIChkb2NFbGVtZW50LnNjcm9sbFRvcCB8fCBib2R5LnNjcm9sbFRvcCkgLSAoZG9jRWxlbWVudC5jbGllbnRUb3AgfHwgMCkpXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LnByZXZlbnREZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cuZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgd2luZG93LmV2ZW50LmNhbmNlbEJ1YmJsZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBhZGQ6IGZ1bmN0aW9uICh0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRhcmdldC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGFyZ2V0LmF0dGFjaEV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGFyZ2V0WydvbicgKyB0eXBlXSA9IGxpc3RlbmVyO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uICh0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGFyZ2V0LmRldGFjaEV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRhcmdldC5kZXRhY2hFdmVudCgnb24nICsgdHlwZSwgbGlzdGVuZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGFyZ2V0WydvbicgKyB0eXBlXSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGZpcmU6IGZ1bmN0aW9uICh0YXJnZXQsIHR5cGUpIHtcclxuICAgICAgICB2YXIgZXZlbnRzID0gdGFyZ2V0Ll9saXN0ZW5lcnNbdHlwZV07XHJcbiAgICAgICAgaWYgKGV2ZW50cyBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBldmVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnRzW2ldID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudHNbaV0oeyB0eXBlOiB0eXBlIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciB4ID0gcmVxdWlyZShcIi4vYmFzZVwiKTtcclxudmFyIGV2ZW50ID0gcmVxdWlyZShcIi4vZXZlbnRcIik7XHJcbnZhciBkZWZhdWx0cyA9IHtcclxuICAgIHJldHVyblR5cGU6ICdqc29uJyxcclxuICAgIHhockRhdGFLZXk6ICd4aHIteG1sJyxcclxuICAgIGdldEFjY2Vzc1Rva2VuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2xpZW50SWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIH0sXHJcbiAgICBnZXRDbGllbnRTaWduYXR1cmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIH0sXHJcbiAgICBnZXRUaW1lc3RhbXA6IGZ1bmN0aW9uICgpIHtcclxuICAgIH0sXHJcbiAgICBnZXROb25jZTogZnVuY3Rpb24gKCkge1xyXG4gICAgfSxcclxuICAgIGdldFdhaXRpbmdXaW5kb3c6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgb3B0aW9ucyA9IHguZXh0ZW5kKHtcclxuICAgICAgICAgICAgdHlwZTogJ2RlZmF1bHQnLFxyXG4gICAgICAgICAgICB0ZXh0OiBpMThuLm5ldC53YWl0aW5nLmNvbW1pdFRpcFRleHRcclxuICAgICAgICB9LCBvcHRpb25zIHx8IHt9KTtcclxuICAgICAgICBpZiAoeC5pc1VuZGVmaW5lZChvcHRpb25zLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMubmFtZSA9IHguZ2V0RnJpZW5kbHlOYW1lKGxvY2F0aW9uLnBhdGhuYW1lICsgJyQnICsgb3B0aW9ucy50eXBlICsgJyR3YWl0aW5nJHdpbmRvdycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmFtZSA9IG9wdGlvbnMubmFtZTtcclxuICAgICAgICBpZiAoeC5pc1VuZGVmaW5lZCh3aW5kb3dbbmFtZV0pKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT0gJ21pbmknKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dbbmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZSArICctdGV4dCcpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKCc8ZGl2IGlkPVwiJyArIHRoaXMubmFtZSArICctY29udGFpbmVyXCIgY2xhc3M9XCJ4LXVpLWRpYWxvZy13YWl0aW5nLW1pbmktd2luZG93LWNvbnRhaW5lclwiID48ZGl2IGlkPVwiJyArIHRoaXMubmFtZSArICctdGV4dFwiIGNsYXNzPVwieC11aS1kaWFsb2ctd2FpdGluZy1taW5pLXdpbmRvdy10ZXh0XCIgPicgKyB0ZXh0ICsgJzwvZGl2PjwvZGl2PicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5xdWVyeSgnW2lkPVwiJyArIHRoaXMubmFtZSArICctdGV4dFwiXScpLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZSArICctY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF4LmlzVW5kZWZpbmVkKGFyZ3VtZW50c1swXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy50ZXh0ID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlKHRoaXMub3B0aW9ucy50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC5jc3Muc3R5bGUodGhpcy5jb250YWluZXIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnNHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbTogJzRweCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNzcy5zdHlsZSh0aGlzLmNvbnRhaW5lciwgeyBkaXNwbGF5OiAnbm9uZScgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMudHlwZSA9PSAncGx1cycpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvd1tuYW1lXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IG9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXguaXNVbmRlZmluZWQoYXJndW1lbnRzWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRleHQgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGUodGhpcy5vcHRpb25zLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IHBsdXMubmF0aXZlVUkuc2hvd1dhaXRpbmcodGhpcy5vcHRpb25zLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250YWluZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dbbmFtZV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hc2tXcmFwcGVyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2s6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4T3BhY2l0eTogb3B0aW9ucy5tYXhPcGFjaXR5ID8gb3B0aW9ucy5tYXhPcGFjaXR5IDogMC40LFxyXG4gICAgICAgICAgICAgICAgICAgIG1heER1cmF0aW9uOiBvcHRpb25zLm1heER1cmF0aW9uID8gb3B0aW9ucy5tYXhEdXJhdGlvbiA6IDAuMixcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IG9wdGlvbnMuaGVpZ2h0ID8gb3B0aW9ucy5oZWlnaHQgOiA1MCxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogb3B0aW9ucy53aWR0aCA/IG9wdGlvbnMud2lkdGggOiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJhbmdlID0geC5wYWdlLmdldFJhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb2ludFggPSAocmFuZ2Uud2lkdGggLSB0aGlzLndpZHRoKSAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb2ludFkgPSAocmFuZ2UuaGVpZ2h0IC0gdGhpcy5oZWlnaHQpIC8gMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgeC5kb20uZml4ZWQodGhpcy5jb250YWluZXIsIHBvaW50WCwgcG9pbnRZKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1hc2tXcmFwcGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3JhcHBlciA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoJzxkaXYgaWQ9XCInICsgdGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlclwiIHN0eWxlPVwiZGlzcGxheTpub25lO1wiID48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLm5hbWUgKyAnLW1hc2tXcmFwcGVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5jbGFzc05hbWUgPSAneC11aS1kaWFsb2ctbWFzay13cmFwcGVyJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5zdHlsZS5oZWlnaHQgPSB4LnBhZ2UuZ2V0UmFuZ2UoKS5oZWlnaHQgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVyLnN0eWxlLndpZHRoID0geC5wYWdlLmdldFJhbmdlKCkud2lkdGggKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod3JhcHBlci5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyMnICsgdGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlcicpLmNzcyh7IGRpc3BsYXk6ICcnLCBvcGFjaXR5OiAwLjEgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjJyArIHRoaXMubmFtZSArICctbWFza1dyYXBwZXInKS5mYWRlVG8oKHRoaXMubWF4RHVyYXRpb24gKiAxMDAwKSwgdGhpcy5tYXhPcGFjaXR5LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5uYW1lICsgJy10ZXh0JykgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQoJzxkaXYgaWQ9XCInICsgdGhpcy5uYW1lICsgJy1jb250YWluZXJcIiBjbGFzcz1cIngtdWktZGlhbG9nLXdhaXRpbmctd2luZG93LWNvbnRhaW5lclwiID48ZGl2IGlkPVwiJyArIHRoaXMubmFtZSArICctdGV4dFwiIGNsYXNzPVwieC11aS1kaWFsb2ctd2FpdGluZy13aW5kb3ctdGV4dFwiID4nICsgdGV4dCArICc8L2Rpdj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTWFza1dyYXBwZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZSArICctdGV4dCcpLmlubmVySFRNTCA9IHRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZSArICctY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc2tXcmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBzaG93OiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2srKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5sb2NrID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoYXQubWFza1dyYXBwZXIgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1hc2tXcmFwcGVyID0geC51aS5tYXNrLm5ld01hc2tXcmFwcGVyKHRoYXQubmFtZSArICctbWFza1dyYXBwZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHRleHQpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQub3B0aW9ucy50ZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY3JlYXRlKHRoYXQub3B0aW9ucy50ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByYW5nZSA9IHgucGFnZS5nZXRSYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvaW50WCA9IChyYW5nZS53aWR0aCAtIHRoYXQud2lkdGgpIC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb2ludFkgPSAxMjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmRvbS5maXhlZCh0aGF0LmNvbnRhaW5lciwgcG9pbnRYLCBwb2ludFkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tYXNrV3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2NrLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvY2sgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hc2tXcmFwcGVyICE9IG51bGwgJiYgeC5kb20oJyMnICsgdGhpcy5uYW1lICsgJy1tYXNrV3JhcHBlcicpLmNzcygnZGlzcGxheScpICE9PSAnbm9uZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5kb20oJyMnICsgdGhhdC5uYW1lICsgJy1tYXNrV3JhcHBlcicpLmNzcyh7IGRpc3BsYXk6ICdub25lJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbmRvd1tuYW1lXS5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvd1tuYW1lXTtcclxuICAgIH0sXHJcbiAgICBjYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24gKHJlc3BvbnNlLCBvdXRwdXRUeXBlKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHgudG9KU09OKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgaWYgKCF4LmlzVW5kZWZpbmVkKHJlc3VsdCkgJiYgIXguaXNVbmRlZmluZWQocmVzdWx0LnN1Y2Nlc3MpICYmIHJlc3VsdC5zdWNjZXNzID09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChvdXRwdXRUeXBlID09ICdjb25zb2xlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHguZGVidWcuZXJyb3IocmVzdWx0Lm1zZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB4Lm1zZyhyZXN1bHQubXNnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgeC5kZWJ1Zy5lcnJvcihleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG52YXIga2V5cyA9IFtcImFjY2Vzcy10b2tlblwiLCBcImNsaWVudC1pZFwiLCBcImNsaWVudC1zaWduYXR1cmVcIiwgXCJ0aW1lc3RhbXBcIiwgXCJub25jZVwiXTtcclxuZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIga2V5ID0ga2V5c1tpXTtcclxuICAgIHZhciBjYW1lbE5hbWUgPSB4LmNhbWVsQ2FzZShrZXkpO1xyXG4gICAgY2FtZWxOYW1lID0gY2FtZWxOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBjYW1lbE5hbWUuc3Vic3RyKDEpO1xyXG4gICAgZGVmYXVsdHNbJ2dldCcgKyBjYW1lbE5hbWVdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2VbJ3Nlc3Npb24tJyArIGtleV0gfHwgKHgucXVlcnkoJ3Nlc3Npb24tJyArIGtleSkgPT0gbnVsbCA/IG51bGwgOiB4LnF1ZXJ5KCdzZXNzaW9uLScgKyBrZXkpLnZhbHVlKSB8fCAnJztcclxuICAgIH07XHJcbn1cclxudmFyIHNlbGYgPSB7XHJcbiAgICBnZXRXYWl0aW5nV2luZG93OiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBkZWZhdWx0cy5nZXRXYWl0aW5nV2luZG93KG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIHhocjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB1cmwsIHhockRhdGFWYWx1ZSwgb3B0aW9ucztcclxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAyICYmIHgudHlwZShhcmd1bWVudHNbMV0pID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB1cmwgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHhockRhdGFWYWx1ZSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDIgJiYgeC50eXBlKGFyZ3VtZW50c1sxXSkgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHVybCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICB4aHJEYXRhVmFsdWUgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMyAmJiB4LnR5cGUoYXJndW1lbnRzWzFdKSA9PT0gJ3N0cmluZycgJiYgeC5pc0Z1bmN0aW9uKGFyZ3VtZW50c1syXSkpIHtcclxuICAgICAgICAgICAgdXJsID0gYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICBvcHRpb25zID0geyBjYWxsYmFjazogYXJndW1lbnRzWzJdIH07XHJcbiAgICAgICAgICAgIHhockRhdGFWYWx1ZSA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHVybCA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgeGhyRGF0YVZhbHVlID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvcHRpb25zID0geC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcclxuICAgICAgICB2YXIgZW5hYmxlV2FpdGluZ1dpbmRvdyA9IHguaXNGdW5jdGlvbihvcHRpb25zLmdldFdhaXRpbmdXaW5kb3cpXHJcbiAgICAgICAgICAgICYmICF4LmlzVW5kZWZpbmVkKG9wdGlvbnMud2FpdGluZ01lc3NhZ2UpXHJcbiAgICAgICAgICAgICYmIG9wdGlvbnMud2FpdGluZ01lc3NhZ2UgIT09ICcnO1xyXG4gICAgICAgIGlmIChlbmFibGVXYWl0aW5nV2luZG93KSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuZ2V0V2FpdGluZ1dpbmRvdyh7IHRleHQ6IG9wdGlvbnMud2FpdGluZ01lc3NhZ2UsIHR5cGU6IHguaXNVbmRlZmluZWQob3B0aW9ucy53YWl0aW5nVHlwZSwgJ2RlZmF1bHQnKSB9KS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0eXBlID0gb3B0aW9ucy50eXBlIHx8ICdQT1NUJztcclxuICAgICAgICB2YXIgY29udGVudFR5cGUgPSBvcHRpb25zLmNvbnRlbnRUeXBlIHx8ICd0ZXh0L2h0bWwnO1xyXG4gICAgICAgIHZhciBhc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgdHJ1ZTtcclxuICAgICAgICB2YXIgZGF0YSA9IHguZXh0ZW5kKHt9LCBvcHRpb25zLmRhdGEgfHwge30pO1xyXG4gICAgICAgIGlmICh4LnR5cGUoeGhyRGF0YVZhbHVlKSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgZGF0YSA9IHguZXh0ZW5kKGRhdGEsIHhockRhdGFWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgeG1sID0geC50b1hNTCh4aHJEYXRhVmFsdWUsIDEpO1xyXG4gICAgICAgICAgICBpZiAoeGhyRGF0YVZhbHVlICE9ICcnICYmIHhtbCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtvcHRpb25zLnhockRhdGFLZXldID0geGhyRGF0YVZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKCF4bWwgJiYgeGhyRGF0YVZhbHVlLmluZGV4T2YoJz0nKSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBsaXN0ID0geGhyRGF0YVZhbHVlLnNwbGl0KCcmJyk7XHJcbiAgICAgICAgICAgICAgICB4LmVhY2gobGlzdCwgZnVuY3Rpb24gKGluZGV4LCBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gbm9kZS5zcGxpdCgnPScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2l0ZW1zWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChpdGVtc1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHguaXNGdW5jdGlvbihvcHRpb25zLmdldEFjY2Vzc1Rva2VuKSAmJiBvcHRpb25zLmdldEFjY2Vzc1Rva2VuKCkgIT0gJycpIHtcclxuICAgICAgICAgICAgZGF0YS5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuZ2V0QWNjZXNzVG9rZW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoeC5pc0Z1bmN0aW9uKG9wdGlvbnMuZ2V0Q2xpZW50SWQpICYmIG9wdGlvbnMuZ2V0Q2xpZW50SWQoKSAhPSAnJykge1xyXG4gICAgICAgICAgICBkYXRhLmNsaWVudElkID0gb3B0aW9ucy5nZXRDbGllbnRJZCgpO1xyXG4gICAgICAgICAgICBpZiAoeC5pc0Z1bmN0aW9uKG9wdGlvbnMuZ2V0Q2xpZW50SWQpICYmIG9wdGlvbnMuZ2V0Q2xpZW50U2lnbmF0dXJlKCkgIT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEuY2xpZW50U2lnbmF0dXJlID0gb3B0aW9ucy5nZXRDbGllbnRTaWduYXR1cmUoKTtcclxuICAgICAgICAgICAgICAgIGRhdGEudGltZXN0YW1wID0gb3B0aW9ucy5nZXRUaW1lc3RhbXAoKTtcclxuICAgICAgICAgICAgICAgIGRhdGEubm9uY2UgPSBvcHRpb25zLmdldE5vbmNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZi5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZSxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgYXN5bmM6IGFzeW5jLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlbmFibGVXYWl0aW5nV2luZG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5nZXRXYWl0aW5nV2luZG93KHsgdHlwZTogeC5pc1VuZGVmaW5lZChvcHRpb25zLndhaXRpbmdUeXBlLCAnZGVmYXVsdCcpIH0pLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnJldHVyblR5cGUgPT0gJ2pzb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jYXRjaEV4Y2VwdGlvbihyZXNwb25zZSwgb3B0aW9ucy5vdXRwdXRFeGNlcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB4LnRvSlNPTihyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHguaXNVbmRlZmluZWQocmVzdWx0KSB8fCB4LmlzVW5kZWZpbmVkKHJlc3VsdC5tZXNzYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmNhbGwob3B0aW9ucy5jYWxsYmFjaywgeC50b0pTT04ocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gcmVzdWx0Lm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoTnVtYmVyKG1lc3NhZ2UucmV0dXJuQ29kZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5tc2cobWVzc2FnZS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEhb3B0aW9ucy5wb3BDb3JyZWN0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5tc2cobWVzc2FnZS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHguY2FsbChvcHRpb25zLmNhbGxiYWNrLCB4LnRvSlNPTihyZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFvcHRpb25zLnBvcEluY29ycmVjdFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgubXNnKG1lc3NhZ2UudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LmNhbGwob3B0aW9ucy5jYWxsYmFjaywgeC50b0pTT04ocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHguY2FsbChvcHRpb25zLmNhbGxiYWNrLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XHJcbiAgICAgICAgICAgICAgICB4LmRlYnVnLmxvZyhYTUxIdHRwUmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHguaXNGdW5jdGlvbihvcHRpb25zLmVycm9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZXJyb3IoWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChYTUxIdHRwUmVxdWVzdC5zdGF0dXMgPT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgubXNnKGkxOG4ubmV0LmVycm9yc1snNDAxJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChYTUxIdHRwUmVxdWVzdC5zdGF0dXMgPT0gNDA0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgubXNnKGkxOG4ubmV0LmVycm9yc1snNDA0J10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChYTUxIdHRwUmVxdWVzdC5zdGF0dXMgPT0gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHgubXNnKGkxOG4ubmV0LmVycm9yc1snNTAwJ10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChYTUxIdHRwUmVxdWVzdC5zdGF0dXMgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmRlYnVnLmVycm9yKGkxOG4ubmV0LmVycm9yc1sndW5rb3duJ10uZm9ybWF0KFhNTEh0dHBSZXF1ZXN0LnN0YXR1cyArIChYTUxIdHRwUmVxdWVzdC5zdGF0dXNUZXh0ICE9ICcnID8gKCcgJyArIFhNTEh0dHBSZXF1ZXN0LnN0YXR1c1RleHQpIDogJycpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcmVxdWlyZUxvYWRlZDoge30sXHJcbiAgICByZXF1aXJlOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIG9wdGlvbnMgPSB4LmV4dGVuZCh7XHJcbiAgICAgICAgICAgIGZpbGVUeXBlOiAnc2NyaXB0JyxcclxuICAgICAgICAgICAgaWQ6ICcnLFxyXG4gICAgICAgICAgICBwYXRoOiAnJyxcclxuICAgICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlXHJcbiAgICAgICAgfSwgb3B0aW9ucyB8fCB7fSk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaWQgIT0gJycgJiYgc2VsZi5yZXF1aXJlTG9hZGVkW29wdGlvbnMuaWRdKSB7XHJcbiAgICAgICAgICAgIHguZGVidWcubG9nKHguc3RyaW5nLmZvcm1hdCgncmVxdWlyZSBmaWxlIHtcImlkXCI6XCJ7MH1cIiwgcGF0aDpcInsxfVwifSBleGlzdC4gW2FqYXhdJywgb3B0aW9ucy5pZCwgb3B0aW9ucy5wYXRoKSk7XHJcbiAgICAgICAgICAgIHguY2FsbChvcHRpb25zLmNhbGxiYWNrKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHguZGVidWcubG9nKHguc3RyaW5nLmZvcm1hdCgncmVxdWlyZSBmaWxlIHtcImlkXCI6XCJ7MH1cIiwgcGF0aDpcInsxfVwifSBsb2FkaW5nLiBbYWpheF0nLCBvcHRpb25zLmlkLCBvcHRpb25zLnBhdGgpKTtcclxuICAgICAgICBzZWxmLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBvcHRpb25zLnR5cGUsXHJcbiAgICAgICAgICAgIHVybDogb3B0aW9ucy5wYXRoLFxyXG4gICAgICAgICAgICBhc3luYzogb3B0aW9ucy5hc3luYyxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgeC5kZWJ1Zy5sb2coeC5zdHJpbmcuZm9ybWF0KCdyZXF1aXJlIGZpbGUge1wiaWRcIjpcInswfVwiLCBwYXRoOlwiezF9XCJ9IGZpbmlzaGVkLiBbYWpheF0nLCBvcHRpb25zLmlkLCBvcHRpb25zLnBhdGgpKTtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIkhFQURcIikuaXRlbSgwKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmZpbGVUeXBlID09ICd0ZW1wbGF0ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnR5cGUgPSBcInRleHQvdGVtcGxhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnNyYyA9IG9wdGlvbnMucGF0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMuZmlsZVR5cGUgPT0gJ2NzcycpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmhyZWYgPSBvcHRpb25zLnBhdGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmxhbmd1YWdlID0gXCJqYXZhc2NyaXB0XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnNyYyA9IG9wdGlvbnMucGF0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXNwb25zZVRleHQpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUudGV4dCA9IHJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmlkICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pZCA9IG9wdGlvbnMuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXF1aXJlTG9hZGVkW29wdGlvbnMuaWRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB4LmNhbGwob3B0aW9ucy5jYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBhamF4OiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHZhciByZXF1ZXN0ID0gc2VsZi5uZXdIdHRwUmVxdWVzdChvcHRpb25zKTtcclxuICAgICAgICByZXF1ZXN0LnNlbmQoKTtcclxuICAgIH0sXHJcbiAgICBuZXdIdHRwUmVxdWVzdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgeGhyOiBudWxsLFxyXG4gICAgICAgICAgICBkYXRhOiBudWxsLFxyXG4gICAgICAgICAgICB0aW1lb3V0OiA5MCxcclxuICAgICAgICAgICAgZG9uZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnhociA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54aHIgPSBzZWxmLm5ld1htbEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnhocikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4LmRlYnVnLmVycm9yKCdjcmVhdGUgeGhyIGZhaWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy54aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsLCB0aGlzLmFzeW5jKTtcclxuICAgICAgICAgICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBldmVudC5hZGQodGhpcy54aHIsIFwicmVhZHlzdGF0ZWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHhociA9IG1lLnhocjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCAmJiAhbWUuZG9uZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAwIHx8ICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09IDMwNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jYWxsKG1lLnN1Y2Nlc3MsIHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeC5jYWxsKG1lLmVycm9yLCB4aHIsIHhoci5zdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhociA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgbWUuZG9uZSA9IHRydWU7IH0sIG1lLnRpbWVvdXQgKiAxMDAwKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT0gJ1BPU1QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnhoci5zZW5kKHguc2VyaWFsaXplKHRoaXMuZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy54aHIuc2VuZChudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHguZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDkwXHJcbiAgICAgICAgICAgICAgICB9LCBvcHRpb25zIHx8IHt9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cmwgPSBvcHRpb25zLnVybDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IG9wdGlvbnMuZGF0YTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXN5bmMgPSBvcHRpb25zLmFzeW5jO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdWNjZXNzID0gb3B0aW9ucy5zdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IG9wdGlvbnMuZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcXVlc3QuY3JlYXRlKG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiByZXF1ZXN0O1xyXG4gICAgfSxcclxuICAgIG5ld1htbEh0dHBSZXF1ZXN0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG51bGw7XHJcbiAgICAgICAgdmFyIGdsb2JhbCA9IHguZ2xvYmFsKCk7XHJcbiAgICAgICAgaWYgKGdsb2JhbFtcIkFjdGl2ZVhPYmplY3RcIl0pIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTXN4bWwyLlhNTEhUVFBcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgICAgICAgICB4aHIgPSBuZXcgQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGdsb2JhbFtcIlhNTEh0dHBSZXF1ZXN0XCJdKSB7XHJcbiAgICAgICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geGhyO1xyXG4gICAgfSxcclxuICAgIHJlcXVlc3Q6IHtcclxuICAgICAgICBmaW5kOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRWYWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQoJyYnKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdFtpXS5pbmRleE9mKGtleSkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRWYWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChsaXN0W2ldLnJlcGxhY2Uoa2V5ICsgJz0nLCAnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRWYWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpbmRBbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIG91dFN0cmluZyA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQoJyYnKTtcclxuICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoID0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB0ZW1wO1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgPSAneyc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGVtcCA9IGxpc3RbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSAnXCInICsgdGVtcFswXSArICdcIjpcIicgKyBkZWNvZGVVUklDb21wb25lbnQodGVtcFsxXSkgKyAnXCInO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCBsaXN0Lmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9ICcsJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRTdHJpbmcgKz0gJ30nO1xyXG4gICAgICAgICAgICByZXR1cm4geC5ldmFsSlNPTihvdXRTdHJpbmcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0UmF3VXJsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhdGlvbi5ocmVmLnJlcGxhY2UobG9jYXRpb24ub3JpZ2luLCAnJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBoYXNoOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhdGlvbi5oYXNoID09PSAoJyMnICsga2V5KSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbnZhciByZXF1ZXN0X2NhbGxiYWNrID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0geC50b0pTT04ocmVzcG9uc2UpLm1lc3NhZ2U7XHJcbiAgICBzd2l0Y2ggKE51bWJlcihyZXN1bHQucmV0dXJuQ29kZSkpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgLTE6XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICB4Lm1zZyhyZXN1bHQudmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB4Lm1zZyhyZXN1bHQudmFsdWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHggPSByZXF1aXJlKFwiLi9iYXNlXCIpO1xyXG52YXIgc3RyaW5nID0gcmVxdWlyZShcIi4vc3RyaW5nXCIpO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgJ3RyaW0nOiAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csXHJcbiAgICAgICAgJ2RhdGUnOiAvKCheKCgxWzgtOV1cXGR7Mn0pfChbMi05XVxcZHszfSkpKFstXFwvXFwuX10pKDEwfDEyfDA/WzEzNTc4XSkoWy1cXC9cXC5fXSkoM1swMV18WzEyXVswLTldfDA/WzEtOV0pJCl8KF4oKDFbOC05XVxcZHsyfSl8KFsyLTldXFxkezN9KSkoWy1cXC9cXC5fXSkoMTF8MD9bNDY5XSkoWy1cXC9cXC5fXSkoMzB8WzEyXVswLTldfDA/WzEtOV0pJCl8KF4oKDFbOC05XVxcZHsyfSl8KFsyLTldXFxkezN9KSkoWy1cXC9cXC5fXSkoMD8yKShbLVxcL1xcLl9dKSgyWzAtOF18MVswLTldfDA/WzEtOV0pJCl8KF4oWzI0NjhdWzA0OF0wMCkoWy1cXC9cXC5fXSkoMD8yKShbLVxcL1xcLl9dKSgyOSkkKXwoXihbMzU3OV1bMjZdMDApKFstXFwvXFwuX10pKDA/MikoWy1cXC9cXC5fXSkoMjkpJCl8KF4oWzFdWzg5XVswXVs0OF0pKFstXFwvXFwuX10pKDA/MikoWy1cXC9cXC5fXSkoMjkpJCl8KF4oWzItOV1bMC05XVswXVs0OF0pKFstXFwvXFwuX10pKDA/MikoWy1cXC9cXC5fXSkoMjkpJCl8KF4oWzFdWzg5XVsyNDY4XVswNDhdKShbLVxcL1xcLl9dKSgwPzIpKFstXFwvXFwuX10pKDI5KSQpfCheKFsyLTldWzAtOV1bMjQ2OF1bMDQ4XSkoWy1cXC9cXC5fXSkoMD8yKShbLVxcL1xcLl9dKSgyOSkkKXwoXihbMV1bODldWzEzNTc5XVsyNl0pKFstXFwvXFwuX10pKDA/MikoWy1cXC9cXC5fXSkoMjkpJCl8KF4oWzItOV1bMC05XVsxMzU3OV1bMjZdKShbLVxcL1xcLl9dKSgwPzIpKFstXFwvXFwuX10pKDI5KSQpKS9nLFxyXG4gICAgICAgICd1cmwnOiBcIl4oKGh0dHBzfGh0dHB8ZnRwfHJ0c3B8bW1zKT86Ly8pPygoWzAtOWEtel8hfionKCkuJj0rJCUtXSs6ICk/WzAtOWEtel8hfionKCkuJj0rJCUtXStAKT8oKFswLTldezEsM31cXC4pezN9WzAtOV17MSwzfXwoWzAtOWEtel8hfionKCktXStcXC4pKihbMC05YS16XVswLTlhLXotXXswLDYxfSk/WzAtOWEtel1cXC5bYS16XXsyLDZ9KSg6WzAtOV17MSw0fSk/KCgvPyl8KC9bMC05YS16XyF+KicoKS47PzpAJj0rJCwlIy1dKykrLz8pJFwiLFxyXG4gICAgICAgICd0ZWxlcGhvbmUnOiAvKF5cXGQrJCl8KCheXFxkKykoW1xcZHxcXC1dKykoKFxcZCspJCkpfCgoXlxcKykoW1xcZHxcXC1dKykoKFxcZCspJCkpL2csXHJcbiAgICAgICAgJ25vbi10ZWxlcGhvbmUnOiAvW15cXGRcXC1cXCtdL2csXHJcbiAgICAgICAgJ2VtYWlsJzogL15cXHcrKCgtXFx3Kyl8KFxcX1xcdyspfChcXCdcXHcrKXwoXFwuXFx3KykpKlxcQFtBLVphLXowLTldKygoXFwufC0pW0EtWmEtejAtOV0rKSpcXC5bQS1aYS16MC05XSskL2csXHJcbiAgICAgICAgJ3FxJzogL15cXHcrKCgtXFx3Kyl8KFxcX1xcdyspfChcXCdcXHcrKXwoXFwuXFx3KykpKlxcQFtBLVphLXowLTldKygoXFwufC0pW0EtWmEtejAtOV0rKSpcXC5bQS1aYS16MC05XSskL2csXHJcbiAgICAgICAgJ251bWJlcic6IC8oXi0/XFxkKyQpfCheLT9cXGQrW1xcLj9dXFxkKyQpL2csXHJcbiAgICAgICAgJ25vbi1udW1iZXInOiAvW15cXGRcXC5cXC1dL2csXHJcbiAgICAgICAgJ2ludGVnZXInOiAvXi0/XFxkKyQvZyxcclxuICAgICAgICAncG9zaXRpdmUtaW50ZWdlcic6IC9eXFxkKyQvZyxcclxuICAgICAgICAnbm9uLWludGVnZXInOiAvW15cXGRcXC1dL2csXHJcbiAgICAgICAgJ3NhZmVUZXh0JzogL0EtWmEtejAtOV9cXC0vZyxcclxuICAgICAgICAnbm9uLXNhZmVUZXh0JzogL1teQS1aYS16MC05X1xcLV0vZyxcclxuICAgICAgICAnZmlsZUV4dCc6ICdqcGcsZ2lmLGpwZWcscG5nLGJtcCxwc2Qsc2l0LHRpZix0aWZmLGVwcyxwbmcsYWkscXhkLHBkZixjZHIsemlwLHJhcicsXHJcbiAgICAgICAgJ2VuLXVzJzoge1xyXG4gICAgICAgICAgICAnemlwY29kZSc6IC9eXFxkezV9LVxcZHs0fSR8XlxcZHs1fSQvZ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ3poLWNuJzoge1xyXG4gICAgICAgICAgICAnaWRlbnRpdHlDYXJkJzogLyheXFxkezE1fSQpfCheXFxkezE4fSQpfCheXFxkezE3fVtYfHhdJCkvZyxcclxuICAgICAgICAgICAgJ3ppcGNvZGUnOiAvXlxcZHs2fSQvZ1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtYXRjaDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgdGV4dCA9IFN0cmluZyhvcHRpb25zLnRleHQpO1xyXG4gICAgICAgIHZhciBpZ25vcmVDYXNlID0gb3B0aW9ucy5pZ25vcmVDYXNlO1xyXG4gICAgICAgIHZhciByZWdleHBOYW1lID0gb3B0aW9ucy5yZWdleHBOYW1lO1xyXG4gICAgICAgIHZhciByZWdleHAgPSB0eXBlb2YgKG9wdGlvbnMucmVnZXhwKSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBuZXcgUmVnRXhwKG9wdGlvbnMucmVnZXhwKTtcclxuICAgICAgICBpZiAoaWdub3JlQ2FzZSA9PT0gMSkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIChyZWdleHApID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHJlZ2V4cE5hbWUpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZWdleHAgPSBzZWxmLnJ1bGVzW3JlZ2V4cE5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5tYXRjaChyZWdleHApO1xyXG4gICAgfSxcclxuICAgIGV4aXN0czogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgdGV4dCA9IFN0cmluZyhvcHRpb25zLnRleHQpO1xyXG4gICAgICAgIHZhciBpZ25vcmVDYXNlID0gb3B0aW9ucy5pZ25vcmVDYXNlO1xyXG4gICAgICAgIHZhciByZWdleHBOYW1lID0gb3B0aW9ucy5yZWdleHBOYW1lO1xyXG4gICAgICAgIHZhciByZWdleHAgPSB0eXBlb2YgKG9wdGlvbnMucmVnZXhwKSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBuZXcgUmVnRXhwKG9wdGlvbnMucmVnZXhwKTtcclxuICAgICAgICBpZiAoaWdub3JlQ2FzZSkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIChyZWdleHApID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgKHJlZ2V4cE5hbWUpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICByZWdleHAgPSBzZWxmLnJ1bGVzW3JlZ2V4cE5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dC5tYXRjaChyZWdleHApICE9PSBudWxsO1xyXG4gICAgfSxcclxuICAgIGlzRmlsZUV4dDogZnVuY3Rpb24gKHBhdGgsIGFsbG93RmlsZUV4dCkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICB2YXIgZXh0ID0gcGF0aC5zdWJzdHIocGF0aC5sYXN0SW5kZXhPZignLicpLCBwYXRoLmxlbmd0aCAtIHBhdGgubGFzdEluZGV4T2YoJy4nKSk7XHJcbiAgICAgICAgdmFyIGV4dFZhbHVlID0gKChhbGxvd0ZpbGVFeHQpID8gYWxsb3dGaWxlRXh0IDogc2VsZi5ydWxlc1snZmlsZUV4dCddKTtcclxuICAgICAgICBleHQgPSBleHQucmVwbGFjZSgnLicsICcnKTtcclxuICAgICAgICBpZiAoZXh0VmFsdWUuaW5kZXhPZignLCcpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gZXh0VmFsdWUuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXh0LnRvTG93ZXJDYXNlKCkgPT0gbGlzdFtpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChleHQudG9Mb3dlckNhc2UoKSA9PSBleHRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuICAgIGlzVXJsOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXh0LnRvTG93ZXJDYXNlKCkuZXhpc3RzKHNlbGYucnVsZXNbJ3VybCddKTtcclxuICAgIH0sXHJcbiAgICBpc0VtYWlsOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXh0LnRvTG93ZXJDYXNlKCkuZXhpc3RzKHNlbGYucnVsZXNbJ2VtYWlsJ10pO1xyXG4gICAgfSxcclxuICAgIGlzWmlwY29kZTogZnVuY3Rpb24gKHRleHQsIG5hdHVyZSkge1xyXG4gICAgICAgIG5hdHVyZSA9IHguZm9ybWF0TG9jYWxlKG5hdHVyZSk7XHJcbiAgICAgICAgcmV0dXJuIHRleHQuZXhpc3RzKHNlbGYucnVsZXNbbmF0dXJlXVsnemlwY29kZSddKTtcclxuICAgIH0sXHJcbiAgICBpc1NhZmVUZXh0OiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICAgIHJldHVybiB0ZXh0LmV4aXN0cyhzZWxmLnJ1bGVzWydzYWZlVGV4dCddKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRUZWxlcGhvbmU6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZShzZWxmLnJ1bGVzWydub24tdGVsZXBob25lJ10sICcnKTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRJbnRlZ2VyOiBmdW5jdGlvbiAodmFsdWUsIHJlbW92ZVBhZGRpbmdaZXJvKSB7XHJcbiAgICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpLnJlcGxhY2Uoc2VsZi5ydWxlc1snbm9uLWludGVnZXInXSwgJycpO1xyXG4gICAgICAgIGlmIChzdHJpbmcudHJpbSh2YWx1ZSkgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gJzAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVtb3ZlUGFkZGluZ1plcm8pIHtcclxuICAgICAgICAgICAgdmFsdWUgPSBTdHJpbmcocGFyc2VJbnQodmFsdWUsIDEwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXROdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSwgcmVtb3ZlUGFkZGluZ1plcm8pIHtcclxuICAgICAgICBpZiAocmVtb3ZlUGFkZGluZ1plcm8gPT09IHZvaWQgMCkgeyByZW1vdmVQYWRkaW5nWmVybyA9IHRydWU7IH1cclxuICAgICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSkucmVwbGFjZShzZWxmLnJ1bGVzWydub24tbnVtYmVyJ10sICcnKTtcclxuICAgICAgICB2YWx1ZSA9ICh2YWx1ZS50cmltKCkgPT09ICcnKSA/ICcwJyA6IHZhbHVlO1xyXG4gICAgICAgIGlmIChyZW1vdmVQYWRkaW5nWmVybykge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IFN0cmluZyhwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXROdW1iZXJSb3VuZDI6IGZ1bmN0aW9uICh2YWx1ZSwgcmVtb3ZlUGFkZGluZ1plcm8pIHtcclxuICAgICAgICBpZiAocmVtb3ZlUGFkZGluZ1plcm8gPT09IHZvaWQgMCkgeyByZW1vdmVQYWRkaW5nWmVybyA9IHRydWU7IH1cclxuICAgICAgICB2YXIgdGV4dCA9ICcnICsgTWF0aC5yb3VuZChOdW1iZXIoc2VsZi5mb3JtYXROdW1iZXIodmFsdWUpKSAqIDEwMCkgLyAxMDA7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGV4dC5pbmRleE9mKCcuJyk7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dCArICcuMDAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIGluZGV4ICsgMSkgKyB0ZXh0LnN1YnN0cmluZyhpbmRleCArIDEsIGluZGV4ICsgMyk7XHJcbiAgICAgICAgaWYgKGluZGV4ICsgMiA9PSB0ZXh0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0ZXh0ICs9ICcwJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlbW92ZVBhZGRpbmdaZXJvKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh0ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSxcclxuICAgIGZvcm1hdE51bWJlclJvdW5kOiBmdW5jdGlvbiAodmFsdWUsIGxlbmd0aCwgcmVtb3ZlUGFkZGluZ1plcm8pIHtcclxuICAgICAgICBpZiAobGVuZ3RoID09PSB2b2lkIDApIHsgbGVuZ3RoID0gMjsgfVxyXG4gICAgICAgIGlmIChyZW1vdmVQYWRkaW5nWmVybyA9PT0gdm9pZCAwKSB7IHJlbW92ZVBhZGRpbmdaZXJvID0gdHJ1ZTsgfVxyXG4gICAgICAgIHZhciBtdWx0aXBsZSA9IDEwO1xyXG4gICAgICAgIHZhciBjb3VudCA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGNvdW50IDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIG11bHRpcGxlICo9IDEwO1xyXG4gICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdGV4dCA9ICcnICsgTWF0aC5yb3VuZChOdW1iZXIoc2VsZi5mb3JtYXROdW1iZXIodmFsdWUpKSAqIG11bHRpcGxlKSAvIG11bHRpcGxlO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRleHQuaW5kZXhPZignLicpO1xyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQgKyAnLjAwJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCBpbmRleCArIDEpICsgdGV4dC5zdWJzdHJpbmcoaW5kZXggKyAxLCBpbmRleCArIGxlbmd0aCArIDEpO1xyXG4gICAgICAgIHdoaWxlICgoaW5kZXggKyBsZW5ndGgpID4gdGV4dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGV4dCArPSAnMCc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZW1vdmVQYWRkaW5nWmVybykge1xyXG4gICAgICAgICAgICB0ZXh0ID0gcGFyc2VGbG9hdCh0ZXh0KS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH0sXHJcbiAgICBmb3JtYXRTYWZlVGV4dDogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHNlbGYucnVsZXNbJ25vbi1zYWZlVGV4dCddLCAnJyk7XHJcbiAgICB9XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciB4ID0gcmVxdWlyZShcIi4vYmFzZVwiKTtcclxudmFyIHRyaW1FeHByID0gL15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nO1xyXG52YXIgc2VsZiA9IHtcclxuICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHR5cGUgPSB4LnR5cGUodmFsdWUpO1xyXG4gICAgICAgIGlmICh0eXBlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ251bWJlcicgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGUgPT09ICdkYXRlJykge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzZWxmLnN0cmluZ2lmeSh2YWx1ZS5jYWxsKHZhbHVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICB0cmltOiBmdW5jdGlvbiAodGV4dCwgdHJpbVRleHQpIHtcclxuICAgICAgICBpZiAodHJpbVRleHQgPT09IHZvaWQgMCkgeyB0cmltVGV4dCA9IHVuZGVmaW5lZDsgfVxyXG4gICAgICAgIGlmICh4LmlzVW5kZWZpbmVkKHRyaW1UZXh0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRyaW1FeHByLCAnJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5ydHJpbShzZWxmLmx0cmltKHRleHQsIHRyaW1UZXh0KSwgdHJpbVRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBsdHJpbTogZnVuY3Rpb24gKHRleHQsIHRyaW1UZXh0KSB7XHJcbiAgICAgICAgaWYgKHRyaW1UZXh0ID09PSB2b2lkIDApIHsgdHJpbVRleHQgPSB1bmRlZmluZWQ7IH1cclxuICAgICAgICBpZiAoeC5pc1VuZGVmaW5lZCh0cmltVGV4dCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvKF5bXFxzXFx1RkVGRlxceEEwXSspL2csICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoUmVnRXhwKCcoXicgKyB0cmltVGV4dC5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpICsgJyknLCAnZ2knKSwgJycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBydHJpbTogZnVuY3Rpb24gKHRleHQsIHRyaW1UZXh0KSB7XHJcbiAgICAgICAgaWYgKHRyaW1UZXh0ID09PSB2b2lkIDApIHsgdHJpbVRleHQgPSB1bmRlZmluZWQ7IH1cclxuICAgICAgICBpZiAoeC5pc1VuZGVmaW5lZCh0cmltVGV4dCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvKFtcXHNcXHVGRUZGXFx4QTBdKyQpL2csICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoUmVnRXhwKCcoJyArIHRyaW1UZXh0LnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykgKyAnJCknLCAnZ2knKSwgJycpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBmb3JtYXQ6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRleHQgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cCgnXFxcXHsnICsgKGkgLSAxKSArICdcXFxcfScsICdnbScpO1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHJlLCBhcmd1bWVudHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH0sXHJcbiAgICBsZWZ0OiBmdW5jdGlvbiAodGV4dCwgbGVuZ3RoLCBoYXNFbGxpcHNpcykge1xyXG4gICAgICAgIGlmIChoYXNFbGxpcHNpcyA9PT0gdm9pZCAwKSB7IGhhc0VsbGlwc2lzID0gdHJ1ZTsgfVxyXG4gICAgICAgIGlmICh0ZXh0Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRleHQubGVuZ3RoID4gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0LnN1YnN0cigwLCBsZW5ndGgpICsgKChoYXNFbGxpcHNpcykgPyAnLi4uJyA6ICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xyXG4iXX0=
