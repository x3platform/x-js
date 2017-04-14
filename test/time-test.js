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

  describe('#x.time.toDate(any)', function () {
    it('should return time -> yyyy-MM-dd HH:mm:ss', function () {
      var time = x.time.create().toString();
      assert.equal(time.length, 19);
    });
  });
});
