import * as x from "./src/core";
import * as color from "./src/color";
import * as encoding from "./src/encoding";
// import * as expressions from "./src/expressions";
import * as string from "./src/string";
import * as date from "./src/date";

export = x.ext(x, {
    // 颜色
    color: color,
    // 编码
    encoding: encoding,
    // 正则表达式
    // expressions: expressions,
    // 字符串
    string: string,
    // 时间
    date: date
});
