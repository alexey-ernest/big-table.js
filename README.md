# big-table.js
High performance JavaScript table for large data sets.

* [Features](#features)
* [Demo](#demo)
* [Dependencies](#dependencies)
* [How to use](#how-to-use)
* [Options](#options)
* [Column definition](#column-definition)
* [API](#api)

## Features
* Virtual scrolling (only visible items are rendered), hence minimal memory usage.
* Super fast rendering: ~10ms.
* Items caching allows to avoid unnecessary re-rendering while scrolling fast up and down.
* Asynchronous garbage collection executes periodically when user stops scrolling which provides smooth user experience.
* Sortable columns: Numeric and String columns are sortable, sorting time about ~100ms for 100K data set of randomized values.
* Sorting order is cached and restored after a page reloads.
* Custom CSS classes and value formatters.
* Simple default css theme included.
* Optimized server and client-size JavaScript native ES5 code.


## Demo

```
$ npm install
$ npm start
```

```
Go to http://localhost:3000/
```

![](assets/screenshot.png?raw=true)


## Dependencies
No dependencies. All the logic implemented on native ES5 JavaScript.



## How to use


```
<link rel="stylesheet" href="/themes/default/theme.default.css">
<script src="/src/polyfills.js"></script>
<script src="/src/big-list.js"></script>
<script src="/src/big-table.js"></script>
```

```
var table = new BigTable({
  container: '.big-table',
  data: data,
  height: 500,
  itemHeight: 40,
  columns: columns
});
```

## Options
Option | Example | Description
:-- | :-- | :--
container | '.big-table' | jQuery selector to render the table in.
data | [...] | Data set.
height | 500 | Table height in pixels.
itemHeight | 30 | Row height in pixels.
columns | [...] | Array of column definitions.

## Column Definition
Param | Example | Description
:-- | :-- | :--
title | 'Name' | Column title.
type | String | Column type for correct sorting.
key | 'name' | Object key to get value.
format | function (val) { return val.toFixed(4); } | Custom value formatter.
css | {css_class: expression, ...} | Set of css classes with corresponding Boolean conditions to apply to a cell if a cell's value satisfies the condition.
sorted | true or false | Indicates whether the data should be initially sorted. True means ascending order, False - descending.

Example:
```
{
  title: 'Delta', 
  type: Number,
  key: 'delta',
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
}
```

## API

Method | Description
:-- | :--
destroy | Destroys the table and all it's data.
