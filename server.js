/*jslint white: true */

var express = require('express');
var app = express();

var RECS = ['buy', 'hold', 'sell'];

/**
 * Generates dataset item.
 */
function generateItem() {
  var i, key = '', len = ~~(4 + Math.random() + 0.5);
  for (i = 0; i < len; i+=1) {
    key += String.fromCharCode(parseInt(65 + Math.random() * 26));
  }

  i = 0;
  var fields = [];
  fields[i++] = key; // key
  fields[i++] = Math.random() >= 0.5; // active
  fields[i++] = Math.random() * 1000; // value
  fields[i++] = Math.random() * 10 - 5; // delta
  fields[i++] = RECS[parseInt(Math.random() * RECS.length)]; // rec
  fields[i++] = 'https://yandex.ru/search/?text=' + key; // link

  return fields.join(',');
}

/**
 * Generates data set.
 */
app.get('/data/:size', function (req, res) {
  var size = +req.params.size;

  var i = 0;
  var data = [];
  for (i = 0; i < size; i+=1) {
    data[i] = generateItem();
  }

  res.send(data.join('\n'));
});

/**
 * Serves static.
 */
app.use('/', express.static(__dirname));

app.listen(3000, function () {
  console.log('Listening on http://localhost:3000');
});