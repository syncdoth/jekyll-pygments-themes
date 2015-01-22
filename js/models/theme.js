/* global Definition */
(function(global) {
  'use strict';

  var _storage = JSON.parse(localStorage.pctb || '{}');

  // Bootstrap storage
  if (!_storage.user) {
    _storage.user = {};
  }

  if (!_storage.user.themes) {
    _storage.user.themes = {};
  }

  /**
   * Create a new theme instance
   *
   * @param {String} name         The name of the theme
   * @param {Object} definitions  The color and style definitions
   */
  function Theme(attrs) {
    var type;

    if (!(this instanceof Theme)) {
      throw new Error('Theme must be created with `new`');
    }
    attrs = attrs || {};

    for (var a in Theme.attributes) {
      type = Theme.attributes[a];

      if (Theme.converters[type]) {
        this[a] = Theme.converters[type](attrs[a]);
      } else {
        this[a] = attrs[a];
      }
    }
  }

  Theme.attributes = {
    name: 'string',
    definitions: 'Definition.models',
    createdAt: 'date',
    updatedAt: 'date'
  };

  Theme.converters = {
    date: function(raw) {
      var date = new Date(raw);
      return isFinite(date) ? date : null;
    },
    'Definition.models': function(raw) {
      var models = new ModelList();

      raw = raw || [];

      raw.forEach(function(data) {
        models.push(new Definition(data));
      }.bind(this));

      return models;
    }
  };

  Theme.serializers = {
    date: function(date) {
      return +date;
    },
    'Definition.models': function(list) {
      return list.serialize();
    }
  };

  /**
   * Find all themes.
   *
   * @param {Object} options  (Optional) The options for the request:
   *   {
   *     orderBy: {Object|[Object]} the order to return the results in, wher
   *                                the key is the property to sort on, and the
   *                                value is the direction: 'ASC' or 'DESC'.  If
   *                                an array of objects is passed, each will be
   *                                treated in order.
   *   }
   *
   *
   * @return {[Object]} An array of theme objects
   */
  Theme.findAll = function(options) {
    var themes = _storage.user.themes,
      themeList = new ModelList(),
      orderBys;

    options = options || {};

    // Build initial list
    Object.keys(themes).forEach(function(name) {
      themeList.push(new Theme(themes[name]));
    });

    if (options.orderBy) {
      orderBys = [].toString.apply(options.orderBy) === '[object Array]' ?
          options.orderBy : [options.orderBy];

      orderBys.forEach(function(orderBy) {
        orderBy = orderBy.split(' ');
        var property = orderBy[0],
          direction = orderBy[1].toUpperCase(),
          ret = 0;

        themeList.sort(function(a, b) {

          switch (Theme.attributes[property]) {
            case 'string':
              ret = a.attr(property).localeCompare(b.attr(property));
              break;
            case 'number':
            case 'date':
              ret = a.attr(property) - b.attr(property);
              break;
          }

          return direction === 'DESC' ? ret * -1 : ret;
        });
      });
    }

    return themeList.slice(options.offset || 0, options.limit);
  };

  Theme.findOne = function(name) {
    return this.findAll().filter(function(theme) {
      return theme.attr('name') === name;
    }).pop();
  };

  /**
   * Save the theme.  Updates `_storage` if the theme already exists, or creates
   * a new theme in `_storage`
   *
   * @param {Function} callback  The callback for once saving is complete.  If
   *                             the save operation was successful, it will pass
   *                             null to the callback; otherwise, the error
   *                             which caused the failure will be passed
   */
  Theme.prototype.save = function(callback) {
    var now = +new Date();
    callback = typeof callback === 'function' ? callback : function() {};

    this.createdAt = this.createdAt || now;
    this.updatedAt = now;
     _storage.user.themes[this.name] = this.serialize();

    localStorage.pctb = JSON.stringify(_storage);

    callback(null);
  };

  /**
   * Get a serialized representation of this object, ready for storing.
   *
   * @return {String} a JSON string representing this theme
   */
  Theme.prototype.serialize = function() {
    var serialized = {},
      type;

    for (var a in Theme.attributes) {
      type = Theme.attributes[a];

      if (Theme.serializers[type]) {
        serialized[a] = Theme.serializers[type](this.attr(a));
      } else {
        serialized[a] = this.attr(a);
      }
    }

    return serialized;
  };

  Theme.prototype.attr = function(name, value) {
    if (!Theme.attributes[name]) {
      throw new Error('Theme has no property `' + name + '`');
    }

    if (typeof value !== 'undefined') {
      if (Theme.converters[Theme.attributes[name]]) {
        this[name] = Theme.converters[Theme.attributes[name]](value);
      } else {
        this[name] = value;
      }
      return this;
    }

    return this[name];
  };

  function ModelList() {
  }

  ModelList.prototype = [];

  ModelList.prototype.serialize = function() {
    return this.map(function(model) {
      return model.serialize();
    });
  };

  ModelList.prototype.groupBy = function(property) {
    var grouped = {};

    this.forEach(function(model) {
      var val = model.attr(property);
      group[val] = group[val] || [];

      group[val].push(model);
    });

    return grouped;
  };

  global.Theme = Theme;
})(window);
