/*jslint white: true */
/*global window */

/**
 * @module Demo application.
 */
(function ($, BigTable) {
  'use strict';

  function BigTableApp() {
    // vars
    var table,
        data;

    function compare(a, b) {
      if (a.val < b.val) {
        return -1;
      }
      if (a.val > b.val) {
        return 1;
      }
      return 0;
    }

    function redraw() {
      var start, end;

      start = new Date().getTime();
      data = data.sort(compare);
      end = new Date().getTime();
      console.log('Sorting time: ' + (end - start));

      start = new Date().getTime();
      table.redraw();
      end = new Date().getTime();
      console.log('Redraw time: ' + (end - start));
    }

    function loadData(fn) {
      $.ajax('/data/100000')
      .done(function (res) {
        data = res;
        fn(res);
      });
    }

    function renderTable(data) {
      // define table columns
      var columns = [
        {
          name: '#', 
          css: {'big-table__cell_col-1': true}
        },
        {
          name: 'Key', 
          map: function (i) {
            return data[i].key; 
          }, 
          css: {'big-table__cell_col-2': true}
        },
        {
          name: 'Value', 
          map: function (i) { 
            return data[i].val.toFixed(4); 
          }, 
          css: {'big-table__cell_col-3': true}
        },
        {
          name: 'Delta', 
          map: function (i) { 
            return data[i].delta.toFixed(4); 
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
          map: function (i) { 
            return data[i].active ? 'open' : 'closed'; 
          }, 
          css: {'big-table__cell_col-2': true}
        },
        {
          name: 'Rec', 
          map: function (i) { 
            return data[i].rec; 
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
        totalCount: data.length,
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

    // Public interface
    return {
      redraw: redraw
    };
  }

  // Export BigTable class.
  $.extend(window, {
    App: new BigTableApp()
  });

}(window.jQuery, window.BigTable));