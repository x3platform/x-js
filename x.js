"use strict";
var x = require("./src/core");
var color = require("./src/color");
var date = require("./src/date");
var encoding = require("./src/encoding");
var string = require("./src/string");
module.exports = x.ext(x, {
    date: date,
    // 颜色
    color: color,
    // 编码
    encoding: encoding,
    // 字符串
    string: string
});
