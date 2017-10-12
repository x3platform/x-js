import * as base from "./src/base";
import * as declare from "./src/base/declare";

import * as event from "./src/event";

import * as Hashtable from "./src/collections/Hashtable";
import * as Queue from "./src/collections/Queue";
import * as Stack from "./src/collections/Stack";
// import * as stack from "./src/stack";

import * as color from "./src/color";
import * as encoding from "./src/encoding";
import * as regexp from "./src/regexp";
import * as string from "./src/string";
import * as date from "./src/date";
import * as net from "./src/net";

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
  off: event.remove,
  // Ajax 请求
  xhr: net.xhr
});

export = x;
