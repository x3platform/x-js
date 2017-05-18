var express = require('express');
var app = express();

express.static('dist/test/');

app.use('/', express.static('dist/test/'));
app.use('/node_modules/', express.static('node_modules'));

app.get('/', function (req, res) { });

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server running at http://%s:%s', host, port);
});
