"use strict";
var x = require("./lib/core");
var event = require("./lib/event");
var queue = require("./lib/queue");
var stack = require("./lib/stack");
var color = require("./lib/color");
var encoding = require("./lib/encoding");
var expressions = require("./lib/expressions");
var string = require("./lib/string");
var date = require("./lib/date");
module.exports = x.ext(x, {
    event: event,
    queue: queue,
    stack: stack,
    color: color,
    encoding: encoding,
    expressions: expressions,
    string: string,
    date: date
});
