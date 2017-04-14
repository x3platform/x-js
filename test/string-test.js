var assert = require('assert');

var x = require('../index.js');

describe('string', function () {
  describe('#x.string.stringify()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(x.isNumber(1), true);
      assert.equal(x.isNumber('a'), false);
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });

  describe('#x.string.trim()', function () {
    it('should return -1 when the value is not present', function () {
      var text = x.string.trim(' x ');
      assert.equal(text, 'x');
    });
  });

  describe('#x.string.format()', function () {
    it('should return hello x when the value is x.string.format(\'hello {0}.\', \'x\')', function () {
      var text = x.string.format('hello {0}.', 'x');
      assert.equal(text, 'hello x.');
      // 空值处理
      var text = x.string.format();
      assert.equal(text, null);
    });
  });
});
