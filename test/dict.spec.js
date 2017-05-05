var assert = require('assert');

var x = require('../index.js');

describe('dict', function () {
  describe('#x.dict.create()', function () {

    // 初始化一个栈对象
    var dict = new x.Dict();

    it('should return dict', function () {
      assert.equal(false, x.isUndefined(dict));

      // 测试 size() 函数
      assert.equal(0, dict.size());
    });

    it('should dict.size() = 10 when push 10 objects', function () {
      for (var i = 0; i < 10; i++) {
        dict.add("key-" + i, i);
      }

      assert.equal(10, dict.size());
    });

    it('should return 0 when dict.clear()', function () {
      dict.clear();
      assert.equal(0, dict.size());
    });
  });
});
