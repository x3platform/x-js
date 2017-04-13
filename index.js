"use strict";
var x = require("./lib/core");
var color = require("./lib/color");
var date = require("./lib/date");
var encoding = require("./lib/encoding");
var string = require("./lib/string");
module.exports = x.ext(x, {
    date: date,
    // 颜色
    color: color,
    // 编码
    encoding: encoding,
    // 字符串
    string: string
});
