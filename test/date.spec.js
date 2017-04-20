var assert = require('assert');

var x = require('../index.js');

describe('date', function () {
  describe('#x.date.now()', function () {
    it('should return time -> yyyy-MM-dd HH:mm:ss', function () {
      var time = x.date.now().toString();
      assert.equal(time.length, 19);
    });
  });

  describe('#x.date.create(any)', function () {
    it('should return now when x.date.create()', function () {
      var date = x.date.create();
      var current = new Date();

      assert.equal(date.year, current.getFullYear());
      assert.equal(date.month, current.getMonth());
      assert.equal(date.day, current.getDate());
    });
    it('should return date when x.date.create(value:Number|Array|String)', function () {
      var times = [
        // 自动化测试时 标准时区与北京时区会有8个小时时间差
        // 本地化差异 会有位移。
        // 时间戳
        865123200000,
        '/Date(865123200000)/',
        // 字符串
        '1997-06-01',
        '1997-06-01 08:00:00',
        '1997年6月1日 08:00:00',
        // 数组
        [1997, 6, 1],
        [1997, 6, 1, 8, 0, 0],
      ];

      for (var i = 0; i < times.length; i++) {
        var date = x.date.create(times[i]);
        console.log('\t[' + i + ']' + date.toString());
        // 年
        assert.equal(date.year, 1997);
        // 月 JavaScript 的 month 从 0 开始计算
        assert.equal(date.month, 5);
        // 日
        assert.equal(date.day, 1);
        if (i == 3 || i == 4 || i == 6) {
          // assert.equal(date.toString(), '1997-06-01 08:00:00');
        }
      }
    });
  });

  describe('#x.date.diff(begin, end, interval)', function () {
    it('should return 30 when begin=1997-06-01, begin=1997-07-01, interval=day', function () {
      // 年
      assert.equal(x.date.diff('1997-06-01 01:01:00', '1998-07-01 01:01:00', 'year'), '1');
      // 季度
      assert.equal(x.date.diff('1997-06-01 01:01:00', '1997-12-01 01:01:00', 'quarter'), '2');
      // 月
      assert.equal(x.date.diff('1997-06-01 01:01:00', '1997-09-01 01:01:00', 'month'), '3');
      // 日
      assert.equal(x.date.diff('1997-06-01 01:01:00', '1997-07-01 01:01:00', 'day'), '30');
    });
  });

  describe('#x.date.add(timeValue, interval, number)', function () {
    it('should return 30 when begin=1997-06-01, interval=day, number=30', function () {
      assert.equal(x.date.add('1997-06-01 01:01:00', 'year', '1').toString(), '1998-06-01 01:01:00');
      assert.equal(x.date.add('1997-06-01 01:01:00', 'quarter', '1').toString(), '1997-09-01 01:01:00');
      assert.equal(x.date.add('1997-06-01 01:01:00', 'month', '5').toString(), '1997-11-01 01:01:00');
      assert.equal(x.date.add('1997-06-01 01:01:00', 'week', '4').toString(), '1997-06-29 01:01:00');
      assert.equal(x.date.add('1997-06-01 01:01:00', 'day', '30').toString(), '1997-07-01 01:01:00');
      assert.equal(x.date.add('1997-06-01 01:01:00', 'hour', '4').toString(), '1997-06-01 05:01:00');
      assert.equal(x.date.add('1997-06-01 01:01:00', 'minute', '35').toString(), '1997-06-01 01:36:00');
      assert.equal(x.date.add('1997-06-01 01:01:00', 'second', '10').toString(), '1997-06-01 01:01:10');
    });
  });

  describe('#x.date.format(timeValue, \'yyyy-MM-dd\')', function () {
    it('should return 30 when begin=1997-06-01, interval=day, number=30', function () {
      assert.equal(x.date.format('1997-06-01 01:01:00', 'yyyy-MM-dd'), '1997-06-01');
    });
  });

  describe('#x.date.toNativeDate(time)', function () {
    it('should return JavaScript Date Object', function () {
      var time = x.date.create('1997-06-01 01:01:00');
      var date = time.toNativeDate();

      assert.equal(x.type(date), 'date');
      assert.equal(date.getFullYear(), '1997');
    });
  });

  describe('DateTime', function () {
    describe('#datetime.getDatePart(interval)', function () {
      it('should return number', function () {
        var date = x.date.create('1997-06-01 01:01:00');
        assert.equal(date.getDatePart('year'), 1997);
        assert.equal(date.getDatePart('quarter'), 2);
        assert.equal(date.getDatePart('month'), 5);
        assert.equal(date.getDatePart('day'), 1);
        assert.equal(date.getDatePart('week'), '星期日');
        assert.equal(date.getDatePart('weekOfYear'), 22);
      });
    });
    describe('#datetime.getMaxDayOfMonth()', function () {
      it('should return number', function () {
        assert.equal(x.date.create('1997-01-01').getMaxDayOfMonth(), 31);
        assert.equal(x.date.create('1997-02-01').getMaxDayOfMonth(), 28);
        // 闰年处理
        assert.equal(x.date.create('2000-02-01').getMaxDayOfMonth(), 29);
      });
    });
    describe('#datetime.isLeapYear()', function () {
      it('should return number', function () {
        // 闰年
        assert.equal(x.date.create('2000-02-01').isLeapYear(), true);
        assert.equal(x.date.create('2012-06-01').isLeapYear(), true);
        // 非闰年
        assert.equal(x.date.create('2010-01-01').isLeapYear(), false);
        assert.equal(x.date.create('1998-01-01').isLeapYear(), false);
      });
    });
  });
});
