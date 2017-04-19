var assert = require('assert');

var x = require('../index.js');

describe('color', function () {
  describe('#x.color.hex(\'#ffffff\')', function () {
    it('should return #ffffff when this color is rgb(255, 255, 255)', function () {
      // 支持 RGB 格式字符串转 HEX 格式字符串
      var value = x.color.hex('rgb(255, 255, 255)');
      assert.equal(value, '#ffffff');

      // 支持 RGB 格式字符串转 HEX 格式字符串
      var value = x.color.hex('rgb(0, 0, 0)');
      assert.equal(value, '#000000');

      // 支持 HEX 简写格式字符串转 HEX 完整格式字符串
      value = x.color.hex('#fff');
      assert.equal(value, '#ffffff');

      // 支持非 RGB 格式字符串直接返回
      value = x.color.hex('#ffffff');
      assert.equal(value, '#ffffff');

      // 支持非 RGB 格式字符串直接返回
      // 常见错误格式 1
      value = x.color.hex('#0000');
      assert.equal(value, '#0000');
      // 常见错误格式 2
      value = x.color.hex('rgb(255, 255)');
      assert.equal(value, 'rgb(255, 255)');

    });
  });
  describe('#x.color.rgb(\'#ffffff\')', function () {
    it('should return rgb(255, 255, 255) when this color is #ffffff', function () {
      // 支持 HEX 格式字符串转 RGB 格式字符串
      var value = x.color.rgb('#ffffff');
      assert.equal(value, 'rgb(255, 255, 255)');

      // 支持 HEX 简写格式字符串解析
      value = x.color.rgb('#fff');
      assert.equal(value, 'rgb(255, 255, 255)');

      // 支持非 HEX 格式字符串直接返回
      value = x.color.rgb('rgb(255, 255, 255)');
      assert.equal(value, 'rgb(255, 255, 255)');
    });
  });
});
