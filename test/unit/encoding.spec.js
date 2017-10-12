var assert = require('assert');

// var x = require('../index.js');

describe('encoding', function () {
  describe('#x.encoding.html.encode(text)', function () {
    it('should return html code when the value is String', function () {
      assert.equal(x.encoding.html.encode(''), '');
      assert.equal(x.encoding.html.encode('&'), '&#32;');
      // assert.equal(x.encoding.html.encode(' '), '&#38;');
    });
  });
  describe('#x.encoding.html.decode(text)', function () {
    it('should return text when the value is String', function () {
      assert.equal(x.encoding.html.decode(''), '');
      //
      assert.equal(x.encoding.html.decode('&amp;'), '&');
      assert.equal(x.encoding.html.decode('&nbsp;'), ' ');
      // assert.equal(x.encoding.html.decode('&#38;'), '');
    });
  });
  describe('#x.encoding.unicode.encode(text)', function () {
    it('should return text when the value is String', function () {
      // 空值处理
      assert.equal(x.encoding.unicode.encode(''), '');
      // \u4e2d\u534e
      assert.equal(x.encoding.unicode.encode('中华'), '\\u4e2d\\u534e');
      assert.equal(x.encoding.unicode.encode('中华','&#'), '&#20013;&#21326;');
      assert.equal(x.encoding.unicode.encode('中华','&#x'), '&#x4e2d;&#x534e;');
    });
  });
  describe('#x.encoding.unicode.decode(text)', function () {
    it('should return text when the value is String', function () {
      // 空值处理
      assert.equal(x.encoding.unicode.decode(''), '');
      //
      assert.equal(x.encoding.unicode.decode('\\u4e2d\\u534e'), '中华');
    });
  });
});
