var assert = require('assert');

var x = require('../index.js');

describe('net', function () {
  describe('#x.net.xhr(options)', function () {
    it('should return response when x.net.xhr(url, options)', function () {
      if (x.isBrower()) {
        x.net.xhr("data/markers.json", {
          type: 'get',
          callback: function (response) {
            console.log(response);
          }
        });
      }
      else {
        this.skip();
      }
    });
    it('should return response when x.net.xhr(url, data, options)', function () {
      if (x.isBrower()) {
        x.net.xhr("data/markers.json", { a: 1, b: 2, c: 3 }, {
          type: 'get',
          callback: function (response) {
            console.log(response);
          }
        });

      }
      else {
        this.skip();
      }
    });
  });
});
