var assert = require('assert');

// var x = require('../../index.js');

describe('collections/Hashtable', function () {
  describe('#x.hashtable.create()', function () {

    // 初始化一个栈对象
    var hashtable = new x.collections.Hashtable();

    it('should return hashtable', function () {
      assert.equal(false, x.isUndefined(hashtable));

      // 测试 size() 函数
      assert.equal(0, hashtable.size());
    });

    it('should hashtable.size() = 10 when add 10 objects', function () {
      for (var i = 0; i < 10; i++) {
        hashtable.add("key-" + i, i);
      }

      assert.equal(10, hashtable.size());

      try {
        hashtable.add("key-0", 99);
      }
      catch (ex) {

      }
    });

    it('should hashtable.size() = 9 when remove key-9 objects', function () {
      hashtable.remove("key-9");
      assert.equal(9, hashtable.size());

      // 测试批量增加的方法
      hashtable.add("a=f&b=2&c=3");
      assert.equal(12, hashtable.size());
    });

    it('should hashtable.index() = 8 when index key-8 objects', function () {
      assert.equal(8, hashtable.index("key-8"));
    });

    it('should return true when key="key-0"', function () {
      assert.equal(true, hashtable.exist("key-0"));
    });

    it('should return 0 when key=key-0', function () {

      assert.equal(0, hashtable.index("key-0"));
      assert.equal(-1, hashtable.index("key-999"));

      // 测试 get 和 set 方法
      assert.equal(0, hashtable.get("key-0"));
      assert.equal(null, hashtable.get("key-999"));

      hashtable.set("key-0", 999)
      assert.equal(999, hashtable.get("key-0"));
    });

    it('should return 0 when hashtable.clear()', function () {
      hashtable.clear();
      assert.equal(0, hashtable.size());
    });
  });
});
