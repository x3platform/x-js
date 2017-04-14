"use strict";
var x = require("./core");
var self = {
    now: function () {
        return self.create();
    },
    create: function (timeValue) {
        return self.newTime(timeValue);
    },
    shortIntervals: {
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
    formatInterval: function (interval) {
        return self.shortIntervals[interval] || interval;
    },
    diff: function (begin, end, interval) {
        var timeBegin = self.newTime(begin);
        var timeEnd = self.newTime(end);
        return timeBegin.diff(self.formatInterval(interval), timeEnd);
    },
    add: function (timeValue, interval, number) {
        var time = self.newTime(timeValue);
        return time.add(self.formatInterval(interval), number);
    },
    format: function (timeValue, formatValue) {
        var time = self.create(timeValue);
        return time.toString(formatValue);
    },
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
            return time.toString("yyyy-MM-dd HH:mm:ss");
        }
    },
    newTime: function (timeValue) {
        var date = new Date();
        if (!x.isUndefined(timeValue)) {
            if (x.type(timeValue) === 'date') {
                date = timeValue;
            }
            else if (x.isNumber(timeValue)) {
                date = new Date(timeValue);
            }
            else if (x.isArray(timeValue)) {
                var keys = timeValue;
                for (var i = 0; i < 6; i++) {
                    keys[i] = isNaN(keys[i]) ? (i < 3 ? 1 : 0) : Number(keys[i]);
                }
                date = new Date(keys[0], Number(keys[1]) - 1, keys[2], keys[3], keys[4], keys[5]);
            }
            else if (/\/Date\((-?\d+)\)\//.test(timeValue)) {
                date = new Date(Math.floor(timeValue.replace(/\/Date\((-?\d+)\)\//, '$1')));
            }
            else {
                var keys = timeValue.replace(/[-|:|\/| |年|月|日]/g, ',').split(',');
                for (var i = 0; i < 6; i++) {
                    keys[i] = isNaN(keys[i]) ? (i < 3 ? 1 : 0) : Number(keys[i]);
                }
                date = new Date(keys[0], Number(keys[1]) - 1, keys[2], keys[3], keys[4], keys[5]);
            }
        }
        var time = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            msecond: date.getMilliseconds(),
            weekDay: date.getDay(),
            diff: function (interval, time) {
                var timeBegin = Number(this.toDate());
                var timeEnd = Number(time.toDate());
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
            add: function (interval, number) {
                var date = Number(this.toDate());
                var ms = 0;
                var monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                interval = self.formatInterval(interval);
                switch (interval) {
                    case 'year':
                        if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
                            && !((this.year + number) % 4 == 0 && (((this.year + number) % 100 != 0) || ((this.year + number) % 400 == 0)))) {
                            ms = Number(new Date(this.year + number, this.month, 28, this.hour, this.minute, this.second));
                        }
                        else {
                            ms = Number(new Date(this.year + number, this.month, this.day, this.hour, this.minute, this.second));
                        }
                        break;
                    case 'quarter':
                        if ((this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0))) && this.month == 1 && this.day == 29
                            && !((this.year + Math.floor((this.month + number * 3) / 12)) % 4 == 0 && (((this.year + Math.floor((this.month + number * 3) / 12)) % 100 != 0) || ((this.year + Math.floor((this.month + number * 3) / 12)) % 400 == 0)))) {
                            ms = Number(new Date(this.year, (this.month + number * 3), 28, this.hour, this.minute, this.second));
                        }
                        else {
                            if (this.day == monthMaxDays[this.month]) {
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
                            ms = Number(new Date(this.year, (this.month + number), 28, this.hour, this.minute, this.second));
                        }
                        else {
                            if (this.day == monthMaxDays[this.month]) {
                                ms = Number(new Date(this.year, (this.month + number), monthMaxDays[(this.month + number) % 12], this.hour, this.minute, this.second));
                            }
                            else {
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
            getDatePart: function (interval) {
                var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
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
            getMaxDayOfMonth: function () {
                var date1 = self.create(this.toString('yyyy-MM-01'));
                var date2 = self.create(this.add('month', 1).toString('yyyy-MM-01'));
                return date1.diff('day', date2);
            },
            getQuarterOfYear: function () {
                return Math.ceil(this.month / 3);
            },
            getWeekOfYear: function () {
                var week = 0;
                var day = this.getDayOfYear();
                if (self.create(this.toString('yyyy-01-01')).weekDay > 0) {
                    day = day - (7 - self.create(this.toString('yyyy-01-01')).weekDay);
                }
                if (day > 0) {
                    week = Math.ceil(day / 7);
                }
                return week;
            },
            getDayOfYear: function () {
                var date1 = this.toDate();
                var date2 = new Date(date1.getFullYear(), 0, 1);
                return Math.ceil(Number(Number(date1) - Number(date2)) / (24 * 60 * 60 * 1000)) + 1;
            },
            isLeapYear: function () {
                return (this.year % 4 == 0 && ((this.year % 100 != 0) || (this.year % 400 == 0)));
            },
            toArray: function () {
                return [this.year, this.month, this.day, this.hour, this.minute, this.second, this.msecond];
            },
            toDate: function () {
                return new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
            },
            toString: function (format) {
                if (format === void 0) { format = 'yyyy-MM-dd HH:mm:ss'; }
                var weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                return format.replace(/yyyy|YYYY/g, this.year)
                    .replace(/yy|YY/g, x.paddingZero((this.year2 % 100), 2))
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
    newTimeSpan: function (timeSpanValue, format) {
        format = typeof (format) === 'undefined' ? 'second' : format;
        if (format == 'day' || format == 'd') {
            timeSpanValue = timeSpanValue * 24 * 60 * 60;
        }
        if (format == 'hour' || format == 'h') {
            timeSpanValue = timeSpanValue * 60 * 60;
        }
        if (format == 'minute' || format == 'm') {
            timeSpanValue = timeSpanValue * 60;
        }
        if (format == 'second' || format == 's') {
            timeSpanValue = timeSpanValue * 1000;
        }
        var timeSpan = {
            timeSpanValue: timeSpanValue,
            day: timeSpanValue / (24 * 60 * 60 * 1000),
            hour: timeSpanValue / (60 * 60 * 1000),
            minute: timeSpanValue / (60 * 1000),
            second: timeSpanValue / 1000,
            millisecond: timeSpanValue % 1000,
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
        return timeSpan;
    }
};
module.exports = self;
