var assert = require('assert');

var x = require('../index.js');

describe('string', function () {
  describe('#x.string.stringify()', function () {
    it('should return \'100\' when the value is 100', function () {
      assert.equal(x.string.stringify(100), '100');
      assert.equal(x.string.stringify(false), 'false');
    });
    it('should return \'abc\' when the function() { return \'abc\'; }', function () {
      assert.equal(x.string.stringify(function () { return 'abc'; }), 'abc');
    });
    it('should return \'\' when the value is null or undefined', function () {
      assert.equal(x.string.stringify(undefined), '');
      assert.equal(x.string.stringify(null), '');
    });
  });

  describe('#x.string.trim()', function () {
    it('should return \'x\' when the value is \'x \'', function () {
      // 修剪空格
      var text = x.string.trim(' x ');
      assert.equal(text, 'x');
      // 修剪指定字符
      text = x.string.trim('x,', ',');
      assert.equal(text, 'x');
      // 支持多个字符的修剪
      text = x.string.trim('...x...', '...');
      assert.equal(text, 'x');
    });
  });

  describe('#x.string.ltrim()', function () {
    it('should return \'x\' when the value is \'x \'', function () {
      // 修剪空格
      var text = x.string.ltrim(' x ');
      assert.equal(text, 'x ');
      // 修剪指定字符
      text = x.string.ltrim(',x,', ',');
      assert.equal(text, 'x,');
      // 支持多个字符的修剪
      text = x.string.ltrim('...x...', '...');
      assert.equal(text, 'x...');
    });
  });

  describe('#x.string.rtrim()', function () {
    it('should return \'x\' when the value is \'x \'', function () {
      // 修剪空格
      var text = x.string.rtrim(' x ');
      assert.equal(text, ' x');
      // 修剪指定字符
      text = x.string.rtrim(',x,', ',');
      assert.equal(text, ',x');
      // 支持多个字符的修剪
      text = x.string.rtrim('...x...', '...');
      assert.equal(text, '...x');
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

  describe('#x.string.left(\'abcdefg\',5)', function () {
    it('should return hello x when the value is x.string.format(\'hello {0}.\', \'x\')', function () {
      var text = x.string.left('abcdefg', 5);
      assert.equal(text, 'abcde...');

      var text = x.string.left('abcdefg', 5, false);
      assert.equal(text, 'abcde');

      var text = x.string.left('abcd', 5);
      assert.equal(text, 'abcd');

      var text = x.string.left('', 5);
      assert.equal(text, '');
    });
  });
});
