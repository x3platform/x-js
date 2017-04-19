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
    it('should return date(format:yyyy-MM-dd HH:mm:ss)', function () {
      var date = x.date.create().toString();
      assert.equal(date.length, 19);

      date = x.date.create('1997-06-01 01:01:00');

      assert.equal(date.year, 1997);
      // JavaScript 的 month 从 0 开始计算
      assert.equal(date.month, 5);
      assert.equal(date.day, 1);
      assert.equal(date.toString(), '1997-06-01 01:01:00');
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
});
