/*jslint white: true */

var express = require('express');
var app = express();

var RECS = ['buy', 'hold', 'sell'];

/**
 * Generates dataset item.
 */
function generateItem() {
  var i, key = '', len = ~~(4 + Math.random() + 0.5);
  for (i = 0; i < len; i++) {
    key += String.fromCharCode(parseInt(65 + Math.random() * 26));
  }

  var item = {
    key: key,
    active: Math.random() >= 0.5,
    val: Math.random() * 1000,
    delta: Math.random() * 10 - 5,
    rec: RECS[parseInt(Math.random() * RECS.length)],
    link: 'https://yandex.ru/search/?text=' + key
  }
  return item;
}

/**
 * Generates data set.
 */
app.get('/data/:size', function (req, res) {
  var size = +req.params.size;

  var i = 0;
  var data = [];
  for (i = 0; i < size; i++) {
    data[i] = generateItem();
  }

  res.send(data);
});

/**
 * Serves static.
 */
app.use('/', express.static(__dirname));

app.listen(3000, function () {
  console.log('Listening on http://localhost:3000');
});