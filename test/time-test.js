var assert = require('assert');

var x = require('../index.js');

describe('date', function () {
  describe('#x.time.now()', function () {
    it('should return time -> yyyy-MM-dd HH:mm:ss', function () {
      var time = x.time.now().toString();
      assert.equal(time.length, 19);
    });
  });

  describe('#x.time.create(any)', function () {
    it('should return time -> yyyy-MM-dd HH:mm:ss', function () {
      var time = x.time.create().toString();
      assert.equal(time.length, 19);
    });
  });

  describe('#x.time.toDate(time)', function () {
    it('should return Date', function () {
      var time = x.time.create('2010-01-01 01:01:00');
      var date = time.toDate();

      assert.equal(x.type(date), 'date');
      assert.equal(date.getFullYear(), '2010');
    });
  });
});
