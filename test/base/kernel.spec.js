var assert = require('assert');

var x = require('../../index.js');

describe('base/kernel', function () {
  describe('#x.register(value)', function () {
    it('should create empty object when the object is not exist', function () {
      x.register('tests.core.net');
      assert.equal(!!tests, true);
      assert.equal(!!tests.core, true);
      assert.equal(!!tests.core.net, true);
    });
  });

  describe('#x.invoke(object, fn)', function () {
    it('should return true when the value is Array', function () {

      var obj = { name: 'a' };

      var setName = function (name) {
        this.name = name;
      }

      x.invoke(obj, setName, 'b');

      assert.equal(obj.name, 'b');
    });
  });

  describe('#x.call(anything)', function () {
    // 定义变量
    var anything, result;

    it('should call function when the anything is Function', function () {
      anything = function () { return 100; }
      result = x.call(anything);
      assert.equal(result, 100);
    });

    it('should eval string code when the anything is String', function () {
      anything = '1+1;';
      result = x.call(anything);
      assert.equal(result, 2);
    });
  });

  describe('#x.serialize(object)', function () {
    it('should return true when the value is Array', function () {
      var obj = x.serialize([
        { name: 'a', value: '1' },
        { name: 'b', value: '2' },
        { name: 'c', value: '3' }
      ]);
      assert.equal(obj, 'a=1&b=2&c=3');
    });

    it('should return true when the value is Array', function () {
      var obj = x.serialize({ a: '1', b: '2', c: '3' });
      assert.equal(obj, 'a=1&b=2&c=3');
    });
  });

  describe('#x.each(data, callback)', function () {
    var outString = '';
    it('should return data when the data is Array', function () {
      outString = '';

      x.each(['c', 'b', 'a'], function (index, node) {
        outString += '[' + index + ']=' + node + ' ';
      });

      outString = x.string.trim(outString, ' ');

      assert.equal('[0]=c [1]=b [2]=a', outString);

      // 测试中途退出功能能
      outString = '';

      x.each(['c', 'b', 'a'], function (index, node) {
        if (index == 2) { return false; }
        outString += '[' + index + ']=' + node + ' ';
      });

      outString = x.string.trim(outString, ' ');

      assert.equal('[0]=c [1]=b', outString);

    });

    it('should return text when the data is Object', function () {
      var outString = '';

      x.each({ '0': 'c', '1': 'b', '2': 'a' }, function (name, value) {
        outString += '[' + name + ']=' + value + ' ';
      });

      outString = x.string.trim(outString, ' ');

      assert.equal('[0]=c [1]=b [2]=a', outString);

      // 测试中途退出功能能
      outString = '';

      x.each({ '0': 'c', '1': 'b', '2': 'a' }, function (name, value) {
        if (name == '2') { return false; }
        outString += '[' + name + ']=' + value + ' ';
      });

      outString = x.string.trim(outString, ' ');

      assert.equal('[0]=c [1]=b', outString);
    });
  });

  describe('#x.toJSON(text)', function () {
    it('should return json when the json string', function () {
      var results = [
        { "name": "1", "b": "2", "c": "3" },
        '{ "name": "1", "b": "2", "c": "3" }',
        '{ name: "1", "b": "2", "c": "3" }',
        null,
        undefined
      ];

      for (var i = 0; i < results.length; i++) {
        var result = x.toJSON(results[i]);

        if (x.type(results[i]) == 'undefined') {
          assert.equal(result, undefined);
        }
        else if (x.type(results[i]) === 'null') {
          assert.equal(result, null);
        } else {
          assert.equal(x.type(result), 'object');
          assert.equal(result.name, '1');
        }
      }
    });
  });

  describe('#x.toSafeJSON(text)', function () {
    it('should return json text when the value is \\t\\n\\f', function () {
      var text = x.toSafeJSON('abcdef\/\b\n\r\t\f');
      assert.equal(text, 'abcdef\\\/\\b\\n\\r\\t\\f');
    });
  });

  describe('#x.toSafeLike(text)', function () {
    it('should return like value', function () {
      assert.equal(x.toSafeLike('[%_]'), '[[][%][_]]');
    });
  });

  describe('#x.cdata(text)', function () {
    it('should return CDATA text', function () {
      var text = 'a';
      assert.equal(x.cdata(text), '<![CDATA[' + text + ']]>');
    });
  });

  describe('#x.camelCase(text)', function () {
    it('should return "abc" when the text is "Abc"', function () {
      assert.equal(x.camelCase('abc-def-ghi'), 'abcDefGhi');
    });
  });

  describe('#x.guid.create(format, isUpperCase)', function () {
    it('should return guid xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', function () {
      assert.equal(x.guid.create().length, 36);
    });

    it('should return guid xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', function () {
      assert.equal(x.guid.create('').length, 32);
    });

    it('should return guid XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', function () {
      assert.equal(x.guid.create('-', true).length, 36);
    });
  });

  describe('#x.randomText.create(length, buffer)', function () {
    it('should return random text', function () {
      assert.equal(x.randomText.create().length, 8);
      assert.equal(x.randomText.create(10).length, 10);
    });
  });

  describe('#x.nonce(length)', function () {
    it('should return random number', function () {
      assert.equal(String(x.nonce()).length, 6);
      assert.equal(String(x.nonce(8)).length, 8);
    });
  });

  describe('#StringBuilder()', function () {
    it('should return text when StringBuilder()', function () {
      // 支持 RGB 格式字符串转 HEX 格式字符串
      var s1 = new x.StringBuilder();
      var s2 = new x.StringBuilder();

      s1.append('a');
      s1.append('b');

      s2.append('1');
      s1.append('c');

      s2.append('2');
      s2.append('3');

      assert.equal(s1.toString(), 'abc');
      assert.equal(s2.toString(), '123');
    });
  });

  describe('#Timer()', function () {
    it('should return ok when Timer()', function (done) {
      var begin = x.date.now();

      // 支持 RGB 格式字符串转 HEX 格式字符串
      var timer1 = new x.Timer(5, function () {
        var end = x.date.now();
        var timespan = x.date.diff(begin.toNativeDate(), end.toNativeDate(), 's');
        console.log(timespan);
        assert.equal(true, timespan >= 5);
        timer1.stop();
        done()
      });

      timer1.start();
    });

    it('should return ok when Timer()', function (done) {
      var begin = x.date.now();
      var timer2 = new x.Timer(1, function () {
        var end = x.date.now();
        var timespan = x.date.diff(begin.toNativeDate(), end.toNativeDate(), 's');
        console.log(timespan);
        assert.equal(true, timespan >= 1);
        timer2.stop();
        done()
      });
      timer2.start();
    });
  });

  describe('debug', function () {
    it('should output logging', function () {
      // x.debug.log('\t==> log');
      assert.ok(1);

      // x.debug.warn('\t==> warn');
      assert.ok(1);

      // x.debug.error('\t==> error');
      assert.ok(1);

      // x.debug.assert("a"=="c");

      // x.debug.time('\tdebug-method');
      // x.debug.timeEnd('\tdebug-method');

      // 输出时间戳
      var timestamp = x.debug.timestamp();
      var date = x.date.now();
      // x.debug.error(timestamp + ' ' + date.toString('{yyyy-MM-dd HH:mm:ss.fff}'));
      assert.equal(timestamp.indexOf(date.toString('{yyyy-MM-dd HH:mm:ss')), 0);
    });
  });
});
