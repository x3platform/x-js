var assert = require('assert');

// var x = require('../index.js');

describe('base', function () {

  // 构建测试内容

  var container = document.createElement('div');

  var h1 = document.createElement('h1');
  h1.innerHTML = 'x.query';

  container.appendChild(h1);

  document.body.appendChild(container);

  for (var i = 0; i < 10; i++) {
    var input = document.createElement('input');
    var name = 'test' + i;
    input.id = name;
    input.type = 'text';
    input.dataset.count = 0;

    x.on(input, 'click', function (evt) {
      var target = evt.target;
      target.dataset.count = Number(target.dataset.count) + 1;
      target.value = target.id + '-click-' + target.dataset.count;
    });

    container.appendChild(input);

    input.value = name;
  }

  var h1 = document.createElement('h1');

  h1.innerHTML = 'x.queryAll elements';

  container.appendChild(h1);

  for (var i = 0; i < 10; i++) {
    var input = document.createElement('input');
    var name = 'checkbox-' + i;
    input.id = name;
    input.className = 'checkboxGroup';
    input.type = 'checkbox';
    input.value = name;

    container.appendChild(input);
  }

  describe('#x.query', function () {
    it('should return element', function () {
      for (var i = 0; i < 10; i++) {
        var name = 'test' + i;

        var result = x.query('#test' + i);
        assert.notEqual(x.type(result), 'undefined');
        assert.equal(result.id, name);

        var elem = result;
        var result = x.query(elem);
        assert.notEqual(x.type(result), 'undefined');
        assert.equal(result.id, name);

        // console.log(document.documentElement.clientHeight);
        // console.log(a);
        // assert.equal(!!document.documentElement, true);
      }
    });
  });

  describe('#x.query', function () {
    it('should return elements', function () {
      var results = x.queryAll('.checkboxGroup');
      assert.equal(results.length, 10);
    });
  });
});
