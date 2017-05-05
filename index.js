"use strict";
var x = require("./lib/core");
var declare = require("./lib/base/declare");
var event = require("./lib/event");
var dict2 = require("./lib/dict2");
var queue = require("./lib/queue");
var stack = require("./lib/stack");
var color = require("./lib/color");
var encoding = require("./lib/encoding");
var expressions = require("./lib/expressions");
var string = require("./lib/string");
var date = require("./lib/date");
module.exports = x.ext(x, {
    declare: declare,
    event: event,
    dict: dict2,
    Dict: dict2,
    queue: queue,
    stack: stack,
    color: color,
    encoding: encoding,
    expressions: expressions,
    string: string,
    date: date
});
