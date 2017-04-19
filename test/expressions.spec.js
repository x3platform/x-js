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
});