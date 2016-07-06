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

    function measureTime(fn, comment) {
      var start = new Date().getTime();
      fn();
      var end = new Date().getTime();
      console.log(comment + ': ' + (end - start));
    }

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
          map: function (i) {
            return data[i].idx; 
          }, 
          sort: function () {
            measureTime(function () {
              data.sort(function (a, b) {
                return a.idx - b.idx;
              });
            }, 'Sort by index');
          },
          css: {'big-table__cell_col-1': true}
        },
        {
          name: 'Key', 
          map: function (i) {
            return data[i].key; 
          }, 
          sort: function () {
            measureTime(function () {
              data.sort(function (a, b) {
                if (a.key > b.key) {
                  return 1;
                }
                if (a.key < b.key) {
                  return -1;
                }
                return 0;
              });
            }, 'Sort by key');
          },
          css: {'big-table__cell_col-2': true}
        },
        {
          name: 'Value', 
          map: function (i) { 
            return data[i].val.toFixed(4); 
          },
          sort: function () {
            measureTime(function () {
              data.sort(function (a, b) {
                return a.val - b.val;
              });
            }, 'Sort by value');
          },
          css: {'big-table__cell_col-3': true}
        },
        {
          name: 'Delta', 
          map: function (i) { 
            return data[i].delta.toFixed(4); 
          }, 
          sort: function () {
            measureTime(function () {
              data.sort(function (a, b) {
                return a.delta - b.delta;
              });
            }, 'Sort by delta');
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
          sort: function () {
            measureTime(function () {
              data.sort(function (a, b) {
                if (a.rec > b.rec) {
                  return 1;
                }
                if (a.rec < b.rec) {
                  return -1;
                }
                return 0;
              });
            }, 'Sort by rec');
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
  }

  // Export App class.
  $.extend(window, {
    App: new BigTableApp()
  });

}(window.jQuery, window.BigTable));