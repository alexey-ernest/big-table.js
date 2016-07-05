
var express = require('express');
var app = express();

var RECS = ['buy', 'hold', 'sell'];
function generateItem() {
  var i, name = '';
  
  for (i = 0; i < Math.random() * 5 + 1; i++) {
    name += String.fromCharCode(parseInt(65 + Math.random() * 26));
  }
  var item = {
    name: name,
    active: Math.random() >= 0.5,
    val: Math.random() * 1000,
    delta: Math.random() * 10 - 5,
    rec: RECS[parseInt(Math.random() * RECS.length)]
  }
  return item;
}

app.get('/data/:size', function (req, res) {
  var size = +req.params.size;

  var i = 0;
  var data = [];
  for (i = 0; i < size; i++) {
    data[i] = generateItem();
  }

  res.send(data);
});

app.listen(3000, function () {
  console.log('Listening on http://localhost:3000');
});