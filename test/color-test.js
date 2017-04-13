var assert = require('assert');

var x = require('../index.js');

describe('color', function () {
  describe('#x.color.now()', function () {
    it('#FFFFFF return current time', function () {
      var time= x.date.now().toString();
      assert.equal(time.length, 8);
    });
  });
});