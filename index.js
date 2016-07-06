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

    function loadData(fn) {
      $.ajax('/data/100000')
      .done(function (res) {
        // set index for each item to visualize sorting order
        res.forEach(function (i, idx) {
          i.idx = idx;
        });

        fn(res);
      });
    }

    function renderTable(data) {
      // define table columns
      var columns = [
        {
          name: '#', 
          type: Number, 
          map: function (i) {
            return i.idx; 
          },
          css: {'big-table__cell_col-1': true}
        },
        {
          name: 'Key', 
          type: String,
          map: function (i) {
            return i.key; 
          }, 
          css: {'big-table__cell_col-2': true}
        },
        {
          name: 'Value', 
          type: Number,
          map: function (i) { 
            return i.val; 
          },
          format: function (i) {
            return i.toFixed(4);
          },
          css: {'big-table__cell_col-3': true}
        },
        {
          name: 'Delta', 
          type: Number,
          map: function (i) { 
            return i.delta; 
          },
          format: function (i) {
            return i.toFixed(4);
          },
          css: {
            'big-table__cell_col-3': true,
            'big-table__cell_color-red': function (val) {
              return val < 0;
            },
            'big-table__cell_color-green': function (val) {
              return val > 0;
            }
          }
        },
        {
          name: 'Open?', 
          type: Boolean,
          map: function (i) { 
            return i.active; 
          }, 
          format: function (i) {
            return i ? 'open' : 'closed'; 
          },
          css: {'big-table__cell_col-2': true}
        },
        {
          name: 'Rec', 
          type: String,
          map: function (i) { 
            return i.rec; 
          }, 
          css: {
            'big-table__cell_col-1': true,
            'big-table__cell_font-bold': function (val) {
              return val !== 'hold';
            }
          }
        }
      ];

      // create table object
      table = new BigTable({
        container: '.big-table',
        data: data,
        height: 500,
        itemHeight: 40,
        columns: columns
      });
    }

    function init() {
      // loading data and rendering table
      loadData(renderTable);
    }

    init();
  }

  // Export App class.
  $.extend(window, {
    App: new BigTableApp()
  });

}(window.jQuery, window.BigTable));