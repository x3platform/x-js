"use strict";
var x = require("./core");
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
