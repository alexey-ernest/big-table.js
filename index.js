/*jslint white: true */
/*global window */

/**
 * Demo application.
 */
var App = (function (BigTable) {
  'use strict';

  function BigTableApp() {
    // vars
    var table;

    function loadData(count, fn) {
      if (!count) {
        count = 100000;
      }

      function parseItem(str) {
        var fields = str.split(','),
            i = 0;
        return {
          idx: i,
          key: fields[i++],
          active: fields[i++],
          value: +fields[i++],
          delta: +fields[i++],
          rec: fields[i++],
          link: fields[i++]
        };
      }

      function parseResponse(res) {
        // parsing data
        var itemsStr = res.split('\n'),
            items = [],
            len = itemsStr.length,
            i,
            item;

        // set index for each item to visualize sorting order
        for (i = len; i--;) {
          item = parseItem(itemsStr[i]);
          item.idx = i;
          items[i] = item;
        }

        fn(items);
      }

      // making request
      var req = new XMLHttpRequest();
      req.open('GET', '/data/' + count, true);
      req.onreadystatechange = function() {
        if (req.readyState == 4) {
          parseResponse(req.responseText);
        }
      };

      req.send(null);
    }

    function renderTable(data) {
      // define table columns
      var columns = [
        {
          title: '#', 
          type: Number, 
          key: 'idx',
          css: {'big-table__col-1': true}
        },
        {
          title: 'Key', 
          type: String,
          key: 'key',
          css: {'big-table__col-1': true}
        },
        {
          title: 'Value', 
          type: Number,
          key: 'value',
          format: function (i) {
            return i.toFixed(4);
          },
          css: {'big-table__col-1': true}
        },
        {
          title: 'Delta', 
          type: Number,
          key: 'delta',
          format: function (i) {
            return i.toFixed(4);
          },
          css: {
            'big-table__col-1': true,
            'big-table__cell_color-red': function (val) {
              return val < 0;
            },
            'big-table__cell_color-green': function (val) {
              return val > 0;
            }
          }
        },
        {
          title: 'Link',
          key: 'link',
          css: {'big-table__col-5': true}
        },
        {
          title: 'Open?', 
          type: Boolean,
          key: 'active',
          format: function (i) {
            return i ? 'open' : 'closed'; 
          },
          css: {'big-table__col-2': true}
        },
        {
          title: 'Rec', 
          type: String,
          key: 'rec',
          css: {
            'big-table__col-1': true,
            'big-table__cell_font-bold': function (val) {
              return val !== 'hold';
            }
          }
        }
      ];

      // create table object
      table = new BigTable({
        container: '#big-table',
        data: data,
        height: 500,
        itemHeight: 40,
        columns: columns
      });
    }

    function init(count) {
      if (table) {
        table.destroy();
      }

      // loading data and rendering table
      loadData(count, renderTable);
    }

    init();

    // Public interface
    return {
      init: init
    };
  }

  return BigTableApp;

}(window.BigTable));

// self init
window.App = new App();
