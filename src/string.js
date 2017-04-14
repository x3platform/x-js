"use strict";
var x = require("./core");
var trimExpr = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
var string = {
    stringify: function (value) {
        var type = x.type(value);
        if (type !== 'string') {
            if (type === 'number') {
                value += '';
            }
            else if (type === 'function') {
                value = string.stringify(value.call(value));
            }
            else {
                value = '';
            }
        }
        return value;
    },
    trim: function (text, trimText) {
        if (x.isUndefined(trimText)) {
            return text.replace(trimExpr, '');
        }
        else {
            return string.rtrim(string.ltrim(text, trimText), trimText);
        }
    },
    ltrim: function (text, trimText) {
        if (x.isUndefined(trimText)) {
            return text.replace(/(^[\s\uFEFF\xA0]+)/g, '');
        }
        else {
            return text.replace(RegExp('(^' + trimText.replace(/\\/g, '\\\\') + ')', 'gi'), '');
        }
    },
    rtrim: function (text, trimText) {
        if (x.isUndefined(trimText)) {
            return text.replace(/([\s\uFEFF\xA0]+$)/g, '');
        }
        else {
            return text.replace(RegExp('(' + trimText.replace(/\\/g, '\\\\') + '$)', 'gi'), '');
        }
    },
    format: function () {
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
        if (text.length === 0) {
            return text;
        }
        if (text.length > length) {
            return text.substr(0, length) + ((hasEllipsis || true) ? '...' : '');
        }
        else {
            return text;
        }
    }
};
module.exports = string;
