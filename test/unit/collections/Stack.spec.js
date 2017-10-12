var assert = require('assert');

// var x = require('../../index.js');

describe('stack', function () {
  describe('#x.stack.create()', function () {

    // 初始化一个栈对象
    var stack = x.stack.create();

    it('should return Stack', function () {
      assert.equal(false, x.isUndefined(stack));

      // 空值状态下返回 null 值
      assert.equal(null, stack.pop());
      assert.equal(null, stack.peek());

      // 测试 size() 函数
      assert.equal(0, stack.size());
    });

    it('should stack.size() = 10 when push 10 objects', function () {
      for (var i = 0; i < 10; i++) {
        stack.push({ "name": i });
      }

      assert.equal(10, stack.size());
    });

    it('should stack.size() = 9 return object when pop object', function () {
      var obj = stack.pop();

      assert.equal(false, x.isUndefined(obj));
      assert.equal(9, stack.size());
    });

    it('should stack.size() = 9 return object when pop object', function () {
      // 测试 peek() 函数
      var obj = stack.peek();
      assert.equal(8, obj.name);
      assert.equal(9, stack.size());

    });

    it('should return 0 when stack.clear()', function () {
      stack.clear();
      assert.equal(0, stack.size());
    });

    it('should return true when the stack is empty', function () {
      assert.equal(true, stack.isEmpty());

      for (var i = 0; i < 10; i++) {
        stack.push({ "name": i });
      }

      assert.equal(false, stack.isEmpty());
    });
  });
});
