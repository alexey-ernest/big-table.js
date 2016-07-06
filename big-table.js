/*jslint white: true */
/*global window */

/**
 * @module BigTable implements table functionality with virtual scrolling for huge data sets.
 */
(function (window, $, BigList) {
  'use strict';

  /**
   * Creates a new instance of BigTable.
   * 
   * options.columns should be in following format: 
   * [{title: String, type: Type, key: String, format: val1 => val2, css: {class1: val1 => true|false}}]
   *
   * @class      BigTable
   * @param      {Objects}  options    Table options: {container, data, columns}.
   */
  function BigTable (options) {
    // Default settings
    var defaults = {
      container: undefined,
      data: undefined,
      columns: undefined,
      render: renderRow
    };

    // Private fields
    var bigList,
        $container,
        $header,
        sortColumn,
        sortOrder;

    /**
     * Renders table cell with text.
     *
     * @param      {String}        text     Cell text.
     * @param      {String|Array}  classes  Cell css classes.
     */
    function renderCell(text, classes) {
      if (classes.constructor !== Array) {
        classes = classes.split(' ');
      }

      var cell = document.createElement('div');
      classes.forEach(function (c) {
        cell.classList.add(c);
      });

      var textNode = document.createTextNode(text);
      cell.appendChild(textNode);
      return cell;
    }

    /**
     * Retrieves custom css classes for column value.
     *
     * @param      {Number}  cidx    Column index.
     * @param      {String}  value   Cell value.
     * @return     {Array}   Custom css classes.
     */
    function getCellClasses(cidx, value) {
      var col = options.columns[cidx];
      var result = [];
      Object.keys(col.css).forEach(function (cssClass) {
        if (col.css[cssClass] === true || col.css[cssClass](value)) {
          result.push(cssClass);
        }
      });
      return result;
    }

    /**
     * Renders header.
     */
    function renderHeader() {
      var header = document.createElement('div');
      header.classList.add('big-table__header');
      header.style.overflow = 'hidden';
      
      var i, classes;
      for (i = 0; i < options.columns.length; i+=1) {
        classes = getCellClasses(i);
        classes.push('big-table__cell');

        // appending cell
        if (options.columns[i].type !== Boolean) {
          classes.push('big-table__cell_type-sortable');
        }
        header.appendChild(renderCell(options.columns[i].title, classes));
      }

      return $(header);
    }

    /**
     * Renders viewport for virtual scrolling.
     */
    function renderViewport() {
      var viewport = document.createElement('div');
      viewport.classList.add('big-table__body');
      return $(viewport);
    }

    /**
     * Renders row.
     *
     * @param      {number}  ridx       Row index.
     */
    function renderRow(ridx) {
      var row = document.createElement('div');
      row.classList.add('big-table__row');
      
      var i, val, classes;
      for (i = 0; i < options.columns.length; i+=1) {
        val = options.columns[i].key ? options.data[ridx][options.columns[i].key] : '';

        classes = getCellClasses(i, val);
        classes.push('big-table__cell');

        // formatting value
        val = options.columns[i].format ? options.columns[i].format(val) : val;

        // appending cell
        row.appendChild(renderCell(val, classes));
      }

      return $(row);
    }

    /**
     * Validates options.
     */
    function validateOptions() {
      if (!options.container) {
        throw new Error('container option required.');
      }
      if (!options.data) {
        throw new Error('data option required.');
      }
      if (!options.columns) {
        throw new Error('columns option required.');
      }
    }

    /**
     * Re-draws a table.
     */
    function redraw() {
      if (bigList) {
        bigList.redraw();
      }
    }

    /**
     * Numberic comparator helper function.
     *
     * @param      {string}   key      Object key to compare.
     * @param      {Boolean}  reverse  Indicates if reverse order required.
     */
    function compareNumeric(key, reverse) {
      return function (a, b) {
        var res = a[key] - b[key];
        return !reverse ? res : -res;
      };
    }

    /**
     * String comparator helper function.
     *
     * @param      {string}   key      Object key to compare.
     * @param      {Boolean}  reverse  Indicates if reverse order required.
     */
    function compareString(key, reverse) {
      return function (a, b) {
        if (a[key] > b[key]) {
          return !reverse ? 1 : -1;
        }
        if (a[key] < b[key]) {
          return !reverse ? -1 : 1;
        }
        return 0;
      };
    }

    /**
     * Click event handler for column header.
     *
     * @param      {Number}  i       Column index.
     */
    function columnHeaderClickHandler(i) {
      if (sortColumn === i) {
        sortOrder = !sortOrder;
      } else {
        sortColumn = i;
        sortOrder = false;  
      }

      var key = options.columns[i].key;
      if (options.columns[i].type === Number) {
        options.data.sort(compareNumeric(key, sortOrder));
      } else if (options.columns[i].type === String) {
        options.data.sort(compareString(key, sortOrder));
      } else {
        return;
      }

      // redrawing visible items
      redraw();
    }

    /**
     * Register header event handlers.
     */
    function registerHeaderHandlers() {
      $header.children().each(function (i, h) {
        $(h).on('click', function () {
          columnHeaderClickHandler(i);
        });
      });
    }

    /**
     * Deregisters header event handlers.
     */
    function deregisterHeaderHandlers() {
      $header.children().each(function (i, h) {
        $(h).off('click');
      });
      $header = null;
    }

    /**
     * Inits a BigTable.
     */
    function init() {
      options = $.extend({}, defaults, options);

      // validate options
      validateOptions();

      // render table elements
      $container = $(options.container);
      
      $header = renderHeader();
      registerHeaderHandlers();
      $container.append($header);

      var $viewport = renderViewport();      
      $container.append($viewport);

      options.container += ' .big-table__body';

      // render list
      options.totalCount = options.data.length;
      bigList = new BigList(options);
    }

    /**
     * Destroys a table.
     */
    function destroy() {
      if (bigList) {
        deregisterHeaderHandlers();

        bigList.destroy();
        bigList = null;

        $container.empty();
      }
    }

    init();

    // Public interface
    return {
      destroy: destroy
    };
  }

  // Export BigTable class.
  $.extend(window, {
    BigTable: BigTable
  });

}(window, window.jQuery, window.BigList));