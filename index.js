"use strict";
var base = require("./lib/base");
var event = require("./lib/event");
var Queue = require("./lib/collections/Queue");
var Stack = require("./lib/collections/Stack");
// import * as stack from "./lib/stack";
var color = require("./lib/color");
var encoding = require("./lib/encoding");
var regexp = require("./lib/regexp");
var string = require("./lib/string");
var date = require("./lib/date");
var net = require("./lib/net");
var x = base.extend({}, base, {
    // 事件
    event: event,
    // 字典
    // Hashtable: Hashtable,
    // 队列
    queue: Queue,
    // 栈
    stack: Stack,
    // 颜色
    color: color,
    // 编码
    encoding: encoding,
    // 正则表达式
    regexp: regexp,
    // 字符串
    string: string,
    // 时间
    date: date,
    // 添加事件方法的别名
    on: event.add,
    // 网络
    net: net
});
// 设置快速方法
base.extend(x, {
    // 事件
    on: event.add,
    //
    xhr: net.xhr
});
// 定义全局对象
var g = x.global();
if (g.x) {
    // 如果已存在全局的x变量, 赋值到_x_变量。
    g._x_ = g.x;
}
g.x = x;
module.exports = x;
