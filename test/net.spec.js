var assert = require('assert');

var x = require('../index.js');

describe('net', function () {
  describe('#x.net.xhr(options)', function () {
    it('should return response when request url', function () {
      if (x.isBrower()) {
        x.net.xhr("data/markers.json", {}, {
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
