"use strict";
var x = require("./src/core");
var event = require("./src/event");
var queue = require("./src/queue");
var stack = require("./src/stack");
var color = require("./src/color");
var encoding = require("./src/encoding");
var expressions = require("./src/expressions");
var string = require("./src/string");
var date = require("./src/date");
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
