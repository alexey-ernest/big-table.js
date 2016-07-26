/*jslint white: true */

var express = require('express');
var app = express();


/**
 * Generates dataset item.
 */
function generateItem() {
  var i, 
      key = '',
      rnd = Math.random(),
      len = ~~(4 + rnd + 0.5);
  
  var RECS = ['buy', 'hold', 'sell'];

  for (i = 0; i < len; i+=1) {
    key += String.fromCharCode(parseInt(65 + Math.random() * 26));
  }

  return [
    key,                                      // key
    rnd >= 0.5,                               // active
    rnd * 1000,                               // value
    rnd * 10 - 5,                             // delta
    RECS[parseInt(rnd * RECS.length)],        // rec
    'https://yandex.ru/search/?text=' + key   // link
  ].join(',');
}

/**
 * Generates data set.
 */
app.get('/data/:size', function (req, res) {
  var size = +req.params.size;

  // Duff's Device technique (to reduce number of cycles)
  var i = size % 8,
      iterations = Math.floor(size / 8),
      data = [];

  while(i) {
    data[iterations * 8 + i - 1] = generateItem();
  }

  i = iterations * 8;
  while(i) {
    data[i-- - 1] = generateItem();
    data[i-- - 1] = generateItem();
    data[i-- - 1] = generateItem();
    data[i-- - 1] = generateItem();
    data[i-- - 1] = generateItem();
    data[i-- - 1] = generateItem();
    data[i-- - 1] = generateItem();
    data[i-- - 1] = generateItem();
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