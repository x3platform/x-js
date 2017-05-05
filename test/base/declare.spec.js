var assert = require('assert');

var x = require('../../index.js');

describe('base/declare', function () {
  describe('#x.declare(className, superclass, props)', function () {
    // 定义一个变量
    var obj = null;

    it('should return object when x.declare(props)', function () {
      // 定义一个对象
      var A = x.declare({
        name: 'a1',
        constructor: function () {
          // this.name = 'B';
        }
      });

      obj = new A();

      assert.equal(obj.name, 'a1');

      // 定义一个带名称空间的对象
      var A = x.declare({
        name: 'a2',
        constructor: function () {
          this.name = 'B';
          this.createdDate = '1970-01-01';
        }
      });

      obj = new A();

      assert.equal(obj.name, 'B');
    });

    it('should return object when x.declare(superclass, props)', function () {
      // 定义一个带名称空间的对象
      var A = x.declare({ a: 'a3' });
      var B = x.declare(A, { b: 'b3' });
      var C = x.declare(B, { c: 'c3' });

      obj = new C();

      assert.equal(obj.c, 'c3');
    });

    it('should return object when x.declare(className, props)', function () {
      // 定义一个带名称空间的对象
      x.declare('a.b.C', {
        name: 'A',
        age: 10,
        constructor: function () {
          this.name = 'B';
        }
      });

      obj = new a.b.C();

      assert.equal(obj.name, 'B');
    });

    it('should return object when x.declare(className, superclass, props)', function () {
      // 定义一个带名称空间的对象
      var A = x.declare({ a: 'a3' });
      var B = x.declare(A, { b: 'b3' });
      x.declare('a.b.C', B, {
        name: 'c3',
        constructor: function () {
          this.name = 'C3';
        }
      });

      obj = new a.b.C();

      assert.equal(obj.name, 'C3');
    });
  });
});
