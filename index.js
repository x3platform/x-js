"use strict";
var x = require("./lib/core");
var declare = require("./lib/base/declare");
var event = require("./lib/event");
var Dict = require("./lib/Dict");
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
    Dict: Dict,
    queue: queue,
    stack: stack,
    color: color,
    encoding: encoding,
    expressions: expressions,
    string: string,
    date: date
});
