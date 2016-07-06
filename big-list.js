/*jslint white: true */
/*global window */

(function (window, $) {
  'use strict';

  /**
   * Creates a new instance of BigList
   *
   * @class      BigList
   * @param      {Objects}  options    Table options.
   */
  function BigList (options) {
    // Default settings
    var defaults = {
      height: 500,
      itemHeight: 25,
      totalCount: 1000
    };

    // Private fields
    var $container,
        itemsPerScreen,
        lastRepaintOffset,
        lastScrolledTime,
        garbage = {},
        cache = {},
        gcInterval;

    /**
     * Renders item by calling third-party render function.
     *
     * @param      {number}  idx     Item index.
     */
    function renderItem(idx) {
      var item = options.render(idx);

      return $(item)
        .css('height', options.itemHeight + 'px')
        .css('position', 'absolute')
        .css('top', (idx * options.itemHeight) + 'px')
        .css('left', '0')
        .css('right', '0');
    }

    /**
     * Renders items from index idx to toIdx.
     *
     * @param      {number}  idx     First element index.
     * @param      {number}  toIdx   Last element index (not included).
     */
    function renderItemsFrom(idx, toIdx) {
      if (toIdx > options.totalCount) {
        toIdx = options.totalCount;
      }

      // marking invisible items for deletion
      Object.keys(cache).forEach(function (i) {
        if (i >= idx && i < toIdx) {
          return;
        }

        garbage[i] = cache[i];
        garbage[i].hide();
        delete cache[i];
      });

      // rendering visible items
      var i, items = [];
      for (i = idx; i < toIdx; i+=1) {
        if (cache[i] === undefined && garbage[i] === undefined) {
          // not yet rendered rendered
          cache[i] = renderItem(i);
          items.push(cache[i]);
        } else if (garbage[i] !== undefined) {
          // not yet garbage collected
          cache[i] = garbage[i];
          cache[i].show();
          delete garbage[i];
        }
      }

      $container.append(items);
    }

    /**
     * Collects garbage by removing hidden elements from DOM.
     */
    function gc() {
      if (Date.now() - lastScrolledTime < 100) {
        // do not do garbage collection while scrolling
        return;
      }

      Object.keys(garbage).forEach(function (i) {
        garbage[i].remove();
      });

      if (Object.keys(garbage).length > 0) {
        garbage = {};
      }
    }

    /**
     * Scroll event handler.
     *
     * @param      {Event}  event   JQuery Event object.
     */
    function onScroll(event) {
      var scrollTop = event.target.scrollTop;
      if (!lastRepaintOffset || Math.abs(scrollTop - lastRepaintOffset) > options.height) {
        // we scrolled more than 1 screen
        var firstIdx = parseInt(scrollTop / options.itemHeight) - itemsPerScreen;
        firstIdx = firstIdx < 0 ? 0 : firstIdx;

        // rendering items one screen before and one screen after the current position
        renderItemsFrom(firstIdx, firstIdx + 3 * itemsPerScreen);
        lastRepaintOffset = scrollTop;
      }

      lastScrolledTime = Date.now();
      event.preventDefault();
    }

    /**
     * Inits a table for a container.
     */
    function init() {
      $container = $(options.container);
      if ($container.length < 1) {
        throw new Error('Could not find ' + options.container + ' element in the DOM.');
      }

      options = $.extend({}, defaults, options);

      // init container
      $container
        .empty()
        .css('height', options.height + 'px')
        .css('overflow', 'auto')
        .css('position', 'relative')
        .css('padding', '0');

      $container.on('scroll', onScroll);

      // init hidden scroller
      $('<div />')
        .css('opacity', '0')
        .css('position', 'absolute')
        .css('top', 0)
        .css('left', 0)
        .css('width', '1px')
        .css('height', options.itemHeight * options.totalCount + 'px')
        .appendTo($container);

      // calculate number of items per screen
      itemsPerScreen = Math.ceil(options.height / options.itemHeight);

      // render first screen with some amount of cache
      renderItemsFrom(0, itemsPerScreen * 2);

      // delete hidden items periodically
      gcInterval = setInterval(gc, 300);
    }

    /**
     * Destroyes the table and all it's data.
     */
    function destroy() {
      $container.off('scroll');
      clearInterval(gcInterval);

      delete this.cache;
      delete this.garbage;
      $container.empty();
    }

    // Init
    init();

    // Public interface
    return {
      destroy: destroy
    };
  }

  // Export BigList class.
  $.extend(window, {
    BigList: BigList
  });

}(window, window.jQuery));
