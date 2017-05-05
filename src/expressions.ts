// -*- ecoding=utf-8 -*-

import * as x from "./core";
import * as string from "./string";

/**
* @namespace expressions
* @memberof x
* @description 正则表达式管理
*/
let self = {
  /**
  * 规则集合
  * @member {object} rules
  * @memberof x.expressions
  * @example
  * // 返回邮箱地址的正则表达式
  * self.rules['email'];
  */
  rules: {
    // -----------------------------------------------------------------------------
    // 正则表达式全部符号解释
    // -----------------------------------------------------------------------------
    // \            将下一个字符标记为一个特殊字符、或一个原义字符、或一个 向后引用、或一个八进制转义符。
    //              例如，'n' 匹配字符 "n"。'\n' 匹配一个换行符。序列 '\\' 匹配 "\" 而 "\(" 则匹配 "("。
    // ^            匹配输入字符串的开始位置。如果设置了 RegExp 对象的 Multiline 属性，^ 也匹配 '\n' 或 '\r' 之后的位置。
    // $            匹配输入字符串的结束位置。如果设置了RegExp 对象的 Multiline 属性，$ 也匹配 '\n' 或 '\r' 之前的位置。
    // *            匹配前面的子表达式零次或多次。例如，zo* 能匹配 "z" 以及 "zoo"。* 等价于{0,}。
    // +            匹配前面的子表达式一次或多次。例如，'zo+' 能匹配 "zo" 以及 "zoo"，但不能匹配 "z"。+ 等价于 {1,}。
    // ?            匹配前面的子表达式零次或一次。例如，"do(es)?" 可以匹配 "do" 或 "does" 中的"do" 。? 等价于 {0,1}。
    // {n}          n 是一个非负整数。匹配确定的 n 次。例如，'o{2}' 不能匹配 "Bob" 中的 'o'，但是能匹配 "food" 中的两个 o。
    // {n,}         n 是一个非负整数。至少匹配n 次。例如，'o{2,}' 不能匹配 "Bob" 中的 'o'，但能匹配 "foooood" 中的所有 o。
    //              'o{1,}' 等价于 'o+'。'o{0,}' 则等价于 'o*'。
    // {n,m}        m 和 n 均为非负整数，其中n <= m。最少匹配 n 次且最多匹配 m 次。例如，"o{1,3}" 将匹配 "fooooood" 中的前三个 o。
    //              'o{0,1}' 等价于 'o?'。请注意在逗号和两个数之间不能有空格。
    // ?	        当该字符紧跟在任何一个其他限制符 (*, +, ?, {n}, {n,}, {n,m}) 后面时，匹配模式是非贪婪的。非贪婪模式尽可能少的匹配所搜索的字符串，而默认的贪婪模式则尽可能多的匹配所搜索的字符串。例如，对于字符串 "oooo"，'o+?' 将匹配单个 "o"，而 'o+' 将匹配所有 'o'。
    // .	        匹配除 "\n" 之外的任何单个字符。要匹配包括 '\n' 在内的任何字符，请使用象 '[.\n]' 的模式。
    // (pattern)	匹配 pattern 并获取这一匹配。所获取的匹配可以从产生的 Matches 集合得到，在VBScript 中使用 SubMatches 集合，在JScript 中则使用 $0…$9 属性。要匹配圆括号字符，请使用 '\(' 或 '\)'。
    // (?:pattern)	匹配 pattern 但不获取匹配结果，也就是说这是一个非获取匹配，不进行存储供以后使用。这在使用 "或" 字符 (|) 来组合一个模式的各个部分是很有用。例如， 'industr(?:y|ies) 就是一个比 'industry|industries' 更简略的表达式。
    // (?=pattern)	正向预查，在任何匹配 pattern 的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如，'Windows (?=95|98|NT|2000)' 能匹配 "Windows 2000" 中的 "Windows" ，但不能匹配 "Windows 3.1" 中的 "Windows"。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。
    // (?!pattern)	负向预查，在任何不匹配 pattern 的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。例如'Windows (?!95|98|NT|2000)' 能匹配 "Windows 3.1" 中的 "Windows"，但不能匹配 "Windows 2000" 中的 "Windows"。预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始
    // x|y	        匹配 x 或 y。例如，'z|food' 能匹配 "z" 或 "food"。'(z|f)ood' 则匹配 "zood" 或 "food"。
    // [xyz]	    字符集合。匹配所包含的任意一个字符。例如， '[abc]' 可以匹配 "plain" 中的 'a'。
    // [^xyz]	    负值字符集合。匹配未包含的任意字符。例如， '[^abc]' 可以匹配 "plain" 中的'p'。
    // [a-z]	    字符范围。匹配指定范围内的任意字符。例如，'[a-z]' 可以匹配 'a' 到 'z' 范围内的任意小写字母字符。
    // [^a-z]	    负值字符范围。匹配任何不在指定范围内的任意字符。例如，'[^a-z]' 可以匹配任何不在 'a' 到 'z' 范围内的任意字符。
    // \b	        匹配一个单词边界，也就是指单词和空格间的位置。例如， 'er\b' 可以匹配"never" 中的 'er'，但不能匹配 "verb" 中的 'er'。
    // \B	        匹配非单词边界。'er\B' 能匹配 "verb" 中的 'er'，但不能匹配 "never" 中的 'er'。
    // \cx	        匹配由 x 指明的控制字符。例如， \cM 匹配一个 Control-M 或回车符。x 的值必须为 A-Z 或 a-z 之一。否则，将 c 视为一个原义的 'c' 字符。
    // \d	        匹配一个数字字符。等价于 [0-9]。
    // \D	        匹配一个非数字字符。等价于 [^0-9]。
    // \f	        匹配一个换页符。等价于 \x0c 和 \cL。
    // \n	        匹配一个换行符。等价于 \x0a 和 \cJ。
    // \r	        匹配一个回车符。等价于 \x0d 和 \cM。
    // \s	        匹配任何空白字符，包括空格、制表符、换页符等等。等价于 [ \f\n\r\t\v]。
    // \S	        匹配任何非空白字符。等价于 [^ \f\n\r\t\v]。
    // \t	        匹配一个制表符。等价于 \x09 和 \cI。
    // \v	        匹配一个垂直制表符。等价于 \x0b 和 \cK。
    // \w	        匹配包括下划线的任何单词字符。等价于'[A-Za-z0-9_]'。
    // \W	        匹配任何非单词字符。等价于 '[^A-Za-z0-9_]'。
    // \xn	        匹配 n，其中 n 为十六进制转义值。十六进制转义值必须为确定的两个数字长。例如，'\x41' 匹配 "A"。'\x041' 则等价于 '\x04' & "1"。正则表达式中可以使用 ASCII 编码。.
    // \num	        匹配 num，其中 num 是一个正整数。对所获取的匹配的引用。例如，'(.)\1' 匹配两个连续的相同字符。
    // \n	        标识一个八进制转义值或一个向后引用。如果 \n 之前至少 n 个获取的子表达式，则 n 为向后引用。否则，如果 n 为八进制数字 (0-7)，则 n 为一个八进制转义值。
    // \nm	        标识一个八进制转义值或一个向后引用。如果 \nm 之前至少有 nm 个获得子表达式，则 nm 为向后引用。如果 \nm 之前至少有 n 个获取，则 n 为一个后跟文字 m 的向后引用。如果前面的条件都不满足，若 n 和 m 均为八进制数字 (0-7)，则 \nm 将匹配八进制转义值 nm。
    // \nml	        如果 n 为八进制数字 (0-3)，且 m 和 l 均为八进制数字 (0-7)，则匹配八进制转义值 nml。
    // \un	        匹配 n，其中 n 是一个用四个十六进制数字表示的 Unicode 字符。例如， \u00A9 匹配版权符号 (?)。
    // -----------------------------------------------------------------------------
    // 正则表达式的标准写法
    // -----------------------------------------------------------------------------
    // regexp = new RegExp(pattern[, flag]);
    // pattern  : 模板的用法是关键，也是本章的主要内容。
    // flag     : "i"(ignore)、"g"(global)、"m"(multiline)的组合
    //            i-忽略大小写，g-反复检索，m-多行检索     flag中没有g时，返回字符串，有g时返回字符串数组

    // 字符两侧空格
    // \uFEFF 表示 BOM(Byte Order Mark) 即字节序标记 相关链接:http://zh.wikipedia.org/wiki/字节顺序记号
    // \xA0   表示 NBSP = CHAR(160) 即字节序标记 相关链接:http://zh.wikipedia.org/wiki/不换行空格
    'trim': /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    // 日期
    'date': /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/g,
    // 链接地址
    //        var re = '^((https|http|ftp|rtsp|mms)?://)'
    //            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
    //            + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    //            + "|" // 允许IP和DOMAIN（域名）
    //            + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    //            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
    //            + "[a-z]{2,6})" // first level domain- .com or .museum
    //            + "(:[0-9]{1,4})?" // 端口- :80
    //            + "((/?)|" // a slash isn't required if there is no file name
    //            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    'url': "^((https|http|ftp|rtsp|mms)?://)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$",
    // 电话号码
    'telephone': /(^\d+$)|((^\d+)([\d|\-]+)((\d+)$))|((^\+)([\d|\-]+)((\d+)$))/g,
    // 非电话号码
    'non-telephone': /[^\d\-\+]/g,
    // 电子邮箱
    'email': /^\w+((-\w+)|(\_\w+)|(\'\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g,
    // QQ号
    'qq': /^\w+((-\w+)|(\_\w+)|(\'\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g,
    // 数字
    'number': /(^-?\d+$)|(^-?\d+[\.?]\d+$)/g,
    // 非数字
    'non-number': /[^\d\.\-]/g,
    // 整数
    'integer': /^-?\d+$/g,
    // 正整数
    'positive-integer': /^\d+$/g,
    // 非整数
    'non-integer': /[^\d\-]/g,
    // 安全字符
    'safeText': /A-Za-z0-9_\-/g,
    // 非安全字符
    'non-safeText': /[^A-Za-z0-9_\-]/g,
    // 安全文件扩展名
    'fileExt': 'jpg,gif,jpeg,png,bmp,psd,sit,tif,tiff,eps,png,ai,qxd,pdf,cdr,zip,rar',
    // 其他规则
    'en-us': {
      // 美国邮编规则
      'zipcode': /^\d{5}-\d{4}$|^\d{5}$/g
    },
    'zh-cn': {
      'identityCard': /(^\d{15}$)|(^\d{18}$)|(^\d{17}[X|x]$)/g,
      // 中国邮编规则
      'zipcode': /^\d{6}$/g
    }
  },

  /*#region 函数:match(options)*/
  /**
  * 匹配
  * @method match
  * @memberof x.expressions
  * @param {JSON} options 选项信息
  * @example
  * // 输出 匹配的对象
  * console.log(x.expressions.match({text:'abc',regexp:/^\d{6}$/g}));
  */
  match: function (options) {
    // 文本信息
    var text = String(options.text);
    // 忽略大小写
    var ignoreCase = options.ignoreCase;
    // 规则名称
    var regexpName = options.regexpName;
    // 规则
    var regexp = typeof (options.regexp) === 'undefined' ? undefined : new RegExp(options.regexp);

    if (ignoreCase === 1) {
      text = text.toLowerCase();
    }

    // 如果没有填写规则，并且填写了内置规则名称，则使用内置规则。
    if (typeof (regexp) === 'undefined' && typeof (regexpName) !== 'undefined') {
      regexp = self.rules[regexpName];
    }

    return text.match(regexp);
  },
  /*#endregion*/

  /*#region 函数:exists(options)*/
  /**
  * 利用正则表达式验证字符串规则
  * @method exists
  * @memberof x.expressions
  * @param {object} options 选项信息
  * @example
  * // result = false;
  * var result = self.exists({
  *   text:'12345a',
  *   regexpName: 'number',
  *   ignoreCase: ture
  * });
  *
  * @example
  * // result = false;
  * var result = self.exists({
  *   text:'12345a',
  *   regexp: /^\d+$/g,
  *   ignoreCase: ture
  * });
  */
  exists: function (options) {
    var text = String(options.text);
    // 忽略大小写
    var ignoreCase = options.ignoreCase;
    // 规则名称
    var regexpName = options.regexpName;
    // 规则
    var regexp = typeof (options.regexp) === 'undefined' ? undefined : new RegExp(options.regexp);

    if (ignoreCase) {
      text = text.toLowerCase();
    }

    // 如果没有填写规则，并且填写了内置规则名称，则使用内置规则。
    if (typeof (regexp) === 'undefined' && typeof (regexpName) !== 'undefined') {
      regexp = self.rules[regexpName];
    }

    return text.match(regexp) !== null;
  },
  /*#endregion*/

  /*#region 函数:isFileExt(path, allowFileExt)*/
  /**
  * 验证文件的扩展名.
  * @method isFileExt
  * @memberof x.expressions
  * @param {string} path 文件路径
  * @param {string} allowFileExt 允许的扩展名, 多个以半角逗号隔开
  */
  isFileExt: function (path, allowFileExt) {
    var result = false;

    var ext = path.substr(path.lastIndexOf('.'), path.length - path.lastIndexOf('.'));

    var extValue = ((allowFileExt) ? allowFileExt : self.rules['fileExt']);

    ext = ext.replace('.', '');

    if (extValue.indexOf(',') != -1) {
      var list = extValue.split(',');

      for (var i = 0; i < list.length; i++) {
        if (ext.toLowerCase() == list[i]) {
          result = true;
          break;
        }
      }
    }
    else {
      if (ext.toLowerCase() == extValue) {
        result = true;
      }
    }

    return result;
  },
  /*#endregion*/

  /*#region 函数:isUrl(text)*/
  /**
  * 验证URL地址格式
  * @method isUrl
  * @memberof x.expressions
  * @param {string} text 文本信息
  */
  isUrl: function (text) {
    return text.toLowerCase().exists(self.rules['url']);
  },
  /*#endregion*/

  /*#region 函数:isEmail(text)*/
  /*
  * 验证Email地址格式
  * @method isEmail
  * @memberof x.expressions
  * @param {string} text 文本信息
  */
  isEmail: function (text) {
    return text.toLowerCase().exists(self.rules['email']);
  },
  /*#endregion*/

  /*#region 函数:isZipcode(text, nature))*/
  /*
  * 验证邮编
  * @method isZipcode
  * @memberof x.expressions
  * @param {string} text 文本信息
  * @param {string} nature 区域信息
  */
  isZipcode: function (text, nature) {
    nature = x.formatLocale(nature);

    return text.exists(self.rules[nature]['zipcode']);
  },
  /*#endregion*/

  /*#region 函数:isSafeText(text)*/
  /**
  * 验证输入的字符串是否为安全字符, 即只允许字母、数字、下滑线。
  * @method isSafeText
  * @memberof x.expressions
  * @param {string} text 文本信息
  */
  isSafeText: function (text) {
    return text.exists(self.rules['safeText']);
  },
  /*#endregion*/

  /*#region 函数:formatTelephone(text)*/
  /**
  * 格式化输入的输入的文本为电话号码.
  * @method formatTelephone
  * @memberof x.expressions
  * @param {string} text 文本信息
  */
  formatTelephone: function (text) {
    return text.replace(self.rules['non-telephone'], '');
  },
  /*#endregion*/

  /*#region 函数:formatInteger(value, removePaddingZero)*/
  /**
  * 格式化输入的输入的文本为整数.
  * @method formatInteger
  * @memberof x.expressions
  * @param {string} value 文本信息
  * @param {bool} [removePaddingZero] 移除两侧多余的零
  * @example
  * var value = '12345a';
  * // return value = '12345'
  * value = self.formatInteger(value);
  * @example
  * var value = '012345';
  * // return value = '12345'
  * value = self.formatInteger(value, true);
  */
  formatInteger: function (value: string, removePaddingZero) {
    // number : ^\d
    value = String(value).replace(self.rules['non-integer'], '');

    if (string.trim(value) === '') {
      value = '0';
    }

    // 去除两侧多余的零
    if (removePaddingZero) {
      value = String(parseInt(value, 10));
    }

    return value;
  },
  /*#endregion*/

  /*#region 函数:formatNumber(value, removePaddingZero)*/
  /**
  * 格式化输入的输入的文本为数字.
  * @method formatInteger
  * @memberof x.expressions
  * @param {string} value 文本信息
  * @param {bool} [removePaddingZero] 移除两侧多余的零
  * @example
  * var value = '12345.00a';
  * // return value = '12345'
  * value = self.formatInteger(value);
  * @example
  * var value = '012345.00';
  * // return value = '12345'
  * value = self.formatInteger(value, true);
  */
  formatNumber: function (value, removePaddingZero: boolean = true) {
    value = String(value).replace(self.rules['non-number'], '');

    // 检测空字符串
    value = (value.trim() === '') ? '0' : value;

    // 去除两侧多余的零
    if (removePaddingZero) {
      value = String(parseFloat(value));
    }

    return value;
  },
  /*#endregion*/

  /*#region 函数:formatNumberRound2(value, removePaddingZero)*/
  /**
  * 格式化输入的文本统一为保留小数点后面两位的数字。
  * 小数点右侧两位之后的数字采用四舍五入的规则取舍。
  * @method formatNumberRound2
  * @memberof x.expressions
  * @param {string} value 文本信息
  * @param {bool} [removePaddingZero] 移除两侧多余的零
  * @example
  * var value = '12345';
  * // return value = '12345.00'
  * value = self.formatNumberRound2(value);
  */
  formatNumberRound2: function (value, removePaddingZero: boolean = true) {

    var text = '' + Math.round(Number(self.formatNumber(value)) * 100) / 100;

    var index = text.indexOf('.');

    if (index < 0) {
      return text + '.00';
    }

    var text = text.substring(0, index + 1) + text.substring(index + 1, index + 3);

    if (index + 2 == text.length) {
      text += '0';
    }

    // 去除两侧多余的零
    if (removePaddingZero) {
      value = parseFloat(text);
    }

    return value;
  },
  /*#endregion*/

  /*#region 函数:formatNumberRound2(value, removePaddingZero)*/
  /**
  * 格式化输入的文本统一为保留小数点后面两位的数字。
  * 小数点右侧N位之后的数字采用四舍五入的规则取舍。
  * @method formatNumberRound2
  * @memberof x.expressions
  * @param {string} value 文本信息
  * @param {number} [length] 小数点右侧保留的位数
  * @param {bool} [removePaddingZero] 移除两侧多余的零
  * @example
  * var value = '12345';
  * // return value = '12345.00'
  * value = self.formatNumberRound(value);
  */
  formatNumberRound: function (value: string | number, length: number = 2, removePaddingZero: boolean = true) {
    // 设置倍数
    let multiple = 10;
    let count = 0;

    while (count < length) {
      multiple *= 10;
      count++;
    }

    var text = '' + Math.round(Number(self.formatNumber(value)) * multiple) / multiple;

    var index = text.indexOf('.');

    if (index < 0) {
      return text + '.00';
    }

    var text = text.substring(0, index + 1) + text.substring(index + 1, index + length + 1);

    while ((index + length) > text.length) {
      text += '0';
    }

    // 去除两侧多余的零
    if (removePaddingZero) {
      text = parseFloat(text).toString();
    }

    return text;
  },
  /*#endregion*/

  /*#region 函数:formatSafeText(text)*/
  /**
  * 格式化输入的文本为安全字符(常用于登录名和拼音字母的检测)
  * @method formatSafeText
  * @memberof x.expressions
  * @param {string} text 文本信息
  * @example
  * var text = 'abcd-$1234';
  * // return value = 'abcd1234'
  * text = self.formatSafeText(text);
  */
  formatSafeText: function (text) {
    return text.replace(self.rules['non-safeText'], '');
  }
  /*#endregion*/
};

export = self;
