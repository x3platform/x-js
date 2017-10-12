var assert = require('assert');

// var x = require('../../index.js');

describe('queue', function () {
  describe('#x.queue.create()', function () {

    // 初始化一个队列对象
    var queue = x.queue.create();

    it('should return queue', function () {
      assert.equal(false, x.isUndefined(queue));

      // 空值状态下返回 null 值
      assert.equal(null, queue.pop());
      assert.equal(null, queue.peek());

      // 测试 size() 函数
      assert.equal(0, queue.size());
    });

    it('should queue.size() = 10 when push 10 objects', function () {
      for (var i = 0; i < 10; i++) {
        queue.push({ "name": i });
      }

      assert.equal(10, queue.size());
    });

    it('should queue.size() = 9 return object when pop object', function () {
      var obj = queue.pop();

      assert.equal(false, x.isUndefined(obj));
      assert.equal(9, queue.size());
    });

    it('should queue.size() = 9 return object when pop object', function () {
      // 测试 peek() 函数
      var obj = queue.peek();
      assert.equal(1, obj.name);
      assert.equal(9, queue.size());

    });

    it('should return 0 when queue.clear()', function () {
      queue.clear();
      assert.equal(0, queue.size());
    });

    it('should return true when the queue is empty', function () {
      assert.equal(true, queue.isEmpty());

      for (var i = 0; i < 10; i++) {
        queue.push({ "name": i });
      }

      assert.equal(false, queue.isEmpty());
    });
  });
});
