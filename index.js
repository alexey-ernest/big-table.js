/*jslint white: true */
/*global window */

/**
 * @module Demo application.
 */
(function ($, BigTable) {
  'use strict';

  function BigTableApp() {
    // vars
    var table;

    function loadData(count, fn) {
      if (!count) {
        count = 100000;
      }

      $.ajax('/data/' + count)
      .done(function (res) {
        // set index for each item to visualize sorting order
        for (var i = res.length; i--;) {
          res[i].idx = i;
        }

        fn(res);
      });
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
          key: 'val',
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

  // Export App class.
  $.extend(window, {
    App: new BigTableApp()
  });

}(window.jQuery, window.BigTable));