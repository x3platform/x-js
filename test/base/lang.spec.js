var assert = require('assert');

var x = require('../../index.js');

describe('base/lang', function () {
  describe('#x.type(object)', function () {
    var objects = [
      { object: true, type: 'boolean' },
      { object: 10, type: 'number' },
      { object: 'abc', type: 'string' },
      { object: {}, type: 'object' },
      { object: new Date(0), type: 'date' },
      { object: /abc/g, type: 'regexp' }
    ];

    for (var i = 0, l = objects.length; i < l; i++) {
      var obj = objects[i];
      it('should return ' +obj.type + ' when the value is ' + obj.object, function () {
        assert.equal(x.type(obj.object), obj.type);
      });
    }
  });

  describe('#x.isArray(object)', function () {
    it('should return true when the value is Array', function () {
      assert.equal(x.isArray([2, 4, 6]), true);
    });

    it('should return true when the value is String', function () {
      assert.equal(x.isArray('a'), false);
    });
  });

  describe('#x.isFunction(object)', function () {
    it('should return true when the object is Function', function () {
      assert.equal(x.isFunction(x.noop), true);
    });

    it('should return true when the object is not Function', function () {
      assert.equal(x.isFunction('abcdefghi'), false);
      assert.equal(x.isFunction(1234567890), false);
    });
  });

  describe('#x.isString(object)', function () {
    it('should return true when the value is String', function () {
      assert.equal(x.isString('abcdefghijklmn'), true);
    });

    it('should return true when the value is Number', function () {
      assert.equal(x.isString(0), false);
    });
  });

  describe('#x.extend(source)', function () {
    it('should return object when the source', function () {
      assert.deepEqual(x.extend({ a: 'a' }, { b: 'b', c: 'c' }), { a: 'a', b: 'b', c: 'c' });
      assert.deepEqual(x.extend(null, { a: 'a' }), { a: 'a' });
    });
  });

  describe('#x.clone(object)', function () {
    it('should return a clone object', function () {
      var obj = x.clone({ a: 'a', b: 'b', c: 'c' });
      assert.deepEqual(obj, { a: 'a', b: 'b', c: 'c' });
    });
  });
});
