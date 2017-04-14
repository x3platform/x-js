var assert = require('assert');

var x = require('../index.js');

describe('color', function () {
  describe('#x.color.rgb(\'#FFFFFF\')', function () {
    it('#FFFFFF return current time', function () {
      var value = x.color.rgb('#FFFFFF');
      assert.equal(value, 'rgb(255, 255, 255)');
    });
  });
});
