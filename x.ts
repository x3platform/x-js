import * as x from "./src/core";
import * as declare from "./src/base/declare";

import * as event from "./src/event";

import * as Dict from "./src/Dict";
import * as queue from "./src/queue";
import * as stack from "./src/stack";
// import * as stack from "./src/stack";

import * as color from "./src/color";
import * as encoding from "./src/encoding";
import * as expressions from "./src/expressions";
import * as string from "./src/string";
import * as date from "./src/date";

export = x.ext(x, {
  // 声明对象
  declare: declare,
  // 事件
  event: event,
  // 字典
  Dict: Dict,
  // 队列
  queue: queue,
  // 栈
  stack: stack,
  // 颜色
  color: color,
  // 编码
  encoding: encoding,
  // 正则表达式
  expressions: expressions,
  // 字符串
  string: string,
  // 时间
  date: date
});
