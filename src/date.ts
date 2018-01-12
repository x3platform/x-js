// -*- ecoding=utf-8 -*-

import * as x from "./base";

var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

/**
 * @namespace date
 * @memberof x
 * @description 日期时间
 */
let self = {
  /**
   * 当前时间对象
   * @method now
   * @memberof x.date
   */
  now: function () {
    return self.create();
  },
  /**
  * 创建时间对象
  * @method create
  * @memberof x.date
  * @param {Object} timeValue 符合时间规则的日期, 数组, 字符串
  */
  create: function (timeValue?) {
    return self.newDateTime(timeValue);
  },

  /**
  * 时间间隔简写表
  * @method shortIntervals
  * @memberof x.date
  * @private
  */
  shortIntervals:
  {
    'y': 'year',
    'q': 'quarter',
    'M': 'month',
    'w': 'week',
    'd': 'day',
    'h': 'hour',
    'm': 'minute',
    's': 'second',
    'ms': 'msecond'
  },

  /**
  * 格式化时间间隔参数
  * @method formatInterval
  * @memberof x.date
  * @private
  */
  formatInterval: function (interval) {
    return self.shortIntervals[interval] || interval;
  },

  /**
  * 比较两个时间差异
  * @method diff
  * @memberof x.date
  */
  diff: function (begin, end, interval) {
    var timeBegin = self.newDateTime(begin);
    var timeEnd = self.newDateTime(end);

    return timeBegin.diff(self.formatInterval(interval), timeEnd);
  },

  /**
  * 比较两个时间差异
  * @method add
  * @memberof x.date
  */
  add: function (timeValue, interval, number: number) {
    var time = self.newDateTime(timeValue);

    return time.add(self.formatInterval(interval), number);
  },

  /**
  * 时间格式化
  * @method format
  * @memberof x.date
  * @param {Object} timeValue 符合时间规则的日期, 数组, 字符串
  * @param {String} formatValue 时间格式
  * @example
  * self.format('2000-01-01 00:00:00', 'yyyy/MM/dd hh:mm:ss');
  */
  format: function (timeValue, formatValue) {
    var time = self.create(timeValue);

    return time.toString(formatValue);
  },

  /**
  * 显示某个时间之前的格式
  * @method format
  * @memberof x.date
  * @param {Object} timeValue 符合时间规则的日期, 数组, 字符串
  * @param {Object} suffix 后缀配置
  * @example
  * self.ago('2000-01-01 00:00:00');
  * @example
  * self.ago('2000-01-01 00:00:00',{y});
  */
  ago: function (timeValue, suffix) {
    suffix = x.ext({
      minute: '分钟前',
      hour: '小时前',
      day: '天前'
    }, suffix);

    var time = self.create(timeValue);
    var now = self.create();

    if (time.diff('m', now) < 1) {
      return '1' + suffix.minute;
    }
    else if (time.diff('m', now) < 60) {
      return time.diff('m', now) + suffix.minute;
    }
    else if (time.diff('h', now) < 24) {
      return time.diff('h', now) + suffix.hour;
    }
    else if (time.diff('d', now) < 4) {
      return time.diff('d', now) + suffix.day;
    }
    else {
      return time.toString();
    }
  },

  /**
  * 时间对象
  * @class Time 时间对象
  * @constructor DateTime
  * @memberof x.date
  * @param {Date} timeValue 符合时间规则的Date对象, 数组对象, 字符串对象
  */
  newDateTime: function (timeValue) {
    let date = new Date();

    if (!x.isUndefined(timeValue)) {
      if (x.type(timeValue) === 'date') {
        // Date 对象
        date = timeValue;
      }
      else if (x.isNumber(timeValue)) {
        date = new Date(timeValue);
      }
      else if (x.isArray(timeValue)) {
        // Array 对象
        var keys = timeValue

        for (var i = 0; i < 6; i++) {
          keys[i] = isNaN(keys[i]) ? (i < 3 ? 1 : 0) : Number(keys[i]);
        }

        date = new Date(keys[0], Number(keys[1]) - 1, keys[2], keys[3], keys[4], keys[5]);
      }
      else if (/\/Date\((-?\d+)\)\//.test(timeValue)) {
        // .NET 日期对象
        date = new Date(Math.floor(timeValue.replace(/\/Date\((-?\d+)\)\//, '$1')));
      }
      else if (/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/.test(timeValue)) {
        // ISO 8601 日期格式
        date = new Date(timeValue);
      }
      else {
        // 处理规则 年 月 日 时 分 秒 顺序规则时间
        var keys = timeValue.replace(/[-|:|\/| |年|月|日]/g, ',').replace(/,,/g, ',').split(',');

        for (var i = 0; i < 6; i++) {
          // 处理默认值
          keys[i] = isNaN(keys[i]) ? (i < 3 ? 1 : 0) : Number(keys[i]);
        }

        date = new Date(keys[0], Number(keys[1]) - 1, keys[2], keys[3], keys[4], keys[5]);
      }
    }

    let time = {
      year: date.getFullYear(),
      // year2: date.getYear(),
      month: date.getMonth(),
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      msecond: date.getMilliseconds(),
      weekDay: date.getDay(),

      /**
      * 比较与另一个时间对象的时间差
      * @method diff
      * @memberof x.date.DateTime#
      * @param {String} interval 时间间隔
      * @param {Time} time 时间对象
      */
      diff: function (interval, time) {
        var timeBegin = Number(this.toNativeDate());
        var timeEnd = Number(time.toNativeDate());

        interval = self.formatInterval(interval);

        switch (interval) {
          case 'year': return time.year - this.year;
          case 'quarter': return Math.ceil((((time.year - this.year) * 12) + (time.month - this.month)) / 3);
          case 'month': return ((time.year - this.year) * 12) + (time.month - this.month);
          case 'week': return Math.floor((timeEnd - timeBegin) / (86400000 * 7));
          case 'day': return Math.floor((timeEnd - timeBegin) / 86400000);
          case 'hour': return Math.floor((timeEnd - timeBegin) / 3600000);
          case 'minute': return Math.floor((timeEnd - timeBegin) / 60000);
          case 'second': return Math.floor((timeEnd - timeBegin) / 1000);
          case 'msecond': return Math.floor((timeEnd - timeBegin));
        }
      },

      /**
      * 时间对象的属性相加
      * @method add
      * @memberof x.date.DateTime#
      * @param {String} interval 时间间隔
      * @param {Number} number 数字
      */
      add: function (interval: string, number: number) {
        var date = Number(this.toNativeDate());

        // 此毫秒表示的是需要创建的时间 和 GMT时间1970年1月1日 之间相差的毫秒数。
        var ms = 0;

        var monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        interval = self.formatInterval(interval);

        // 格式化数字类型
        number = Number(number);

        switch (interval) {
          case 'year':
            if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
              && !((this.year + number) % 4 == 0 && (((this.year + number) % 100 != 0) || ((this.year + number) % 400 == 0)))) {
              // 闰年的二月二十九日并且目标年不为闰年
              ms = Number(new Date(this.year + number, this.month, 28, this.hour, this.minute, this.second));
            }
            else {
              ms = Number(new Date(this.year + number, this.month, this.day, this.hour, this.minute, this.second));
            }
            break;
          case 'quarter':
            if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
              && !((this.year + Math.floor((this.month + number * 3) / 12)) % 4 == 0 && (((this.year + Math.floor((this.month + number * 3) / 12)) % 100 != 0) || ((this.year + Math.floor((this.month + number * 3) / 12)) % 400 == 0)))) {
              // 闰年的二月二十九日并且目标年不为闰年
              ms = Number(new Date(this.year, (this.month + number * 3), 28, this.hour, this.minute, this.second));
            }
            else {
              if (this.day == monthMaxDays[this.month]) {
                // 月份最后一天的处理
                ms = Number(new Date(this.year, (this.month + number * 3), monthMaxDays[(this.month + number * 3) % 12], this.hour, this.minute, this.second));
              }
              else {
                ms = Number(new Date(this.year, (this.month + number * 3), this.day, this.hour, this.minute, this.second));
              }
            }
            break;
          case 'month':

            if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
              && !((this.year + Math.floor((this.month + number) / 12)) % 4 == 0 && (((this.year + Math.floor((this.month + number) / 12)) % 100 != 0) || ((this.year + Math.floor((this.month + number) / 12)) % 400 == 0)))) {
              // 闰年的二月二十九日并且目标年不为闰年
              ms = Number(new Date(this.year, (this.month + number), 28, this.hour, this.minute, this.second));
            }
            else {
              if (this.day == monthMaxDays[this.month]) {
                // 月份最后一天的处理
                ms = Number(new Date(this.year, (this.month + number), monthMaxDays[(this.month + number) % 12], this.hour, this.minute, this.second));
              }
              else {
                //ms = Number(this.toNativeDate().setMonth(this.month + number));
                ms = Number(new Date(this.year, (this.month + number), this.day, this.hour, this.minute, this.second));
              }
            }
            break;
          case 'week':
            ms = date + ((86400000 * 7) * number);
            break;
          case 'day':
            ms = date + (86400000 * number);
            break;
          case 'hour':
            ms = date + (3600000 * number);
            break;
          case 'minute':
            ms = date + (60000 * number);
            break;
          case 'second':
            ms = date + (1000 * number);
            break;
          case 'msecond':
            ms = date + number;
            break;
        }

        return self.create(new Date(ms));
      },

      /*
      * 取得日期数据信息
      * 参数 interval 表示数据类型
      * y 年 M月 d日 w星期 ww周 h时 n分 s秒
      */
      getDatePart: function (interval) {
        // var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        interval = self.formatInterval(interval);

        switch (interval) {
          case 'year':
            return this.year;
          case 'quarter':
            return this.getQuarterOfYear();
          case 'month':
            return this.month;
          case 'day':
            return this.day;
          case 'week':
            return weekDays[this.weekDay];
          case 'W':
          case 'weekOfYear':
            return this.getWeekOfYear();
          case 'hour':
            return this.hour;
          case 'minute':
            return this.minute;
          case 'second':
            return this.second;
          default:
            return 'Unkown Interval';
        }
      },

      /**
      * 取得当前日期所在月的最大天数
      * @method getMaxDayOfMonth
      * @memberof x.date.DateTime#
      */
      getMaxDayOfMonth: function () {
        var date1 = self.create(this.toString('yyyy-MM-01'));
        var date2 = self.create(this.add('month', 1).toString('yyyy-MM-01'));

        return date1.diff('day', date2);
      },

      /**
      * 取得当前日期所在季度是一年中的第几季度
      * @method getQuarterOfYear
      * @memberof x.date.DateTime#
      */
      getQuarterOfYear: function () {
        return Math.ceil(this.month / 3);
      },

      /*
      * 取得当前日期是一年中的第几周
      */
      getWeekOfYear: function () {
        var week = 0;

        var day = this.getDayOfYear();

        // 判断是否为星期日
        // 如果一年中的第一天不是星期日, 则减去相差的天数以最近的星期日开始计算
        if (self.create(this.toString('yyyy-01-01')).weekDay > 0) {
          day = day - (7 - self.create(this.toString('yyyy-01-01')).weekDay);
        }

        if (day > 0) {
          week = Math.ceil(day / 7);
        }

        return week;
      },

      /*
      * 取得当前日期是一年中的第几天
      */
      getDayOfYear: function () {
        var date1 = this.toNativeDate();
        var date2 = new Date(date1.getFullYear(), 0, 1);

        return Math.ceil(Number(Number(date1) - Number(date2)) / (24 * 60 * 60 * 1000)) + 1;
      },

      /**
       * 判断闰年
       */
      isLeapYear: function () {
        // 闰年的计算方法：
        // 公元纪年的年数可以被四整除，即为闰年；
        // 被100整除而不能被400整除为平年；
        // 被100整除也可被400整除的为闰年。
        // 如2000年是闰年，而1900年不是。
        return (this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0)));
      },

      /**
       * 转换为数组格式
       * @method toArray
       * @memberof x.date.DateTime#
       * @returns {Array}
       */
      toArray: function () {
        return [this.year, this.month, this.day, this.hour, this.minute, this.second, this.msecond];
      },

      /**
      * 转换为内置 Date 对象
      * @method toNativeDate
      * @memberof x.date.DateTime#
      * @returns {Date}
      */
      toNativeDate: function () {
        return new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
      },

      /**
       * 日期格式化
       * 格式
       * yyyy/yy 表示年份
       * MM 月份
       * w 星期
       * dd/d 日期
       * hh/h 时间
       * mm/m 分钟
       * ss/s 秒
       * @method toString
       * @memberof x.date.DateTime#
       * @param {String} format 时间格式
       * @returns {String}
       */
      toString: function (format = 'yyyy-MM-dd HH:mm:ss') {

        return format.replace(/yyyy|YYYY/g, this.year)
          .replace(/yy|YY/g, x.paddingZero((this.year2 % 100), 2))
          .replace(/Y/g, this.year)

          .replace(/MM/g, x.paddingZero((this.month + 1), 2))
          .replace(/M/g, (this.month + 1))

          .replace(/w|W/g, weekDays[this.weekDay])

          .replace(/dd|DD/g, x.paddingZero(this.day, 2))
          .replace(/d|D/g, this.day)

          .replace(/hh|HH/g, x.paddingZero(this.hour, 2))
          .replace(/h|H/g, this.hour)

          .replace(/mm/g, x.paddingZero(this.minute, 2))
          .replace(/m/g, this.minute)

          .replace(/ss|SS/g, x.paddingZero(this.second, 2))
          .replace(/s|S/g, this.second)

          .replace(/fff/g, x.paddingZero(this.msecond, 3));
      }
    };

    return time;
  },

  /**
  * 时间间隔对象
  * @class TimeSpan
  * @constructor TimeSpan
  * @memberof x.date
  * @param {Number} timespanValue 符合时间规则的值(允许Date对象|数组对象|字符串对象)
  */
  timespan: function (timespanValue, format: string = 'second') {
    // 小时转化成秒
    if (format == 'day' || format == 'd') {
      timespanValue = timespanValue * 24 * 60 * 60;
    }

    // 小时转化成秒
    if (format == 'hour' || format == 'h') {
      timespanValue = timespanValue * 60 * 60;
    }

    // 分钟转化成秒
    if (format == 'minute' || format == 'm') {
      timespanValue = timespanValue * 60;
    }

    // 秒不需要转化
    if (format == 'second' || format == 's') {
      timespanValue = timespanValue * 1000;
    }

    var timespan = {
      // 时间间隔(单位:毫秒)
      timespanValue: timespanValue,
      // 天
      day: timespanValue / (24 * 60 * 60 * 1000),
      // 小时
      hour: timespanValue / (60 * 60 * 1000),
      // 分钟
      minute: timespanValue / (60 * 1000),
      // 秒
      second: timespanValue / 1000,
      // 毫秒
      millisecond: timespanValue % 1000,

      toString: function (format) {
        var outString = '';

        switch (format) {
          case 'MM天dd小时mm分钟ss秒fff毫秒':
            outString = x.paddingZero(this.day, 2) + "天" + x.paddingZero(this.hour, 2) + "小时" + x.paddingZero(this.minute, 2) + "分钟" + x.paddingZero(this.second, 2) + "秒" + x.paddingZero(this.millisecond, 3) + "毫秒";
            break;
          case 'MM天dd小时mm分钟ss秒':
            outString = x.paddingZero(this.day, 2) + "天" + x.paddingZero(this.hour, 2) + "小时" + x.paddingZero(this.minute, 2) + "分钟" + x.paddingZero(this.second, 2) + "秒";
            break;
          default:
            outString = x.paddingZero(this.day, 2) + "天" + x.paddingZero(this.hour, 2) + "小时" + x.paddingZero(this.minute, 2) + "分钟" + x.paddingZero(this.second, 2) + "秒";
            break;
        }

        return outString;
      }
    };

    return timespan;
  }
};

export = self;
