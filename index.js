"use strict";
var x = require("./lib/core");
var color = require("./lib/color");
var encoding = require("./lib/encoding");
var string = require("./lib/string");
var date = require("./lib/date");
module.exports = x.ext(x, {
    color: color,
    encoding: encoding,
    string: string,
    date: date
});
