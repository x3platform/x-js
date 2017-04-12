import * as x from "./src/core";
import * as color from "./src/color";
import * as date from "./src/date";
import * as encoding from "./src/encoding";
import * as string from "./src/string";

export = x.ext(x, {
    date: date,
    // 颜色
    color:color,
    // 编码
    encoding: encoding,
    // 字符串
    string: string
});
