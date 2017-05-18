"use strict";
var base = require("./lib/base");
var event = require("./lib/event");
var Queue = require("./lib/collections/Queue");
var Stack = require("./lib/collections/Stack");
var color = require("./lib/color");
var encoding = require("./lib/encoding");
var regexp = require("./lib/regexp");
var string = require("./lib/string");
var date = require("./lib/date");
var net = require("./lib/net");
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
module.exports = x;
