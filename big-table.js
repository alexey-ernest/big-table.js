/*jslint white: true */
/*global window */

/**
 * @module BigTable implements table functionality with virtual scrolling for huge data sets.
 */
(function (window, $, BigList) {
  'use strict';

  /**
   * Creates a new instance of BigTable
   *
   * @class      BigTable
   * @param      {Objects}  options    Table options.
   */
  function BigTable (options) {
    // Default settings
    var defaults = {
      container: undefined,
      totalCount: undefined,
      columns: undefined, // Columns list: [{name: string, map: idx => val, css: {class1: val1 => true|false}}]
      render: renderRow
    };

    // Private fields
    var bigList;

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
     * Renders row.
     *
     * @param      {number}  ridx       Row index.
     */
    function renderRow(ridx) {
      var row = document.createElement('div');
      row.classList.add('big-table__row');
      
      var i, val, classes;
      for (i = 0; i < options.columns.length; i+=1) {
        val = options.columns[i].map ? options.columns[i].map(ridx) : ridx;

        classes = getCellClasses(i, val);
        classes.push('big-table__cell');

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
      if (!options.totalCount) {
        throw new Error('totalCount option required.');
      }
      if (!options.columns) {
        throw new Error('columns option required.');
      }
    }

    /**
     * Inits a BigTable.
     */
    function init() {
      options = $.extend({}, defaults, options);

      // validate options
      validateOptions();

      // init a BigList
      bigList = new BigList(options);
    }

    function destroy() {
      if (bigList) {
        bigList.destroy();
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