define("src/base/lang", ["require", "exports"], function (require, exports) {
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
    return self;
});
define("src/base/StringBuilder", ["require", "exports"], function (require, exports) {
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
});
define("src/base/Timer", ["require", "exports"], function (require, exports) {
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
});
define("src/base/kernel", ["require", "exports", "src/base/lang", "src/base/StringBuilder", "src/base/Timer"], function (require, exports, lang, StringBuilder_1, Timer_1) {
    "use strict";
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
    return self;
});
define("src/base/declare", ["require", "exports", "src/base/lang", "src/base/kernel"], function (require, exports, lang, kernel) {
    "use strict";
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
    return declare;
});
define("src/collections/Hashtable", ["require", "exports", "src/base/declare"], function (require, exports, declare) {
    "use strict";
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
    return self;
});
define("src/collections/Queue", ["require", "exports"], function (require, exports) {
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
    return self;
});
define("src/collections/Stack", ["require", "exports"], function (require, exports) {
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
    return self;
});
define("src/base", ["require", "exports", "src/base/lang", "src/base/kernel", "src/base/declare", "src/collections/Hashtable", "src/collections/Queue", "src/collections/Stack"], function (require, exports, lang, kernel, declare, Hashtable, Queue, Stack) {
    "use strict";
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
    return self;
});
define("src/event", ["require", "exports"], function (require, exports) {
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
    return self;
});
define("src/color", ["require", "exports"], function (require, exports) {
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
    return self;
});
define("src/string", ["require", "exports", "src/base"], function (require, exports, x) {
    "use strict";
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
    return self;
});
define("src/encoding", ["require", "exports", "src/base", "src/string"], function (require, exports, x, string) {
    "use strict";
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
    return self;
});
define("src/regexp", ["require", "exports", "src/base", "src/string"], function (require, exports, x, string) {
    "use strict";
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
    return self;
});
define("src/date", ["require", "exports", "src/base"], function (require, exports, x) {
    "use strict";
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
    return self;
});
define("src/net", ["require", "exports", "src/base", "src/event"], function (require, exports, x, event) {
    "use strict";
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
    return self;
});
define("x", ["require", "exports", "src/base", "src/event", "src/collections/Queue", "src/collections/Stack", "src/color", "src/encoding", "src/regexp", "src/string", "src/date", "src/net"], function (require, exports, base, event, Queue, Stack, color, encoding, regexp, string, date, net) {
    "use strict";
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
        xhr: net.xhr
    });
    var g = x.global();
    if (g.x) {
        g._x_ = g.x;
    }
    g.x = x;
    return x;
});
