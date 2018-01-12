var assert = require('assert');

// var x = require('../index.js');

describe('net', function () {
  // 模拟数据
  var apiHost = 'http://jsonplaceholder.typicode.com';
  describe('#x.net.xhr(options)', function () {
    it('should return response when x.net.xhr(url, options)', function () {
      if (x.isBrower()) {
        x.net.xhr(apiHost + '/users', {
          type: 'get',
          callback: function (response) {
            // console.log(response);
          }
        });
      }
      else {
        this.skip();
      }
    });
    it('should return response when x.net.xhr(url, data, options)', function () {
      if (x.isBrower()) {
        x.net.xhr(apiHost + '/users', { a: 1, b: 2, c: 3 }, {
          type: 'post',
          callback: function (response) {
            // console.log(response);
          }
        });
      }
      else {
        this.skip();
      }
    });
  });
});
