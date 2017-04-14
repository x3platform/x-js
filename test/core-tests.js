var assert = require('assert');

var x = require('../index.js');

describe('core', function () {
  describe('#x.type(object)', function () {
    it('type -> bool', function () {
      assert.equal(x.type(true), 'boolean');
    });

    it('type -> number', function () {
      assert.equal(x.type(1), 'number');
    });

    it('type -> string', function () {
      assert.equal(x.type('string'), 'string');
    });

    it('type -> string', function () {
      assert.equal(x.type(new Date), 'date');
    });

    it('type -> object', function () {
      assert.equal(x.type({}), 'object');
    });
  });

  describe('#x.isArray(object)', function () {
    it('should return true when the value is Array', function () {
      assert.equal(x.isArray([2, 4, 6]), true);
    });

    it('should return true when the value is String', function () {
      assert.equal(x.isArray('a'), false);
    });
  });

  describe('#x.guid.create()', function () {
    it('should return true when the value is Array', function () {
      assert.equal(x.isArray([2, 4, 6]), true);
    });

    it('should return true when the value is String', function () {
      assert.equal(x.isArray('a'), false);
    });
  });

  describe('#x.randomText.create(object)', function () {
    it('should return true when the value is Array', function () {
      assert.equal(x.isArray([2, 4, 6]), true);
    });

    it('should return true when the value is String', function () {
      assert.equal(x.isArray('a'), false);
    });
  });
});
