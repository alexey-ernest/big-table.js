(function ($) {
  'use strict';

  // Export BigTable class.
  $.extend(window, {
    BigTable: BigTable
  });

  /**
   * Creates a new instance of BigTable
   *
   * @class      BigTable
   * @param      {Objects}  options    Table options.
   */
  function BigTable (options) {
    // Default settings
    var defaults = {
      height: 500,
      itemHeight: 25,
      totalCount: 1000
    }

    // Private fields
    var $container,
        $scroller,
        itemsPerScreen,
        lastRepaintOffset,
        lastScrolledTime,
        garbage = [];

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

      $container.scroll(onScroll);

      $scroller = $('<div />')
        .css('opacity', '0')
        .css('position', 'absolute')
        .css('top', 0)
        .css('left', 0)
        .css('width', '1px')
        .css('height', options.itemHeight * options.totalCount + 'px')
        .appendTo($container);

      itemsPerScreen = Math.ceil(options.height / options.itemHeight);

      // render first screen
      renderScreenFrom(0, itemsPerScreen * 2);

      // delete obsolete nodes periodically
      setInterval(gc, 300);
    }

    function renderScreenFrom(idx, toIdx) {
      if (toIdx > options.totalCount) {
        toIdx = options.totalCount;
      }

      // render visible items
      var i, items = [];
      for (i = idx; i < toIdx; i++) {
        items.push(renderItem(i));
      }

      // mark obsolete items for deletion
      $container.children().each(function (i, item) {
        if (i === 0) {
          // skip scroller
          return;
        }

        var $item = $(item);
        $item.hide();
        garbage.push($item);
      });

      $container.append(items);
    }

    function renderItem(idx) {
      var item = options.render(idx);
      return $(item)
        .css('height', options.itemHeight + 'px')
        .css('position', 'absolute')
        .css('top', (idx * options.itemHeight) + 'px');
    }

    function gc() {
      if (Date.now() - lastScrolledTime < 100 || !garbage.length) {
        return;
      }
      var i;
      for (i = 0; i < garbage.length; i++) {
        garbage[i].remove();
      }
      console.log('Removed ' + garbage.length);
      garbage.length = 0;
    }

    function onScroll(event) {
      var scrollTop = event.target.scrollTop;
      if (!lastRepaintOffset || Math.abs(scrollTop - lastRepaintOffset) > options.height) {
        // we scrolled more than 1 screen
        var firstIdx = parseInt(scrollTop / options.itemHeight) - itemsPerScreen;
        firstIdx = firstIdx < 0 ? 0 : firstIdx;
        
        // rendering items one screen before and one screen after the current position
        renderScreenFrom(firstIdx, firstIdx + 3 * itemsPerScreen);
        lastRepaintOffset = scrollTop;
      }

      lastScrolledTime = Date.now();
      event.preventDefault();
    }

    // Init
    init();

    return this;
  }
})
(window.jQuery);
